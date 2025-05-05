import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from "reactflow";

import { useLoading, WorkflowParams } from "../pages/Workflow";

import api from "../services/api";

import { useParams } from "react-router-dom";

import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";

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

  const { botId } = useParams<WorkflowParams>();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const setLoading = useLoading();

  function deleteEdge() {
    setLoading(true);
    api
      .patch(`flow/${botId}/component/${id.split("-")[0].slice(1)}/`, {
        next_component: null,
      })
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
