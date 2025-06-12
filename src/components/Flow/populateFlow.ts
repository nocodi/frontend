import { ReactFlowInstance } from "reactflow";
import { ComponentType, ContentType } from "../../types/Component";
import { determineType, getContent } from "../../utils/freqFuncs";

type populateFlowProps = {
  flowInstance: ReactFlowInstance;
  components: ComponentType[] | undefined;
  contentTypes: ContentType[] | undefined;
};

export function populateFlow({
  flowInstance,
  components,
  contentTypes,
}: populateFlowProps) {
  if (components && contentTypes) {
    if (components.length > 0) {
      components.forEach((element: ComponentType) => {
        flowInstance.setNodes((nds) =>
          nds.concat({
            id: element.id.toString(),
            position: flowInstance.screenToFlowPosition({
              x: element.position_x,
              y: element.position_y,
            }),
            type: determineType(
              getContent(contentTypes, element.component_content_type),
            ),
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
