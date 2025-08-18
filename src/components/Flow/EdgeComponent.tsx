import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from "reactflow";

import { Trash2 } from "lucide-react";
import api from "../../services/api";
import { getPathOfContent } from "../../utils/freqFuncs";
import { toast } from "react-toastify";
import { useContentTypes } from "../../services/getQueries";
import { useLoading } from "../../pages/Workflow";
import { handleButtonConn } from "./handleButtonConn";
import { useParams } from "react-router-dom";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}: EdgeProps) {
  const flowInstance = useReactFlow();
  const { botId: botID } = useParams<{ botId: string }>();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const setLoading = useLoading();
  const { contentTypes } = useContentTypes();
  const sourceID: string = id.split("-")[0].slice(1);
  const targetNodeID: string = id.split("-")[1];

  function deleteEdge() {
    setLoading(true);

    const targetNode = flowInstance.getNode(targetNodeID);
    const sourceNode = flowInstance.getNode(sourceID)!;

    if (contentTypes && targetNode) {
      if (sourceNode.type == "button") {
        const sourceParent = flowInstance.getNode(sourceNode.parentId!);
        if (sourceParent) {
          handleButtonConn({
            botID,
            flowInstance,
            sourceParent,
            sourceNode,
            targetNodeID,
            isDelete: true,
          });
          setLoading(false);
        }
      } else {
        api
          .patch(
            `${getPathOfContent(targetNode.data.component_content_type, contentTypes)}${targetNodeID}/`,
            {
              previous_component: null,
            },
          )
          .then(() => {
            flowInstance.deleteElements({ edges: [{ id: id }] });
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

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 10,
            pointerEvents: "all",
            backgroundColor: "parent",
            padding: 10,
            borderRadius: 8,
            color: "parent",
          }}
          className="nodrag nopan"
        >
          <Trash2
            className="h-3 w-3 cursor-pointer text-base-content hover:text-patina-400"
            onClick={() => {
              deleteEdge();
            }}
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
