import { ContentType } from "../types/Component";
import api from "./api";

export default async function getContentTypes(): Promise<ContentType[]> {
  const response = await api.get("/flow/contenttypes/");
  const data: ContentType[] = await response.data;

  return data;
}
