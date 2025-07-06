import { ContentType, ComponentType } from "../types/Component";
import { Node, XYPosition } from "reactflow";
import { GridItem } from "../types/ComponentDetailForm";

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
  return content?.path;
};

type makeButtonProps = {
  id: number;
  button: GridItem;
  parentID: number;
  x: number;
  y: number;
};

export function makeButton({
  id,
  button,
  parentID,
  x,
  y,
}: makeButtonProps): Node<ComponentType> {
  const componentData: ComponentType = {
    id: Number(`${parentID}${id}b`),
    previous_component: null,
    component_name: button.value,
    component_type: "BUTTON",
    component_content_type: 0,
    position_x: x,
    position_y: y,
    reply_markup_supported: false,
    reply_markup: null,
    hover_text: null,
  };
  const newButton: Node<ComponentType> = {
    id: `${parentID}${id}b`,
    type: "button",
    position: { x: x, y: y },
    selected: false,
    draggable: false,
    data: componentData,
    parentId: parentID.toString(),
  };

  return newButton;
}

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
    reply_markup,
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
    reply_markup,
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
