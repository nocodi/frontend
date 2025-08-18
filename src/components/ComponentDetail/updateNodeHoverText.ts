import { Node } from "reactflow";
import { ComponentType } from "../../types/Component";

export function updateNodeHoverText(
  setNodes: React.Dispatch<
    React.SetStateAction<Node<ComponentType, string | undefined>[]>
  >,
  formData: FormData,
  nodeID: number | string,
) {
  let hover_text: string | null = null;

  if (formData.get("text")) {
    hover_text = formData.get("text") as string;
  } else if (formData.get("caption")) {
    hover_text = formData.get("caption") as string;
  }
  setNodes((nds) =>
    nds.map((item) =>
      item.id === nodeID.toString() ?
        {
          ...item,
          data: { ...item.data, hover_text: hover_text },
        }
      : item,
    ),
  );
}
