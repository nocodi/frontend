import { GridItem } from "./ComponentDetailForm";

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

export type ReplyMarkup = {
  id: number;
  buttons: GridItem[][];
  type: "InlineKeyboard" | "ReplyKeyboard";
  parent_component: number | null;
};

export type ContentType = {
  id: number;
  name: string;
  description: string;
  path: string;
  type: string;
  component_type: "TELEGRAM" | "TRIGGER" | "CONDITIONAL" | "CODE" | "STATE";
  schema: Record<string, SchemaType>;
  reply_markup: null;
  reply_markup_supported: boolean;
};

export type ComponentType = {
  id: number | string;
  previous_component: number | null;
  component_name: string;
  component_type:
    | "TELEGRAM"
    | "TRIGGER"
    | "CONDITIONAL"
    | "CODE"
    | "BUTTON"
    | "GROUP";

  component_content_type: number;
  hover_text: string | null;
  position_x: number;
  position_y: number;
  reply_markup: ReplyMarkup | null;
  reply_markup_supported: boolean;
};

export type EdgeType = {
  btnID: null | string;
};
