import { Handle, Position, NodeProps, useReactFlow } from "reactflow";
import { ComponentType } from "../types/Component";
import api from "../services/api";
import { useLoading } from "../pages/Workflow";
import { useUnattended } from "./UnattendedComponentContext";
import { useContentTypes } from "./ContentTypesContext";
import { toast } from "react-toastify";
import { Trash, Ellipsis } from "lucide-react";

function Component({ id, data, isConnectable }: NodeProps<ComponentType>) {
  const flowInstance = useReactFlow();
  const setUnattendedComponent = useUnattended()[1];
  const setLoading = useLoading();
  const contentTypes = useContentTypes()[0];

  function deleteComponent() {
    setLoading(true);
    if (contentTypes) {
      api
        .delete(
          `${contentTypes[data.component_content_type - 11].path.split(".ir")[1]}${id}/`,
        )
        .then(() => {
          flowInstance.deleteElements({ nodes: [{ id: id }] });
        })
        .catch((err) => {
          toast(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  function editComponentDetails() {
    setUnattendedComponent(data);
  }

  return (
    <div className="group flex flex-col items-center gap-1">
      <div className="invisible flex h-3 w-10 flex-row justify-end gap-0.5 text-base-content opacity-0 transition-opacity duration-300 ease-in group-hover:visible group-hover:opacity-100">
        <Trash
          onClick={() => deleteComponent()}
          className="h-2.5 w-2.5 cursor-pointer hover:text-patina-400"
        />
        <Ellipsis
          onClick={() => editComponentDetails()}
          className="h-3 w-3 cursor-pointer hover:text-patina-400"
        />
      </div>
      <div className="relative h-9 w-24 cursor-pointer rounded-lg border-2 border-base-content bg-primary text-center text-primary-content shadow-lg">
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
        <div className="flex h-full items-center justify-center px-2">
          <span className="text-[10px] font-medium">{data.component_name}</span>
        </div>
      </div>
    </div>
  );
}

export default Component;
