import { ComponentType, SchemaType } from "../types/Component";
import { useComponentDetails, useContentTypes } from "../services/getQueries";
import { useEffect, useState } from "react";

import Loading from "./Loading";
import api from "../services/api";
import { formValuesType } from "../types/ComponentDetailForm";
import { toast } from "react-toastify";

const ComponentDetail = ({
  node,
  setNode,
}: {
  node: ComponentType;
  setNode: React.Dispatch<React.SetStateAction<ComponentType | undefined>>;
}) => {
  const [formValues, setFormValues] = useState<formValuesType>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const { contentTypes } = useContentTypes();
  const [schemaOfComponent, setSchemaOfComponent] = useState<
    Record<string, SchemaType>
  >({});
  const contentOfComponent = contentTypes!.find(
    (contentType) => contentType.id === node.component_content_type,
  );

  console.log(contentOfComponent);
  const pathOfComponent = contentOfComponent!.path.split(".ir")[1];
  const { details, isFetching } = useComponentDetails(pathOfComponent, node.id);

  const validateField = (
    value: string,
    type: string,
    required: boolean,
  ): string => {
    if (required && !value.toString().trim()) {
      return "This field is required.";
    }

    if (value.toString().trim()) {
      if (type === "IntegerField" && !/^-?\d+$/.test(value)) {
        return "Please enter a valid integer.";
      }
      if (type === "BooleanField" && !/^(true|false)$/i.test(value)) {
        return "Please enter 'true' or 'false'.";
      }
      if (type === "CharField" && !/^[\w\s/]+$/.test(value)) {
        return "Only letters and numbers are allowed.";
      }
    }

    return "";
  };

  const handleChange = (key: string, value: File | string | null) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleBlur = (key: string, schemanode: SchemaType) => {
    const rawValue = formValues[key];
    let stringValue = "";

    if (typeof rawValue === "string") {
      stringValue = rawValue;
    } else if (rawValue instanceof File) {
      stringValue = rawValue.name;
    } else if (typeof rawValue === "number" || typeof rawValue === "boolean") {
      stringValue = rawValue.toString();
    } else if (rawValue != null) {
      stringValue = JSON.stringify(rawValue);
    }

    const error = validateField(
      stringValue,
      schemanode.type,
      schemanode.required,
    );

    if (error) {
      setErrors((prev) => ({ ...prev, [key]: error }));
    }
  };

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};
    Object.entries(schemaOfComponent).forEach(([key, value]) => {
      const rawValue = formValues[key];
      let stringValue = "";

      if (typeof rawValue === "string") {
        stringValue = rawValue;
      } else if (rawValue instanceof File) {
        stringValue = rawValue.name; // Or use "" if you want to skip validating file names
      } else if (rawValue != null) {
        stringValue = JSON.stringify(rawValue);
      }

      const error = validateField(stringValue, value.type, value.required);

      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const processedValues = { ...formValues };
    Object.entries(schemaOfComponent).forEach(([key, value]) => {
      if (value.type === "BooleanField") {
        if (processedValues[key] === "true") processedValues[key] = true;
        else if (processedValues[key] === "false") processedValues[key] = false;
        else delete processedValues[key];
      }
    });

    const formData = new FormData();
    Object.entries(processedValues).forEach(([key, val]) => {
      if (val !== null && val !== undefined) {
        if (
          schemaOfComponent[key]?.type === "FileField" &&
          val instanceof File
        ) {
          formData.append(key, val);
        } else if (
          typeof val === "string" ||
          typeof val === "number" ||
          typeof val === "boolean"
        ) {
          formData.append(key, val.toString());
        } else {
          formData.append(key, JSON.stringify(val)); // fallback for objects/arrays
        }
      }
    });

    setLoading(true);
    api
      .patch(`${pathOfComponent}${node.id}/`, formData)
      .then(() => {
        setNode(undefined);
      })
      .catch((err) => {
        toast(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCancel = () => {
    setNode(undefined);
    setFormValues({});
    setErrors({});
  };

  useEffect(() => {
    setSchemaOfComponent(
      Object.fromEntries(
        Object.entries(details ?? {}).map(([key, _]) => [
          key,
          contentOfComponent!.schema[key],
        ]),
      ),
    );
    setFormValues(details ?? {});
  }, [isFetching]);

  return (
    <dialog className="modal-open modal">
      <div className="modal-box bg-base-100">
        <h3 className="text-lg font-bold text-base-content">
          {contentOfComponent!.name}
        </h3>

        {loading || isFetching ?
          <Loading size={30} />
        : <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="mt-4 grid w-full grid-cols-1 sm:grid-cols-3 sm:gap-4">
              {Object.entries(schemaOfComponent).map(([key, value]) => (
                <div key={key} className="sm:col-span-3">
                  <label className="label mt-4 mb-2 text-base-content sm:mt-0">
                    {value?.verbose_name}
                    {value?.required && <span className="text-error">*</span>}
                  </label>
                  {value?.type === "BooleanField" ?
                    <select
                      id={key}
                      value={(formValues[key] as string) || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      onBlur={() => handleBlur(key, value)}
                      required={value.required}
                      className={`input-bordered input w-full text-base-content input-primary placeholder:text-base-content/50 sm:col-span-2 ${
                        errors[key] ? "border-error" : ""
                      }`}
                    >
                      <option value="">Select an option</option>
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  : value?.type === "FileField" ?
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      {typeof formValues[key] === "string" &&
                        formValues[key].length > 0 && (
                          <a
                            href={formValues[key]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link text-sm link-primary"
                          >
                            View uploaded file
                          </a>
                        )}
                      <input
                        id={key}
                        type="file"
                        onChange={(e) =>
                          handleChange(key, e.target.files?.[0] || null)
                        }
                        onBlur={() => handleBlur(key, value)}
                        required={value.required}
                        className={`file-input-bordered file-input w-full file-input-primary text-base-content file:ml-auto placeholder:text-base-content/50 ${
                          errors[key] ? "border-error" : ""
                        }`}
                      />
                    </div>
                  : <input
                      id={key}
                      type="text"
                      placeholder={key}
                      value={(formValues[key] as string) || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      onBlur={() => handleBlur(key, value)}
                      required={value?.required}
                      className={`input-bordered input w-full text-base-content input-primary placeholder:text-base-content/50 sm:col-span-2 ${
                        errors[key] ? "border-error" : ""
                      }`}
                    />
                  }

                  {errors[key] && (
                    <p className="mt-1 text-sm text-error">{errors[key]}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button type="button" className="btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        }
      </div>
      <form method="dialog" className="modal-backdrop" onClick={handleCancel}>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ComponentDetail;
