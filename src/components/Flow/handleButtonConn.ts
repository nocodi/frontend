import { toast } from "react-toastify";
import api from "../../services/api";
import { ComponentType, EdgeType, ReplyMarkup } from "../../types/Component";
import { Node, Edge, ReactFlowInstance } from "reactflow";
import {
  getConnectionReqs,
  makePayload,
  makeReplyMarkup,
} from "../../utils/buttonHelper";

type handleButtonConnProps = {
  botID: string | undefined;
  flowInstance: ReactFlowInstance;

  sourceParent: Node<ComponentType>;
  sourceNode: Node<ComponentType>;
  targetNodeID: string;
  isDelete: boolean;
};

export function handleButtonConn({
  botID,
  flowInstance,
  sourceParent,
  sourceNode,
  targetNodeID,
  isDelete,
}: handleButtonConnProps) {
  const parentID = sourceParent.data.id;
  const sourceID = sourceNode.id.split("c")[1];

  const { anyOtherButton, prev_target_component, newRows } = getConnectionReqs({
    isDelete,
    targetNodeID,
    parent_component: parentID,
    rows: sourceParent.data.reply_markup?.buttons,
    sourceID,
  });

  const payload = makePayload({
    parent_component: parentID,
    markup_type: sourceParent.data.reply_markup?.type,
    rows: newRows,
  });

  const markupID = sourceParent.data.reply_markup?.id;

  api
    .patch<ReplyMarkup>(`component/${botID}/markup/${markupID}/`, payload)
    .then((res) => {
      const { reply_markup } = makeReplyMarkup({
        rows: res.data.buttons,
        data: res.data,
      });
      flowInstance.setNodes((nds) => {
        // update parent
        const updatedNodes = nds.map((item) => {
          if (item.id === parentID.toString()) {
            return {
              ...item,
              data: {
                ...item.data,
                reply_markup: reply_markup,
              },
            };
          }
          return item;
        });
        return [...updatedNodes];
      });

      const newEdge: Edge<EdgeType> = {
        id: `e${sourceNode.id}-${targetNodeID}`,
        source: sourceNode.id,
        target: targetNodeID,
        type: "customEdge",
        data: {
          btnID: null,
        },
      };

      const prevEdgeId: string = `e${sourceNode.id}-${prev_target_component}`;

      flowInstance.deleteElements({ edges: [{ id: anyOtherButton }] });
      if (!isDelete) {
        flowInstance.deleteElements({ edges: [{ id: prevEdgeId }] });
        flowInstance.addEdges(newEdge);
      }
    })
    .catch((err) => {
      toast(err.message);
    });
}
