import { ReactFlowInstance, Node, Edge } from "reactflow";
import { ComponentType, EdgeType } from "../../types/Component";
import { GridItem } from "../../types/ComponentDetailForm";
import { makeButton } from "../../utils/freqFuncs";

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
          element.reply_markup.buttons.forEach((rows: GridItem[]) => {
            rows.forEach((button: GridItem) => {
              const node = makeButton({
                id: cnt,
                button: button,
                parentID: Number(element.id),
                x: 180,
                y: 40 * cnt,
              });
              setNodes((nds) => nds.concat(node));
              cnt++;
            });
          });
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
