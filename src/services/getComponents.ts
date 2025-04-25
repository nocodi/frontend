import { ComponentType } from "../types/Component";
import api from "./api";

export default async function getContentTypes(): Promise<ComponentType[]> {
  const response = await api.get("/flow/contenttypes/");
  const data: ComponentType[] = await response.data;

  return data;
}
