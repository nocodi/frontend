import { ComponentType, SchemaType } from "../types/Component";

import { useState } from "react";

const ComponentCard = ({ item }: { item: ComponentType }) => {
  const [formValues, setFormValues] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
      if (type === "BoolField" && !/^(true|false)$/i.test(value)) {
        return "Please enter 'true' or 'false'.";
      }

      if (type === "CharField" && !/[a-zA-Z]/.test(value)) {
        return "Please enter a valid text.";
      }
    }

    return "";
  };

  const handleBlur = (key: string, schemaItem: SchemaType) => {
    const error = validateField(
      formValues[key] || "",
      schemaItem.type,
      schemaItem.required,
    );
    if (error) {
      setErrors((prev) => ({ ...prev, [key]: error }));
    }
  };

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};
    Object.entries(item.schema).forEach(([key, value]) => {
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

    console.log("Form submitted:", formValues);
  };
  const handleCancel = () => {
    setFormValues({});
    setErrors({});
  };

  return (
    <div className="space-y-4 rounded-2xl bg-patina-300 p-6 shadow">
      <h2 className="royalblue-200 text-2xl font-bold">{item.name}</h2>
      <p className="text-patina-50">{item.description}</p>
      <div>
        <h3 className="royalblue-500 mb-2 text-lg font-semibold">Schema</h3>
        <ul className="space-y-3">
          {Object.entries(item.schema).map(([key, value]) => (
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
          ))}
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
  );
};

const ComponentDetail = (data: ComponentType) => {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      <ComponentCard item={data} />
    </div>
  );
};

export default ComponentDetail;
