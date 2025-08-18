import { Connection, Edge, Node, ReactFlowInstance } from "reactflow";
import { ComponentType, ContentType, EdgeType } from "../../types/Component";
import api from "../../services/api";
import { getPathOfContent } from "../../utils/freqFuncs";
import { toast } from "react-toastify";
import { loadingContextType } from "../../pages/Workflow";
import { handleButtonConn } from "./handleButtonConn";

type HandleConnProps = {
  botID: string | undefined;
  flowInstance: ReactFlowInstance;
  connection: Edge | Connection;
  contentTypes: ContentType[] | undefined;
  setLoading: loadingContextType;
};

type nodeType = undefined | Node<ComponentType>;

export function HandleConn({
  botID,
  flowInstance,
  connection,
  contentTypes,
  setLoading,
}: HandleConnProps) {
  if (connection.target && connection.source) {
    const sourceNode: nodeType = flowInstance.getNode(connection.source);

    const targetNode: nodeType = flowInstance.getNode(connection.target);

    const prevComponentId = connection.source;
    if (sourceNode && targetNode && contentTypes) {
      const sourceParent: nodeType = flowInstance.getNode(sourceNode.parentId!);
      const newEdgeId: string = `e${connection.source}-${connection.target}`;
      const exists = flowInstance.getEdge(newEdgeId);
      if (!exists) {
        setLoading(true);
        if (sourceNode.type == "button" && sourceParent) {
          const targetNodeID = connection.target;
          handleButtonConn({
            flowInstance,
            sourceParent,
            sourceNode,
            targetNodeID,
            botID,
            isDelete: false,
          });
          setLoading(false);
        } else {
          api
            .patch(
              `${getPathOfContent(targetNode.data.component_content_type, contentTypes)}${connection.target}/`,
              {
                previous_component: Number(prevComponentId),
              },
            )
            .then(() => {
              if (connection.source && connection.target) {
                const newEdge: Edge<EdgeType> = {
                  id: newEdgeId,
                  source: connection.source,
                  target: connection.target,
                  type: "customEdge",
                  data: {
                    btnID: null,
                  },
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
}
