import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from "reactflow";
import { useLoading } from "../pages/Workflow";
import api from "../services/api";
import { toast } from "react-toastify";
import { useContentTypes } from "./ContentTypesContext";

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

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const setLoading = useLoading();
  const contentTypes = useContentTypes()[0];

  function deleteEdge() {
    setLoading(true);
    const targetNode = flowInstance.getNode(id.split("-")[1]);
    if (contentTypes && targetNode) {
      api
        .patch(
          `${contentTypes[targetNode.data.component_content_type - 11].path.split(".ir")[1]}${id.split("-")[1]}/`,
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
          <svg
            onClick={() => {
              deleteEdge();
            }}
            className="mx-auto h-3 w-3 cursor-pointer text-base-content hover:text-patina-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
