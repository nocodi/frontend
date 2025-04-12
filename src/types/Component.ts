import { Node } from "reactflow";

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

export type NodeComponent = {
  object_id?: number;
  next_component?: Node<NodeComponent>;
  name: string;
  content_type: ComponentType;
};
