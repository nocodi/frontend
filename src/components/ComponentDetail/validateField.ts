import { SchemaType } from "../../types/Component";

export function validateField(
  value: string,
  type: SchemaType["type"],
  required: boolean,
): string {
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
  if (type === "CharField" && !/^[\w\s./]+$/.test(value)) {
    return "Only letters and numbers are allowed.";
  }
  if (type === "IntegerField" && !/^-?\d+$/.test(value)) {
    return "Please enter a valid integer.";
  }
  // TODO FloatField

  return "";
}
