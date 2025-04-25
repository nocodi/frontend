import { ComponentType, ContentType, SchemaType } from "../types/Component";

import { Node } from "reactflow";
import api from "../services/api";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

const ComponentDetail = ({
  botId,
  node,
  setNode,
  nodes,
  setNodes,
  contentTypes,
}: {
  botId: number;
  node: ComponentType;
  setNode: React.Dispatch<React.SetStateAction<ComponentType | undefined>>;
  nodes: Node<ComponentType, string | undefined>[];
  setNodes: React.Dispatch<
    React.SetStateAction<Node<ComponentType, string | undefined>[]>
  >;
  contentTypes: ContentType[];
}) => {
  const [formValues, setFormValues] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  const handleChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const schemaOfComponent: ContentType = contentTypes[node.content_type - 10];

  const validateField = (
    value: string,
    type: string,
    required: boolean,
  ): string => {
    if (required && !value.trim()) {
      return "This field is required.";
    }

    if (value.trim()) {
      if (type === "IntegerField" && !/^-?\d+$/.test(value)) {
        return "Please enter a valid integer.";
      }
      if (type === "BooleanField" && !/^(true|false)$/i.test(value)) {
        return "Please enter 'true' or 'false'.";
      }

      if (type === "CharField" && !/[a-zA-Z]/.test(value)) {
        return "Please enter a valid text.";
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
    const newErrors: { [key: string]: string } = {};
    Object.entries(schemaOfComponent.schema).forEach(([key, value]) => {
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
    setLoading(true);
    if (!node.object_id) {
      api
        .post(`${schemaOfComponent.path.split(".ir")[1]}`, formValues)
        .then((res) => {
          const objId: number = res.data.id;
          api
            .patch(`flow/${botId}/component/${node.id}/`, {
              object_id: objId,
            })
            .then((res) => {
              const objId: number = res.data.object_id;
              setNodes(() =>
                nodes.map((item) =>
                  item.id === node.id.toString() ?
                    {
                      ...item,
                      data: {
                        ...item.data,
                        object_id: objId,
                      },
                    }
                  : item,
                ),
              );
            })
            .catch((err) => {
              toast(err.message);
            })
            .finally(() => {
              setLoading(false);
            });
          setNode(undefined);
        })
        .catch((err) => {
          toast(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      api
        .patch(
          `${schemaOfComponent.path.split(".ir")[1]}${node.object_id}`,
          formValues,
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
    if (node.object_id) {
      api
        .get(`${schemaOfComponent.path.split(".ir")[1]}${node.object_id}`)
        .then((res) => {
          const { id, timestamp, ...rest } = res.data;
          console.log(rest);
          setFormValues(rest);
        })
        .catch((err) => {
          toast(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="mx-auto h-[calc(100vh-2rem)] max-w-3xl space-y-6 overflow-y-auto p-4">
      <div className="space-y-4 rounded-2xl bg-patina-300 p-6 shadow">
        {loading ?
          <svg
            className="mx-auto h-6 w-6 animate-spin text-cream-900"
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
              stroke-width="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        : <>
            <h1 className="royalblue-200 text-2xl font-bold">{node.name}</h1>
            <h2 className="royalblue-200 text-2xl font-bold">
              {schemaOfComponent.name}
            </h2>
            <p className="text-patina-50">{schemaOfComponent.description}</p>
            <div>
              <h3 className="royalblue-500 mb-2 text-lg font-semibold">
                Schema
              </h3>
              <ul className="space-y-3">
                {Object.entries(schemaOfComponent.schema).map(
                  ([key, value]) => (
                    <li key={key} className="text-gray-800">
                      <label className="mb-1 block font-medium" htmlFor={key}>
                        {key}{" "}
                        {value.required ?
                          <span className="text-red-500">*</span>
                        : <></>}
                      </label>
                      {value.type === "BooleanField" ?
                        <select
                          id={key}
                          value={formValues[key] ?? ""}
                          onChange={(e) => handleChange(key, e.target.value)}
                          onBlur={() => handleBlur(key, value)}
                          required={value.required}
                          className={`w-full rounded-lg border px-3 py-2 ${
                            errors[key] ? "border-red-500" : "border-gray-300"
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
                          value={formValues[key] ?? ""}
                          onChange={(e) => handleChange(key, e.target.value)}
                          onBlur={() => handleBlur(key, value)}
                          required={value.required}
                          className={`w-full rounded-lg border px-3 py-2 ${
                            errors[key] ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                      }
                      {errors[key] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors[key]}
                        </p>
                      )}
                    </li>
                  ),
                )}
              </ul>
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={handleSubmit}
                  className="btn-patina btn mt-6 h-8 w-fit rounded-md bg-patina-500 text-white transition-all hover:bg-patina-700"
                >
                  Submit
                </button>

                <button
                  onClick={handleCancel}
                  className="btn-patina btn mt-6 h-8 w-fit rounded-md bg-white text-patina-500 transition-all hover:bg-patina-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        }
      </div>
    </div>
  );
};

export default ComponentDetail;
