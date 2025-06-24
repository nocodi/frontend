export type formValuesType = Record<string, string | boolean | null | File>;

export type KeyboardType = "InlineKeyboard" | "ReplyKeyboard";

export type GridItem = {
  id: string;
  next_component: number | null;
  value: string;
};
