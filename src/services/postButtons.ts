import { toast } from "react-toastify";
import { GridItem } from "../types/ComponentDetailForm";
import api from "./api";
import { ReplyMarkup } from "../types/Component";
import { ReactFlowInstance } from "reactflow";
import { makeButton } from "../utils/freqFuncs";

type postButtonProps = {
  botID: string | undefined;
  isPatch: boolean;
  rows: GridItem[][];
  markupID: number | undefined;
  parentID: number | string;
  markup_type: "InlineKeyboard" | "ReplyKeyboard";
  flowInstance: ReactFlowInstance;
};

export function findPosition(rowLength: number): number[] {
  // let adder: number = 120 / (rowLength + 1);
  // let arr: number[] = [];
  // for (let index = 0; index < rowLength; index++) {
  //   arr = [...arr, adder];
  //   adder += 40;
  // }
  // return arr;
  if (rowLength === 1) {
    return [60];
  }
  if (rowLength === 2) {
    return [40, 80];
  }
  return [15, 60, 105];
}

export function postButtons({
  botID,
  isPatch,
  rows,
  markupID,
  parentID,
  markup_type,
  flowInstance,
}: postButtonProps) {
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
      flowInstance.setNodes((nds) => {
        // update parent
        const updatedNodes = nds.map((item) => {
          if (item.id === parentID.toString()) {
            return {
              ...item,
              data: {
                ...item.data,
                reply_markup: { ...res.data },
              },
            };
          }
          return item;
        });

        // Filter out all old child button nodes of parent
        const cleanedNodes = updatedNodes.filter(
          (item) => !item.id.startsWith(`${parentID}-`), // child nodes start with parentID-
        );
        // Generate new buttons
        let cnt = 0;
        const newButtonNodes = rows.flatMap((row, rowIndex) => {
          const arr = findPosition(row.length);
          return row.map((button, colIndex) => {
            return makeButton({
              id: ++cnt, // unique ID for each button
              button: button,
              parentID: String(parentID),
              x: arr[colIndex],
              y: 40 * rowIndex + 100,
            });
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
