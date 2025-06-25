import { toast } from "react-toastify";
import { GridItem } from "../types/ComponentDetailForm";
import api from "./api";

type postButtonProps = {
  botID: string | undefined;
  isPatch: boolean;
  rows: GridItem[][];
  parentID: number;
  markup_type: "InlineKeyboard" | "ReplyKeyboard";
};

export function postButtons({
  botID,
  isPatch,
  rows,
  parentID,
  markup_type,
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
  console.log(payload);
  if (isPatch) {
    api
      .patch(`component/${botID}/markup/`, payload)
      .then()
      .catch((err) => {
        toast(err.message);
      });
  } else {
    api
      .post(`component/${botID}/markup/`, payload)
      .then()
      .catch((err) => {
        toast(err.message);
      });
  }
}
