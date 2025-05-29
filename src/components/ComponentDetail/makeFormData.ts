import { SchemaType } from "../../types/Component";
import { formValuesType } from "../../types/ComponentDetailForm";

export type componentSchemaType = {
  [k: string]: SchemaType;
};

export function makeFormData(
  componentSchema: componentSchemaType,
  override: formValuesType | undefined,
  formValues: formValuesType,
): FormData {
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

  return formData;
}
