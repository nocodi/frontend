import { NodeComponent, SchemaType } from "../types/Component";
import { Node } from "reactflow";
import { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
const ComponentDetail = ({
  botId,
  node,
  setNode,
  nodes,
  setNodes,
}: {
  botId: number;
  node: Node<NodeComponent>;
  setNode: React.Dispatch<
    React.SetStateAction<Node<NodeComponent> | undefined>
  >;
  nodes: Node<NodeComponent>[];
  setNodes: React.Dispatch<
    React.SetStateAction<Node<NodeComponent, string | undefined>[]>
  >;
}) => {
  const [formValues, setFormValues] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  //const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

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
      formValues[key] || "",
      schemanode.type,
      schemanode.required,
    );
    if (error) {
      setErrors((prev) => ({ ...prev, [key]: error }));
    }
  };

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};
    Object.entries(node.data.content_type.schema).forEach(([key, value]) => {
      const error = validateField(
        formValues[key] || "",
        value.type,
        value.required,
      );
      if (error) newErrors[key] = error;
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    api
      .post(`${node.data.content_type.path.split(".ir")[1]}`, formValues)
      .then((res) => {
        const objId: number = res.data.id;
        api
          .patch(`flow/${botId}/component/${node.id}/`, {
            object_id: objId,
          })
          .then((res) => {
            const objId: number = res.data.id;
            setNodes(() =>
              nodes.map((item) =>
                item.id === node.id ?
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

            setNode(undefined);
            setFormValues({});
            setErrors({});
          })
          .catch((err) => {
            toast(err.message);
          });
      })
      .catch((err) => {
        toast(err.message);
      });
    // .finally(() => {
    //   setLoading(false);
    // });
  };
  const handleCancel = () => {
    setNode(undefined);
    setFormValues({});
    setErrors({});
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      <div className="space-y-4 rounded-2xl bg-patina-300 p-6 shadow">
        <h2 className="royalblue-200 text-2xl font-bold">{node.data.name}</h2>
        <p className="text-patina-50">{node.data.content_type.description}</p>
        <div>
          <h3 className="royalblue-500 mb-2 text-lg font-semibold">Schema</h3>
          <ul className="space-y-3">
            {Object.entries(node.data.content_type.schema).map(
              ([key, value]) => (
                <li key={key} className="text-gray-800">
                  <label className="mb-1 block font-medium" htmlFor={key}>
                    {key}{" "}
                    <span className="royalblue-50 text-sm">
                      ({value.type}, {value.required ? "required" : "optional"})
                    </span>
                  </label>
                  <input
                    id={key}
                    type="text"
                    placeholder={key}
                    value={formValues[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    onBlur={() => handleBlur(key, value)}
                    required={value.required}
                    className={`w-full rounded-lg border px-3 py-2 ${
                      errors[key] ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors[key] && (
                    <p className="mt-1 text-sm text-red-600">{errors[key]}</p>
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
      </div>
    </div>
  );
};

export default ComponentDetail;
