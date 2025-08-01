import { toast } from "react-toastify";
import api from "../../services/api";
import { ComponentType, EdgeType, ReplyMarkup } from "../../types/Component";
import { Node, Edge, ReactFlowInstance } from "reactflow";
import { GridItem } from "../../types/ComponentDetailForm";

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
  let prev_target_component: number | null = 0;
  let anyOtherButton: string = "";
  const sourceNodeID = sourceNode.id.split("c")[1];

  const rows: GridItem[][] | undefined =
    sourceParent.data.reply_markup?.buttons;

  const newRows: GridItem[][] | undefined = rows?.map((row) =>
    row.map((item) => {
      if (item.id === sourceNodeID && !isDelete) {
        prev_target_component = item.next_component;
        return {
          ...item,
          next_component: Number(targetNodeID),
        };
      }
      if (item.next_component != null) {
        if (item.next_component == Number(targetNodeID)) {
          anyOtherButton = `e${sourceParent.id}c${item.id}-${targetNodeID}`;
          return {
            ...item,
            next_component: null,
          };
        }
      }

      return item;
    }),
  );

  const buttons = newRows?.map((row) =>
    row.map(({ next_component, value }) =>
      next_component != null ? { value, next_component } : { value },
    ),
  );

  const payload = {
    parent_component: sourceParent.data.id,
    markup_type: sourceParent.data.reply_markup?.type,
    buttons: buttons,
  };

  const markupID = sourceParent.data.reply_markup?.id;

  api
    .patch<ReplyMarkup>(`component/${botID}/markup/${markupID}/`, payload)
    .then((res) => {
      let cnt = 0;
      const buttons: GridItem[][] | undefined = res.data.buttons.map(
        (row: GridItem[]) =>
          row.map((item: GridItem) => ({
            ...item,
            id: String(++cnt),
          })),
      );

      const reply_markup: ReplyMarkup | null =
        res.data && buttons ? { ...res.data, buttons: buttons } : null;
      flowInstance.setNodes((nds) => {
        // update parent
        const updatedNodes = nds.map((item) => {
          if (item.id === sourceParent.id) {
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
