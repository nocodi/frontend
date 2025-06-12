import { ContentType, ComponentType } from "../types/Component";
import { Node, XYPosition } from "reactflow";

export function getContent(
  contents: ContentType[],
  content_id: number,
): ContentType | undefined {
  return contents.find((content) => content.id === content_id);
}

export const getPathOfContent = (
  id: number,
  contentTypes: ContentType[],
): string | undefined => {
  const content = getContent(contentTypes, id);
  return content?.path?.split(".ir")[1];
};

export function makeNode(
  data: ComponentType,
  position: XYPosition,
): Node<ComponentType> {
  const {
    id,
    previous_component,
    component_name,
    component_type,
    component_content_type,
    position_x,
    position_y,
    reply_markup_supported,
  } = data;

  const componentData: ComponentType = {
    id,
    previous_component,
    component_name,
    component_content_type,
    component_type,
    position_x,
    position_y,
    hover_text: null,
    reply_markup_supported,
  };

  const newNode: Node<ComponentType> = {
    id: `${componentData.id}`,
    type: "customNode",
    position: position,
    selected: false,
    data: componentData,
  };

  return newNode;
}

export function sliceString(text: string, to: number): string {
  if (text.length > to) {
    return text.slice(0, to) + " ...";
  }

  return text;
}
