import { ComponentType, SchemaType } from "../types/Component";
import Loading from "./Loading";
import api from "../services/api";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useContentTypes } from "./ContentTypesContext";

const ComponentDetail = ({
  node,
  setNode,
}: {
  node: ComponentType;
  setNode: React.Dispatch<React.SetStateAction<ComponentType | undefined>>;
}) => {
  const [formValues, setFormValues] = useState<{
    [key: string]: string | boolean;
  }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const { contentTypes } = useContentTypes();

  const [schemaOfComponent, setSchemaOfComponent] = useState<
    Record<string, SchemaType>
  >({});
  const contentOfComponent = contentTypes!.find(
    (contentType) => contentType.id === node.component_content_type,
  );
  const pathOfComponent = contentOfComponent!.path.split(".ir")[1];

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

  const handleChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleBlur = (key: string, schemanode: SchemaType) => {
    const error = validateField(
      formValues[key]?.toString() || "",
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
      const error = validateField(
        formValues[key]?.toString() || "",
        value.type,
        value.required,
      );
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

    setLoading(true);
    api
      .patch(`${pathOfComponent}${node.id}/`, processedValues)
      .then(() => {
        setNode(undefined);
        setIsOpen(false);
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
    setIsOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    api
      .get(`${pathOfComponent}${node.id}`)
      .then((res) => {
        const {
          id,
          previous_component,
          component_name,
          component_type,
          component_content_type,
          position_x,
          position_y,
          bot,
          object_id,
          content_type,
          ...rest
        } = res.data;

        setFormValues(rest);
        setSchemaOfComponent(
          Object.fromEntries(
            Object.entries(rest).map(([key, _]) => [
              key,
              contentOfComponent!.schema[key],
            ]),
          ),
        );
      })
      .catch((err) => {
        toast(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (!isOpen) return null;

  return (
    <dialog className="modal-open modal">
      <div className="modal-box bg-base-100">
        <h3 className="text-lg font-bold text-base-content">
          {contentOfComponent!.name}
        </h3>

        {loading ?
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
                    {key}
                    {value.required && <span className="text-error">*</span>}
                  </label>
                  {value.type === "BooleanField" ?
                    <select
                      id={key}
                      value={formValues[key]?.toString() || ""}
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
                  : <input
                      id={key}
                      type="text"
                      placeholder={key}
                      value={formValues[key]?.toString() || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      onBlur={() => handleBlur(key, value)}
                      required={value.required}
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
