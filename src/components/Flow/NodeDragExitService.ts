import { toast } from "react-toastify";
import api from "../../services/api";
import { ContentType } from "../../types/Component";
import { getPathOfContent } from "../../utils/freqFuncs";
import { Node, useReactFlow } from "reactflow";
import { loadingContextType } from "../../pages/Workflow";

export type DraggingNodeXY = {
  x: number;
  y: number;
};

export function NodeDragExitService(
  draggingNodeXY: DraggingNodeXY,
  node: Node,
  contentTypes: ContentType[] | undefined,
  setLoading: loadingContextType,
) {
  const flowInstance = useReactFlow();
  if (
    draggingNodeXY.x !== node.position.x &&
    draggingNodeXY.y !== node.position.y &&
    contentTypes
  ) {
    setLoading(true);
    api
      .patch(
        `${getPathOfContent(node.data.component_content_type, contentTypes)}${node.id}/`,
        {
          position_x: node.position.x,
          position_y: node.position.y,
        },
      )
      .then(() => {})
      .catch((err) => {
        flowInstance.setNodes((nds) =>
          nds.map((item) =>
            item.id === node.id ?
              {
                ...item,
                position: { x: draggingNodeXY.x, y: draggingNodeXY.y },
              }
            : item,
          ),
        );
        toast(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }
}
