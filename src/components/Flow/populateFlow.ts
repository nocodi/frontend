import { ReactFlowInstance, Node, Edge, EdgeProps } from "reactflow";
import { ComponentType } from "../../types/Component";
import { GridItem } from "../../types/ComponentDetailForm";
import { makeButton } from "../../utils/freqFuncs";

type populateFlowProps = {
  flowInstance: ReactFlowInstance;
  setNodes: React.Dispatch<
    React.SetStateAction<Node<ComponentType, string | undefined>[]>
  >;
  setEdges: React.Dispatch<React.SetStateAction<Edge<EdgeProps>[]>>;
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
        setNodes((nds) =>
          nds.concat({
            id: element.id.toString(),
            position: flowInstance.screenToFlowPosition({
              x: element.position_x,
              y: element.position_y,
            }),
            width: element.reply_markup_supported ? 400 : 200,
            height: element.reply_markup_supported ? 400 : 200,
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
        if (element.reply_markup) {
          let cnt = 0;
          element.reply_markup.buttons.forEach((rows: GridItem[]) => {
            rows.forEach((button: GridItem) => {
              const node = makeButton({
                cnt: cnt,
                button: button,
                parentID: element.id,
                x: 30,
                y: 30,
              });
              setNodes((nds) => nds.concat(node));
              cnt++;
            });
          });
        }

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
