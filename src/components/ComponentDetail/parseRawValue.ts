import { formValuesType } from "../../types/ComponentDetailForm";

export function parseRawValue(rawValue: formValuesType[string]): string {
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
}
