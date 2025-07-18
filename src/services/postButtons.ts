import { toast } from "react-toastify";
import { GridItem } from "../types/ComponentDetailForm";
import api from "./api";
import { ReplyMarkup } from "../types/Component";
import { ReactFlowInstance } from "reactflow";

type postButtonProps = {
  botID: string | undefined;
  isPatch: boolean;
  rows: GridItem[][];
  markupID: number | undefined;
  parentID: number;
  markup_type: "InlineKeyboard" | "ReplyKeyboard";
  flowInstance: ReactFlowInstance;
};

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
      flowInstance.setNodes((nds) =>
        nds.map((item) =>
          item.id === parentID.toString() ?
            {
              ...item,
              data: {
                ...item.data,
                reply_markup: res.data,
              },
            }
          : item,
        ),
      );
    })
    .catch((err) => {
      toast(err.message);
    });
}
