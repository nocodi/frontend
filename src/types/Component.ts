export interface SchemaType {
  type: string;
  required: boolean;
}

export interface ComponentType {
  id: number;
  name: string;
  description: string;
  path: string;
  type: string;
  schema: Record<string, SchemaType>;
}
