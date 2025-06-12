import { ReactFlowInstance } from "reactflow";
import { ComponentType } from "../../types/Component";

type populateFlowProps = {
  flowInstance: ReactFlowInstance;
  components: ComponentType[] | undefined;
};

export function populateFlow({ flowInstance, components }: populateFlowProps) {
  if (components) {
    if (components.length > 0) {
      components.forEach((element: ComponentType) => {
        flowInstance.setNodes((nds) =>
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

        if (element.previous_component) {
          const previous_component: number = element.previous_component;
          flowInstance.setEdges((edg) =>
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
