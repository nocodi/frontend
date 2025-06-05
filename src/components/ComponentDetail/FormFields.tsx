import { HelpCircle } from "lucide-react";
import Tooltip from "../Tooltip";
import { componentSchemaType } from "./makeFormData";
import { validateField } from "./validateField";
import { parseRawValue } from "./parseRawValue";
import { formValuesType } from "../../types/ComponentDetailForm";
import { SchemaType } from "../../types/Component";

type FormFieldsProps = {
  componentSchema: componentSchemaType;
  formValues: formValuesType;
  formErrors: Record<string, string>;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setFormValues: React.Dispatch<React.SetStateAction<formValuesType>>;
};

export default function FormFields({
  componentSchema,
  formValues,
  formErrors,
  setFormValues,
  setFormErrors,
}: FormFieldsProps) {
  const handleChange = (key: string, value: File | string | null) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleBlur = (key: string, fieldSchema: SchemaType) => {
    const error = validateField(
      parseRawValue(formValues[key]),
      fieldSchema.type,
      fieldSchema.required,
    );

    setFormErrors((prev) => ({ ...prev, [key]: error }));
  };

  return (
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
                onChange={(e) => handleChange(key, e.target.files?.[0] || null)}
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
  );
}
