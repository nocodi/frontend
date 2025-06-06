import { Cog, Trash2 } from "lucide-react";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";
import { ComponentType } from "../../types/Component";
import api from "../../services/api";
import { getPathOfContent, sliceString } from "../../utils/freqFuncs";
import { toast } from "react-toastify";
import { useContentTypes } from "../../services/getQueries";
import { useLoading } from "../../pages/Workflow";
import { useUnattended } from "../Context/UnattendedComponentContext";

function Component({ id, data, isConnectable }: NodeProps<ComponentType>) {
  const flowInstance = useReactFlow();
  const setUnattendedComponent = useUnattended()[1];
  const setLoading = useLoading();
  const { contentTypes } = useContentTypes();

  function deleteComponent() {
    setLoading(true);
    if (contentTypes) {
      api
        .delete(
          `${getPathOfContent(data.component_content_type, contentTypes)}${id}/`,
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

  if (data.component_type === "BUTTON") {
    return (
      <div className="relative flex h-fit min-h-9 w-10 cursor-pointer items-center justify-center rounded-lg border-2 border-base-content bg-primary px-1 text-center text-primary-content shadow-lg">
        <div>
          <Handle
            type="source"
            position={Position.Right}
            isConnectable={isConnectable}
            style={{
              width: 7,
              height: 7,
            }}
          />
        </div>
        <span className="text-[10px] font-medium">{data.component_name}</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <div className="group flex flex-col items-center gap-1">
        <div className="invisible flex h-3 flex-row justify-center gap-1 text-base-content opacity-0 transition-opacity duration-300 ease-in group-hover:visible group-hover:opacity-100">
          <Trash2
            onClick={() => deleteComponent()}
            className="size-3 cursor-pointer hover:text-patina-400"
          />
          <Cog
            onClick={() => setUnattendedComponent(data)}
            className="size-3 cursor-pointer hover:text-patina-400"
          />
        </div>
        <div className="group/component relative flex h-12 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-base-content bg-primary px-1 text-center text-primary-content shadow-lg hover:bg-base-100 hover:text-base-content">
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
            {data.component_type != "TRIGGER" && (
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
            )}
          </div>
          <div className="text-[10px] font-medium group-hover/component:hidden">
            {data.component_name}
          </div>
          <div className="hidden text-[10px] font-medium group-hover/component:block">
            {data.hover_text ?
              sliceString(data.hover_text, 15)
            : data.component_name}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
