export type SchemaType = {
  type: string;
  required: boolean;
};

export type ComponentType = {
  id: number;
  name: string;
  description: string;
  path: string;
  type: string;
  schema: Record<string, SchemaType>;
};
