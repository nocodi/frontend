export type SchemaType = {
  type:
    | "BooleanField"
    | "CharField"
    | "IntegerField"
    | "FloatField"
    | "FileField"
    | "TextField"
    | "ArrayField"
    | "OneToOneField";
  required: boolean;
  help_text: string;
  max_length: number;
  verbose_name: string;
  choices: Record<string, string> | null;
};

export type ContentType = {
  id: number;
  name: string;
  description: string;
  path: string;
  type: string;
  schema: Record<string, SchemaType>;
};

export type ComponentType = {
  id: number;
  previous_component: number | null;
  component_name: string;
  component_type: "TELEGRAM" | "TRIGGER" | "CONDITIONAL" | "CODE";
  component_content_type: number;
  position_x: number;
  position_y: number;
};
