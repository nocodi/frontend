import { ComponentType, SchemaType } from "../types/Component";
import { useComponentDetails, useContentTypes } from "../services/getQueries";
import { useEffect, useState } from "react";
import { HelpCircle } from "lucide-react";
import Tooltip from "./Tooltip";

import Loading from "./Loading";
import api from "../services/api";
import { formValuesType } from "../types/ComponentDetailForm";
import { toast } from "react-toastify";
import CodeEditor from "./CodeEditor";

const parseRewValue = (rawValue: formValuesType[string]) => {
  if (typeof rawValue === "string") {
    return rawValue;
  } else if (rawValue instanceof File) {
    return rawValue.name;
  } else if (typeof rawValue === "number" || typeof rawValue === "boolean") {
    return rawValue.toString();
  } else if (rawValue != null) {
    return JSON.stringify(rawValue);
  }
  return "";
};

const validateField = (
  value: string,
  type: SchemaType["type"],
  required: boolean,
): string => {
  if (required && !value.toString().trim()) {
    return "This field is required.";
  }

  if (!value.toString().trim()) return "";

  if (type === "FileField" && value === null) {
    return "Please provide a file";
  }

  if (type === "BooleanField" && !/^(true|false)$/i.test(value)) {
    return "Please select 'true' or 'false'.";
  }
  if (type === "CharField" && !/^[\w\s/]+$/.test(value)) {
    return "Only letters and numbers are allowed.";
  }
  if (type === "IntegerField" && !/^-?\d+$/.test(value)) {
    return "Please enter a valid integer.";
  }
  // TODO FloatField

  return "";
};

type PropsType = {
  node: ComponentType;
  onClose: () => unknown;
};

const ComponentDetail = ({ node, onClose }: PropsType) => {
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<formValuesType>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { contentTypes } = useContentTypes();
  const contentType = contentTypes!.find(
    (i) => i.id === node.component_content_type,
  )!;

  const componentPath = contentType.path.split(".ir")[1];
  const { details, isFetching } = useComponentDetails(componentPath, node.id);

  const componentSchema = Object.fromEntries(
    Object.keys(details ?? {}).map((key) => [key, contentType.schema[key]]),
  );
  useEffect(() => {
    setFormValues(details ?? {});
  }, [details]);

  const handleChange = (key: string, value: File | string | null) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleBlur = (key: string, fieldSchema: SchemaType) => {
    const error = validateField(
      parseRewValue(formValues[key]),
      fieldSchema.type,
      fieldSchema.required,
    );

    setFormErrors((prev) => ({ ...prev, [key]: error }));
  };

  const handleSubmit = (override?: formValuesType) => {
    const formData = new FormData();
    Object.entries(componentSchema).forEach(([key, schema]) => {
      const value = override?.[key] ?? formValues[key];
      if (value === null || value === undefined || !schema) return;

      if (schema.type === "FileField") {
        if (value instanceof File) formData.append(key, value);
      } else if (schema.type === "BooleanField") {
        if (value == "true" || value == "false") formData.append(key, value);
      } else if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        formData.append(key, value.toString());
      } else {
        formData.append(key, JSON.stringify(value)); // fallback for objects/arrays
      }
    });

    setLoading(true);
    api
      .patch(`${componentPath}${node.id}/`, formData)
      .then(() => {
        onClose();
      })
      .catch((err) => {
        toast(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCancel = () => {
    onClose();
    setFormValues({});
    setFormErrors({});
  };

  const modalBox =
    "code" in contentType.schema ?
      <div className="modal-box max-w-4xl p-0">
        <CodeEditor
          initialValue={(details?.code ?? "") as string}
          onSubmit={(updatedCode: string) => {
            handleSubmit({ code: updatedCode });
            onClose();
          }}
          onDiscard={onClose}
        />
      </div>
    : <div className="modal-box bg-base-100">
        <h3 className="text-lg font-bold text-base-content">
          {contentType.name}
        </h3>

        {isFetching ?
          <Loading size={30} />
        : <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="mt-4 grid w-full grid-cols-1 sm:grid-cols-3 sm:gap-4">
              {Object.entries(componentSchema).map(([key, value]) => (
                <div key={key} className="sm:col-span-3">
                  <label className="label mt-4 mb-2 flex items-center gap-2 text-base-content sm:mt-0">
                    {value?.verbose_name}
                    {value?.required && <span className="text-error">*</span>}
                    {value?.help_text && (
                      <Tooltip content={value.help_text}>
                        <HelpCircle className="size-4 cursor-help text-base-content/70 hover:text-base-content" />
                      </Tooltip>
                    )}
                  </label>
                  {value?.type === "BooleanField" ?
                    <select
                      id={key}
                      value={(formValues[key] as string) || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      onBlur={() => handleBlur(key, value)}
                      required={value.required}
                      className={`input-bordered input w-full text-base-content input-primary placeholder:text-base-content/50 sm:col-span-2 ${formErrors[key] && "border-error"}`}
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
                        required={value.required && formValues[key] === null}
                        className={`file-input w-full file-input-primary text-base-content file:ml-auto placeholder:text-base-content/50 ${formErrors[key] && "border-error"}`}
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
                      className={`input-bordered input w-full text-base-content input-primary placeholder:text-base-content/50 sm:col-span-2 ${formErrors[key] && "border-error"}`}
                    />
                  }
                  {formErrors[key] && (
                    <p className="mt-1 text-sm text-error">{formErrors[key]}</p>
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
      </div>;

  return (
    <dialog className="modal-open modal">
      {modalBox}
      <form method="dialog" className="modal-backdrop" onClick={handleCancel}>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ComponentDetail;
