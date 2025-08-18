import { ReplyMarkup } from "../types/Component";
import { GridItem } from "../types/ComponentDetailForm";

type getCleanRowsProps = {
  parent_component: string | number;
  isDelete: boolean;
  sourceID: string;
  rows?: GridItem[][];
  targetNodeID: string;
};

type getConnectionReqsOut = {
  newRows: GridItem[][] | undefined;
  prev_target_component: number | null;
  anyOtherButton: string;
};

export function getConnectionReqs({
  // connection required vars
  rows,
  sourceID,
  parent_component,
  isDelete,
  targetNodeID,
}: getCleanRowsProps): getConnectionReqsOut {
  let prev_target_component: number | null = null;
  let anyOtherButton: string = "";
  const newRows: GridItem[][] | undefined = rows?.map((row) =>
    row.map((item) => {
      if (item.id === sourceID && !isDelete) {
        prev_target_component = item.next_component;
        return {
          ...item,
          next_component: Number(targetNodeID),
        };
      }
      if (item.next_component != null) {
        if (item.next_component == Number(targetNodeID)) {
          anyOtherButton = `e${parent_component}c${item.id}-${targetNodeID}`;
          return {
            ...item,
            next_component: null,
          };
        }
      }

      return item;
    }),
  );

  return { newRows, anyOtherButton, prev_target_component };
}

type makePayloadProps = {
  parent_component: string | number;
  markup_type?: "InlineKeyboard" | "ReplyKeyboard";
  rows?: GridItem[][];
};

export function makePayload({
  parent_component,
  markup_type,
  rows,
}: makePayloadProps) {
  const buttons = rows?.map((row) =>
    row.map(({ next_component, value }) =>
      next_component != null ? { value, next_component } : { value },
    ),
  );

  const payload = {
    parent_component: parent_component,
    markup_type: markup_type,
    buttons: buttons,
  };

  return payload;
}

type makeReplyMarkupProps = {
  rows: GridItem[][];
  data: ReplyMarkup;
};

type makeReplyMarkupOut = {
  buttons: GridItem[][] | undefined;
  reply_markup: ReplyMarkup | null;
};

export function makeReplyMarkup({
  rows,
  data,
}: makeReplyMarkupProps): makeReplyMarkupOut {
  let cnt = 0;
  const buttons: GridItem[][] | undefined = rows.map((row: GridItem[]) =>
    row.map((item: GridItem) => ({
      ...item,
      id: String(++cnt),
    })),
  );

  const reply_markup: ReplyMarkup | null =
    data && buttons ? { ...data, buttons: buttons } : null;

  return { buttons, reply_markup };
}
