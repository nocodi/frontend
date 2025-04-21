export type SchemaType = {
  type: string;
  required: boolean;
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
  next_component: number | null;
  name: string;
  content_type: number;
  object_id: number | null;
  position_x: number;
  position_y: number;
};
