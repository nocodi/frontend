import { ContentType } from "../types/Component";

export const getPathOfContent = (
  id: number,
  contentTypes: ContentType[],
): string | undefined => {
  const content = contentTypes?.find((content) => content.id === id);
  return content?.path?.split(".ir")[1];
};
