import { ReactFlowInstance } from "reactflow";

export function updateNodeHoverText(
  flowInstance: ReactFlowInstance,
  formData: FormData,
  nodeID: number,
) {
  let hover_text: string = "no text/caption";

  if (formData.get("text") != null) {
    hover_text = formData.get("text") as string;
  } else if (formData.get("caption") != null) {
    hover_text = formData.get("caption") as string;
  }
  flowInstance.setNodes((nds) =>
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
