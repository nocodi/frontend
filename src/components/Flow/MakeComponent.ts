import { ReactFlowInstance } from "reactflow";
import { ComponentType, ContentType } from "../../types/Component";
import api from "../../services/api";
import { makeNode } from "../../utils/freqFuncs";
import { toast } from "react-toastify";

export function MakeComponent(
  flowInstance: ReactFlowInstance,
  content: ContentType,
  setUnattendedComponent: React.Dispatch<
    React.SetStateAction<ComponentType | undefined>
  >,
  x?: number,
  y?: number,
) {
  const position = flowInstance.screenToFlowPosition({
    x: x ?? window.innerWidth / 2 + Math.random() * 50 + 1,
    y: y ?? window.innerHeight / 2 + Math.random() * 50 + 1,
  });
  const dataPayload: Record<string, unknown> = {
    component_content_type: content.id,
    component_name: content.name,
    position_x: position.x,
    position_y: position.y,
    previous_component: null,
  };

  if (content.schema && "chat_id" in content.schema) {
    dataPayload.chat_id = ".chat.id";
  }
  api
    .post(`${content.path.split(".ir")[1]}`, dataPayload)
    .then((res) => {
      const newNode = makeNode(res.data as ComponentType, position);
      flowInstance.addNodes(newNode);
      setUnattendedComponent(newNode.data);
    })
    .catch((err) => {
      toast(err.message);
    });
}
