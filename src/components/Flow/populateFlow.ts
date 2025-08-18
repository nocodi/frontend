import { ReactFlowInstance, Node, Edge } from "reactflow";
import { ComponentType, EdgeType, ReplyMarkup } from "../../types/Component";
import { GridItem } from "../../types/ComponentDetailForm";
import { makeButton } from "../../utils/freqFuncs";
import { findPosition } from "../ComponentDetail/handleButtons";

type populateFlowProps = {
  flowInstance: ReactFlowInstance;
  setNodes: React.Dispatch<
    React.SetStateAction<Node<ComponentType, string | undefined>[]>
  >;
  setEdges: React.Dispatch<React.SetStateAction<Edge<EdgeType>[]>>;
  components: ComponentType[] | undefined;
};

export function populateFlow({
  flowInstance,
  setNodes,
  setEdges,
  components,
}: populateFlowProps) {
  if (components) {
    if (components.length > 0) {
      components.forEach((element: ComponentType) => {
        let cnt = 0;

        const buttons: GridItem[][] | undefined =
          element.reply_markup?.buttons.map((row: GridItem[]) =>
            row.map((item: GridItem) => ({
              ...item,
              id: String(++cnt),
            })),
          );

        const reply_markup: ReplyMarkup | null =
          element.reply_markup && buttons ?
            { ...element.reply_markup, buttons: buttons }
          : null;

        // add components
        setNodes((nds) =>
          nds.concat({
            id: element.id.toString(),
            position: flowInstance.screenToFlowPosition({
              x: element.position_x,
              y: element.position_y,
            }),
            type: "customNode",
            selected: false,
            data: {
              ...element,
              reply_markup: reply_markup,
              hover_text:
                element.hover_text != null && element.hover_text != "" ?
                  element.hover_text
                : null,
            },
          }),
        );

        element.reply_markup = reply_markup;

        // add reply markup
        if (element.reply_markup) {
          const newButtonNodes = element.reply_markup.buttons.flatMap(
            (row: GridItem[], rowIndex) => {
              const arr = findPosition(row.length);
              return row.map((button: GridItem, colIndex) => {
                const newButton: Node<ComponentType> = makeButton({
                  id: Number(button.id),
                  button: button,
                  parentID: String(element.id),
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
            },
          );
          setNodes((nds) => nds.concat(newButtonNodes));
        }

        // add edges
        if (element.previous_component) {
          const previous_component: number = element.previous_component;
          setEdges((edg) =>
            edg.concat({
              id: `e${previous_component}-${element.id}`,
              source: previous_component.toString(),
              target: element.id.toString(),
              type: "customEdge",
            }),
          );
        }
      });
    }
  }
}
