import { ContentType, ComponentType } from "../types/Component";
import { Node, XYPosition } from "reactflow";

export const getPathOfContent = (
  id: number,
  contentTypes: ContentType[],
): string | undefined => {
  const content = contentTypes?.find((content) => content.id === id);
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
  } = data;

  const componentData: ComponentType = {
    id,
    previous_component,
    component_name,
    component_content_type,
    component_type,
    position_x,
    position_y,
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
