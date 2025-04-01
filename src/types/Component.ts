interface ComponentType {
  id: number;
  name: string;
  description: string;
  path: string;
  type: string;
  schema?: Record<string, string>;
}

export default ComponentType;
