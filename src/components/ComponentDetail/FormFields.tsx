import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import Tooltip from "../Tooltip";
import { componentSchemaType } from "./makeFormData";
import { validateField } from "./validateField";
import { parseRawValue } from "./parseRawValue";
import { formValuesType } from "../../types/ComponentDetailForm";
import { SchemaType } from "../../types/Component";
import { useState } from "react";

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
  const [showOptionalFields, setShowOptionalFields] = useState(false);

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

  const hasRequiredFields = Object.values(componentSchema).some(
    (field) => field.required,
  );
  const shouldShowOptionsButton =
    Object.keys(componentSchema).length > 5 && hasRequiredFields;

  const renderField = (key: string, value: SchemaType) => (
    <div key={key} className="sm:col-span-3">
      <div className="card bg-base-200/30 transition-all duration-200 hover:bg-base-200/50">
        <div className="card-body p-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="flex items-center gap-2 text-base-content">
              <span className="font-medium">{value?.verbose_name}</span>
              {value?.required && <span className="text-error">*</span>}
              {value?.help_text && (
                <Tooltip content={value.help_text}>
                  <HelpCircle className="size-4 cursor-help text-base-content/70 hover:text-base-content" />
                </Tooltip>
              )}
            </label>
            {value?.required && (
              <span className="badge badge-sm badge-primary">Required</span>
            )}
          </div>
          {value?.type === "BooleanField" ?
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    id={key}
                    checked={formValues[key] === "true"}
                    onChange={(e) =>
                      handleChange(key, e.target.checked.toString())
                    }
                    onBlur={() => handleBlur(key, value)}
                    className="peer sr-only"
                  />
                  <div className="peer h-7 w-14 rounded-full bg-base-300 peer-checked:bg-success peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"></div>
                </label>
                <div className="flex flex-col">
                  <span
                    className={`text-sm font-medium ${formValues[key] === "true" ? "text-success" : "text-base-content/70"}`}
                  >
                    {formValues[key] === "true" ? "Enabled" : "Disabled"}
                  </span>
                  {value?.help_text && (
                    <span className="text-xs text-base-content/50">
                      {value.help_text}
                    </span>
                  )}
                </div>
              </div>
              {formErrors[key] && (
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-error">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">{formErrors[key]}</span>
                </p>
              )}
            </div>
          : value?.type === "FileField" ?
            <div className="flex flex-col gap-2">
              {typeof formValues[key] === "string" &&
                formValues[key].length > 0 && (
                  <div className="flex items-center gap-2 rounded-lg bg-base-100 p-3 transition-colors duration-200 hover:bg-base-200">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-primary"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <a
                        href={formValues[key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link truncate text-sm font-medium link-primary hover:underline"
                      >
                        View uploaded file
                      </a>
                      <span className="truncate text-xs text-base-content/50">
                        {formValues[key].split("/").pop()}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleChange(key, null)}
                      className="btn btn-circle btn-ghost btn-sm hover:bg-error/10 hover:text-error"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              <div className="relative">
                <div className="flex items-center gap-2">
                  <input
                    id={key}
                    type="file"
                    onChange={(e) =>
                      handleChange(key, e.target.files?.[0] || null)
                    }
                    onBlur={() => handleBlur(key, value)}
                    required={value.required && formValues[key] === null}
                    className={`file-input w-full file-input-primary text-base-content transition-all duration-200 file:ml-auto hover:bg-base-200/50 focus:bg-base-100 ${
                      formErrors[key] ?
                        "border-error focus:border-error focus:ring-error"
                      : "focus:ring-2 focus:ring-primary/20"
                    }`}
                  />
                  {formValues[key] && (
                    <button
                      type="button"
                      onClick={() => handleChange(key, null)}
                      className="btn btn-ghost btn-sm hover:bg-error/10 hover:text-error"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {formErrors[key] && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-sm text-error">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">{formErrors[key]}</span>
                  </p>
                )}
              </div>
            </div>
          : <div className="flex flex-col gap-2">
              <input
                id={key}
                type="text"
                value={(formValues[key] as string) || ""}
                onChange={(e) => handleChange(key, e.target.value)}
                onBlur={() => handleBlur(key, value)}
                required={value?.required}
                placeholder={`Enter ${value?.verbose_name?.toLowerCase()}`}
                className={`input-bordered input w-full text-base-content transition-all duration-200 input-primary hover:bg-base-200/50 focus:bg-base-100 sm:col-span-2 ${
                  formErrors[key] ?
                    "border-error focus:border-error focus:ring-error"
                  : "focus:ring-2 focus:ring-primary/20"
                }`}
              />
              {formErrors[key] && (
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-error">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">{formErrors[key]}</span>
                </p>
              )}
            </div>
          }
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Object.entries(componentSchema)
        .sort(([, a], [, b]) => {
          // First sort by required status
          if (a.required && !b.required) return -1;
          if (!a.required && b.required) return 1;

          // If both are required or both are optional, sort by type
          if (a.required === b.required) {
            // For optional fields, prioritize boolean fields
            if (!a.required && !b.required) {
              if (a.type === "BooleanField" && b.type !== "BooleanField")
                return -1;
              if (a.type !== "BooleanField" && b.type === "BooleanField")
                return 1;
            }

            // Then sort by field type
            const typeOrder = {
              TextField: 0,
              BooleanField: 1,
              FileField: 2,
            };

            const typeA = typeOrder[a.type as keyof typeof typeOrder] ?? 3;
            const typeB = typeOrder[b.type as keyof typeof typeOrder] ?? 3;

            if (typeA !== typeB) return typeA - typeB;
          }

          // Finally sort alphabetically by verbose_name
          return (a.verbose_name || "").localeCompare(b.verbose_name || "");
        })
        .map(([key, value]) => {
          if (
            shouldShowOptionsButton &&
            !value.required &&
            !showOptionalFields
          ) {
            return null;
          }
          return renderField(key, value);
        })}

      {shouldShowOptionsButton && (
        <div className="col-span-full mt-2">
          <button
            type="button"
            onClick={() => setShowOptionalFields(!showOptionalFields)}
            className="group btn w-full bg-base-200/50 text-base-content btn-ghost transition-all duration-300 hover:bg-base-200"
          >
            <span className="flex items-center justify-center gap-2">
              {showOptionalFields ?
                <>
                  <span>Hide Optional Fields</span>
                  <ChevronUp className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
                </>
              : <>
                  <span>Show Optional Fields</span>
                  <ChevronDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </>
              }
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
