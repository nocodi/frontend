import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  UploadCloud,
  Trash2,
  FileCheck2,
  FileClock,
} from "lucide-react";
import { componentSchemaType } from "./makeFormData";
import { validateField } from "./validateField";
import { parseRawValue } from "./parseRawValue";
import { formValuesType } from "../../types/ComponentDetailForm";
import { SchemaType } from "../../types/Component";
import { useMemo, useState } from "react";

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

  const canCollapse =
    Object.keys(componentSchema).length > 5 &&
    Object.values(componentSchema).some((field) => field.required);

  const [isCollapsed, setIsCollapsed] = useState(true);

  const sortedFields = useMemo(
    () =>
      Object.entries(componentSchema).sort(([, a], [, b]) => {
        // First sort by required status
        if (a.required && !b.required) return -1;
        if (!a.required && b.required) return 1;

        // Then sort by type
        const typeOrder = {
          TextField: 0,
          CharField: 0,
          BooleanField: a.required ? 1 : -1, // For optional fields, prioritize boolean fields
          FileField: 2,
          IntegerField: 3,
          FloatField: 3,
          ArrayField: 4,
          OneToOneField: 4,
        };

        const typeA = typeOrder[a.type];
        const typeB = typeOrder[b.type];

        if (typeA != typeB) return typeA - typeB;

        // Finally sort alphabetically by verbose_name
        return (a.verbose_name || "").localeCompare(b.verbose_name || "");
      }),
    [componentSchema],
  );

  const renderField = (key: string, value: SchemaType) => (
    <div
      key={key}
      className="grid grid-cols-2 rounded-xl border border-base-300 bg-base-200 p-2"
    >
      <div className="col-span-1 flex items-center gap-2 self-start py-2 pl-4">
        <span className="font-medium">{value?.verbose_name} </span>
        {value?.required && (
          <span className="badge badge-sm badge-accent">Required</span>
        )}
        {value?.help_text && (
          <span className="tooltip tooltip-right" data-tip={value.help_text}>
            <HelpCircle className="size-4 cursor-help text-base-content/70 hover:text-base-content" />
          </span>
        )}
      </div>
      {value?.type === "BooleanField" ?
        <input
          type="checkbox"
          id={key}
          checked={formValues[key] === "true"}
          onChange={(e) => handleChange(key, e.target.checked.toString())}
          onBlur={() => handleBlur(key, value)}
          className="toggle my-2 mr-2 ml-auto toggle-lg toggle-primary"
        />
      : value?.type === "FileField" ?
        <div className="join flex justify-end">
          {typeof formValues[key] === "string" ?
            <a
              href={formValues[key]}
              target="_blank"
              rel="noopener noreferrer"
              className="tooltip join-item flex min-w-0 items-center gap-2 border border-primary bg-base-100 transition-colors duration-200 hover:bg-base-200"
              data-tip={`Uploaded File: ${formValues[key].split("/").pop()}`}
            >
              <FileCheck2 className="ml-2 size-6" />
              <span className="truncate text-xs">
                {formValues[key].split("/").pop()}
              </span>
            </a>
          : typeof formValues[key] === "object" && formValues[key] ?
            <span className="join-item flex min-w-0 items-center gap-2 border border-primary bg-base-100 transition-colors duration-200 hover:bg-base-200">
              <FileClock className="ml-2 size-6" />
              <span className="truncate text-xs">{formValues[key].name}</span>
            </span>
          : null}
          <label
            className={`tooltip btn join-item btn-outline btn-accent ${formValues[key] !== null && "px-1.5"}`}
            data-tip="Select File"
          >
            <input
              type="file"
              onChange={(e) => handleChange(key, e.target.files?.[0] || null)}
              onBlur={() => handleBlur(key, value)}
              required={value.required && formValues[key] === null}
              className="hidden"
            />
            <UploadCloud className="size-4" />
          </label>
          {formValues[key] !== null && (
            <button
              className="tooltip btn join-item px-1.5 btn-outline btn-error"
              onClick={() => handleChange(key, null)}
              data-tip="Clear"
            >
              <Trash2 className="size-4" />
            </button>
          )}
        </div>
      : value.type == "TextField" ?
        <div>
          <textarea
            id={key}
            value={(formValues[key] as string) || ""}
            onChange={(e) => handleChange(key, e.target.value)}
            onBlur={() => handleBlur(key, value)}
            required={value?.required}
            placeholder={`Enter ${value?.verbose_name?.toLowerCase()}`}
            className={`textarea w-full text-base-content transition-all duration-200 textarea-primary hover:bg-base-200/50 focus:bg-base-100 sm:col-span-2 ${
              formErrors[key] ?
                "border-error focus:border-error focus:ring-error"
              : "focus:ring-2 focus:ring-primary/20"
            }`}
            rows={5}
          />
        </div>
      : <div>
          <input
            id={key}
            type="text"
            value={(formValues[key] as string) || ""}
            onChange={(e) => handleChange(key, e.target.value)}
            onBlur={() => handleBlur(key, value)}
            required={value?.required}
            placeholder={`Enter ${value?.verbose_name?.toLowerCase()}`}
            className={`input w-full text-base-content transition-all duration-200 input-primary hover:bg-base-200/50 focus:bg-base-100 sm:col-span-2 ${
              formErrors[key] ?
                "border-error focus:border-error focus:ring-error"
              : "focus:ring-2 focus:ring-primary/20"
            }`}
          />
        </div>
      }
      {formErrors[key] && (
        <p className="flex items-center gap-2 pl-4 font-medium text-error">
          <CircleAlert className="size-4" />
          <span>{formErrors[key]}</span>
        </p>
      )}
    </div>
  );

  return (
    <div className="flex w-full flex-col gap-1 text-base-content">
      {sortedFields.map(([key, value]) => {
        if (canCollapse && isCollapsed && !value.required) return null;
        return renderField(key, value);
      })}

      {canCollapse && (
        <>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="group btn w-full btn-ghost transition-all duration-300 btn-accent"
          >
            <span className="flex items-center justify-center gap-2">
              {isCollapsed ?
                <>
                  <span>Show Optional Fields</span>
                  <ChevronDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </>
              : <>
                  <span>Hide Optional Fields</span>
                  <ChevronUp className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
                </>
              }
            </span>
          </button>
        </>
      )}
    </div>
  );
}
