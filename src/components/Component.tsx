import { Handle, Position, useReactFlow, NodeProps } from "reactflow";
import { NodeComponent } from "../types/Component";
import api from "../services/api";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { WorkflowParams } from "../pages/Workflow";

function Component({ id, data, isConnectable }: NodeProps<NodeComponent>) {
  const instance = useReactFlow();
  const { botId } = useParams<WorkflowParams>();

  function deleteComponent() {
    api
      .delete(`flow/${botId}/component/${id}/`)
      .then(() => {
        instance.deleteElements({ nodes: [{ id: id }] });
      })
      .catch((err) => {
        toast(err.message);
      });
  }

  return (
    <div className="group flex flex-col items-center gap-1">
      <div className="invisible flex h-3 w-10 flex-row justify-end gap-0.5 opacity-0 transition-opacity duration-300 ease-in group-hover:visible group-hover:opacity-100">
        <svg
          onClick={() => deleteComponent()}
          className="h-3 w-3 cursor-pointer text-white hover:text-accent"
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

        <svg
          className="h-3 w-3 cursor-pointer hover:text-accent dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="5"
            d="M6 12h.01m6 0h.01m5.99 0h.01"
          />
        </svg>
      </div>
      <div className="relative h-9 w-13 cursor-pointer rounded-lg border-2 border-patina-400 bg-patina-200 text-center shadow-lg">
        <div>
          <Handle
            type="source"
            position={Position.Right}
            isConnectable={isConnectable}
            style={{
              width: 7,
              height: 7,
            }}
          ></Handle>

          <Handle
            type="target"
            position={Position.Left}
            isConnectable={isConnectable}
            isConnectableStart={false}
            style={{
              width: 1,
              height: 8,
              borderRadius: 1,
            }}
          />
        </div>
        <div className="inline-block align-middle text-[2px]">
          {data.content_type.name}
        </div>
      </div>
    </div>
  );
}

export default Component;
