import { toast } from "react-toastify";
import { GridItem } from "../../types/ComponentDetailForm";
import api from "../../services/api";
import { ComponentType, EdgeType, ReplyMarkup } from "../../types/Component";
import { Node, Edge } from "reactflow";
import { makeButton } from "../../utils/freqFuncs";

type handleButtonProps = {
  botID: string | undefined;
  isPatch: boolean;
  rows: GridItem[][];
  markupID: number | undefined;
  parentID: number | string;
  markup_type: "InlineKeyboard" | "ReplyKeyboard";
  setNodes: React.Dispatch<
    React.SetStateAction<Node<ComponentType, string | undefined>[]>
  >;
  setEdges: React.Dispatch<React.SetStateAction<Edge<EdgeType>[]>>;
};

export function findPosition(rowLength: number): number[] {
  if (rowLength === 1) {
    return [60];
  }
  if (rowLength === 2) {
    return [40, 80];
  }
  return [15, 60, 105];
}

export function handleButtons({
  botID,
  isPatch,
  rows,
  markupID,
  parentID,
  markup_type,
  setNodes,
  setEdges,
}: handleButtonProps) {
  const buttons = rows.map((row) =>
    row.map(({ next_component, value }) =>
      next_component ? { value, next_component } : { value },
    ),
  );

  const payload = {
    parent_component: parentID,
    markup_type: markup_type,
    buttons: buttons,
  };

  const method = isPatch ? "patch" : "post";
  const url =
    isPatch ?
      `component/${botID}/markup/${markupID}/`
    : `component/${botID}/markup/`;
  api
    .request<ReplyMarkup>({
      method,
      url,
      data: payload,
    })
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

      setNodes((nds) => {
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

        // Filter out all old child button nodes of parent
        const cleanedNodes = updatedNodes.filter(
          (item) => !item.id.startsWith(`${parentID}-`), // child nodes start with parentID-
        );

        // edges to delete
        const oldNodeIDs: string[] = updatedNodes
          .filter((item) => item.id.startsWith(`${parentID}c`))
          .map((item) => item.id);

        setEdges((eds) =>
          eds.filter((edge) => !oldNodeIDs.includes(edge.source)),
        );

        // Generate new buttons
        const newButtonNodes = buttons.flatMap((row, rowIndex) => {
          const arr = findPosition(row.length);
          return row.map((button, colIndex) => {
            const newButton = makeButton({
              id: button.id, // unique ID for each button
              button: button,
              parentID: String(parentID),
              x: arr[colIndex],
              y: 40 * rowIndex + 100,
            });
            if (button.next_component) {
              setEdges((edg) =>
                edg.concat({
                  id: `e${newButton.id}-${button.next_component}`,
                  source: newButton.id,
                  target: button.next_component!.toString(),
                  type: "customEdge",
                  data: {
                    btnID: null,
                  },
                }),
              );
            }
            return newButton;
          });
        });

        // Return the new full nodes
        return [...cleanedNodes, ...newButtonNodes];
      });
    })
    .catch((err) => {
      toast(err.message);
    });
}
