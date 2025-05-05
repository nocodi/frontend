import { ComponentType, ContentType, SchemaType } from "../types/Component";

import { Node } from "reactflow";
import api from "../services/api";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const ComponentDetail = ({
  node,
  setNode,
  nodes,
  setNodes,
  contentTypes,
}: {
  node: ComponentType;
  setNode: React.Dispatch<React.SetStateAction<ComponentType | undefined>>;
  nodes: Node<ComponentType, string | undefined>[];
  setNodes: React.Dispatch<
    React.SetStateAction<Node<ComponentType, string | undefined>[]>
  >;
  contentTypes: ContentType[];
}) => {
  const [formValues, setFormValues] = useState<{
    [key: string]: string | boolean;
  }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const [schemaOfComponent, setSchemaOfComponent] = useState<
    Record<string, SchemaType>
  >({});
  const contentOfComponent = contentTypes.find(
    (contentType) => contentType.id == node.component_content_type,
  )!;

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
      if (type === "CharField" && !/^[a-zA-Z0-9]+$/.test(value)) {
        return "Only letters and numbers are allowed.";
      }
    }

    return "";
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
    if (schemaOfComponent) {
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
          if (processedValues[key]) {
            if (processedValues[key] === "true") processedValues[key] = true;
            else if (processedValues[key] === "false")
              processedValues[key] = false;
          } else {
            delete processedValues[key];
          }
        }
      });
      setLoading(true);

      api
        .patch(
          `${contentOfComponent.path.split(".ir")[1]}${node.id}/`,
          processedValues,
        )
        .then(() => {
          setNode(undefined);
        })
        .catch((err) => {
          toast(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const handleCancel = () => {
    setNode(undefined);
    setFormValues({});
    setErrors({});
  };

  useEffect(() => {
    setLoading(true);
    api
      .get(`${contentOfComponent.path.split(".ir")[1]}${node.id}`)
      .then((res) => {
        const {
          id,
          previous_component,
          component_name,
          component_type,
          component_content_type,
          position_x,
          position_y,
          ...rest
        } = res.data;

        setFormValues(rest);

        setSchemaOfComponent(
          Object.fromEntries(
            Object.entries(rest).map(([key, _]) => [
              key,
              contentOfComponent.schema[key],
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

  return (
    <div className="m-auto max-h-[calc(100vh-2rem)] max-w-3xl space-y-4 overflow-y-auto rounded-2xl bg-base-100 p-6 text-base-300 shadow">
      {loading ?
        <svg
          className="mx-auto h-6 w-6 animate-spin text-[#58A6FF]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      : <>
          {/* <h1 className="text-2xl font-bold text-base-content">
              {node.name}
            </h1> */}
          <button
            onClick={handleCancel}
            className="btn float-right cursor-pointer p-2 btn-outline btn-primary"
          >
            <svg
              className="h-6 w-6"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18 17.94 6M18 18 6.06 6"
              />
            </svg>
          </button>
          <h2 className="text-xl font-semibold text-base-content">
            {contentOfComponent.name}
          </h2>
          <p className="text-gray-400">{contentOfComponent.description}</p>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-base-content">
              Schema
            </h3>
            <ul className="space-y-3">
              {Object.entries(schemaOfComponent).map(([key, value]) => (
                <li key={key} className="text-primary">
                  <label
                    className="mb-1 block border-primary font-medium"
                    htmlFor={key}
                  >
                    {key}{" "}
                    {value.required ?
                      <span className="text-red-500">*</span>
                    : <></>}
                  </label>
                  {value.type === "BooleanField" ?
                    <select
                      id={key}
                      value={formValues[key]?.toString() || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      onBlur={() => handleBlur(key, value)}
                      required={value.required}
                      className={`w-full rounded-lg border bg-base-300 px-3 py-2 text-base-content ${
                        errors[key] ? "border-red-500" : "border-primary"
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
                      className={`w-full rounded-lg border bg-base-300 px-3 py-2 text-base-content ${
                        errors[key] ? "border-red-500" : "border-primary"
                      }`}
                    />
                  }
                  {errors[key] && (
                    <p className="mt-1 text-sm text-red-500">{errors[key]}</p>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleSubmit}
                className="btn float-right cursor-pointer p-3 btn-primary"
              >
                Submit
              </button>
              <button
                onClick={handleCancel}
                className="btn float-right cursor-pointer p-2 btn-outline btn-primary"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      }
    </div>
  );
};

export default ComponentDetail;
