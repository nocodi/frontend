import { ReactFlowInstance, Node, Edge } from "reactflow";
import { ComponentType, EdgeType } from "../../types/Component";
import { GridItem } from "../../types/ComponentDetailForm";
import { makeButton } from "../../utils/freqFuncs";
import { findPosition } from "../../services/postButtons";

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
              hover_text:
                element.hover_text != null && element.hover_text != "" ?
                  element.hover_text
                : null,
            },
          }),
        );

        // add reply markup
        if (element.reply_markup) {
          let cnt = 0;
          const newButtonNodes = element.reply_markup.buttons.flatMap(
            (row: GridItem[], rowIndex) => {
              const arr = findPosition(row.length);
              return row.map((button: GridItem, colIndex) => {
                return makeButton({
                  id: ++cnt,
                  button: button,
                  parentID: String(element.id),
                  x: arr[colIndex],
                  y: 40 * rowIndex + 100,
                });
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
