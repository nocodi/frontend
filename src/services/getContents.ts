import { ContentType } from "../types/Component";
import api from "./api";

export default async function getContentTypes(): Promise<ContentType[]> {
  const response = await api.get("/content-type/");
  const data: ContentType[] = await response.data;

  return data;
}
