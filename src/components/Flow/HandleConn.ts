import {
  Connection,
  DefaultEdgeOptions,
  Edge,
  Node,
  ReactFlowInstance,
} from "reactflow";
import { ComponentType, ContentType } from "../../types/Component";
import api from "../../services/api";
import { getPathOfContent } from "../../utils/freqFuncs";
import { toast } from "react-toastify";
import { loadingContextType } from "../../pages/Workflow";

export function HandleConn(
  flowInstance: ReactFlowInstance,
  connection: Edge | Connection,
  contentTypes: ContentType[] | undefined,
  setLoading: loadingContextType,
) {
  if (connection.target && connection.source) {
    const targetNode: undefined | Node<ComponentType> = flowInstance.getNode(
      connection.target,
    );

    const prevComponentId: number = parseInt(connection.source);
    if (targetNode && contentTypes) {
      const newEdgeId: string = `e${connection.source}-${connection.target}`;
      const exists = flowInstance.getEdge(newEdgeId);
      if (!exists) {
        setLoading(true);
        api
          .patch(
            `${getPathOfContent(targetNode.data.component_content_type, contentTypes)}${connection.target}/`,
            {
              previous_component: prevComponentId,
            },
          )
          .then(() => {
            if (connection.source && connection.target) {
              const newEdge: Edge<DefaultEdgeOptions> = {
                id: newEdgeId,
                source: connection.source,
                target: connection.target,
                type: "customEdge",
              };

              const prevEdgeId: string = `e${targetNode.data.previous_component}-${newEdge.target}`;
              // update previous_component of targetNode

              flowInstance.setNodes((nds) =>
                nds.map((item) =>
                  item.id === targetNode.id ?
                    {
                      ...item,
                      data: {
                        ...item.data,
                        previous_component: parseInt(connection.source!),
                      },
                    }
                  : item,
                ),
              );
              // update new edge
              flowInstance.deleteElements({ edges: [{ id: prevEdgeId }] });
              flowInstance.addEdges(newEdge);
            }
          })
          .catch((err) => {
            toast(err.message);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }
}
