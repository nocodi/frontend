import { ComponentType } from "../../types/Component";
import {
  useComponentDetails,
  useContentTypes,
} from "../../services/getQueries";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import api from "../../services/api";
import { formValuesType, GridItem } from "../../types/ComponentDetailForm";
import { toast } from "react-toastify";
import CodeEditor from "./CodeEditor";
import ButtonGrid from "./ButtonGrid";
import { makeFormData } from "./makeFormData";
import FormFields from "./FormFields";
import { useReactFlow } from "reactflow";
import { updateNodeHoverText } from "./updateNodeHoverText";
import { Check, RefreshCcw, X } from "lucide-react";
import { generateUUID } from "./generateUUID";

type PropsType = {
  node: ComponentType;
  onClose: () => unknown;
};

const ComponentDetail = ({ node, onClose }: PropsType) => {
  const flowInstance = useReactFlow();

  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<formValuesType>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [rows, setRows] = useState<GridItem[][]>([
    [{ id: generateUUID(), label: "Item" }],
  ]);

  const { contentTypes } = useContentTypes();
  const contentType = contentTypes!.find(
    (i) => i.id === node.component_content_type,
  )!;

  const componentPath = contentType.path.split(".ir")[1];
  const { details, isFetching } = useComponentDetails(componentPath, node.id);

  const componentSchema = Object.fromEntries(
    Object.keys(details ?? {}).map((key) => [key, contentType.schema[key]]),
  );

  useEffect(() => {
    setFormValues(details ?? {});
  }, [details]);

  const handleSubmit = (override?: formValuesType) => {
    const formData = makeFormData(componentSchema, override, formValues);

    setLoading(true);
    api
      .patch(`${componentPath}${node.id}/`, formData)
      .then(() => {
        updateNodeHoverText(flowInstance, formData, node.id);
        onClose();
      })
      .catch((err) => {
        toast(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCancel = () => {
    onClose();
    setFormValues({});
    setFormErrors({});
  };

  return (
    <dialog className="modal-open modal">
      {"code" in contentType.schema ?
        <div className="modal-box max-w-4xl p-0">
          <CodeEditor
            initialValue={(details?.code ?? "") as string}
            onSubmit={(updatedCode: string) => {
              handleSubmit({ code: updatedCode });
              onClose();
            }}
            onDiscard={onClose}
          />
        </div>
      : <div className="modal-box flex max-h-11/12 max-w-2xl flex-col p-0">
          <div className="border-b border-base-300 p-4 pl-6">
            <div className="flex items-center gap-1 text-base-content">
              <h3 className="text-xl font-bold">{contentType.name}</h3>
              <div className="mr-auto badge badge-sm badge-primary">
                {node.id}
              </div>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSubmit()}
                className="btn text-xl font-bold btn-ghost btn-sm hover:btn-success"
                aria-label="Submit"
              >
                {loading ?
                  <RefreshCcw />
                : <Check />}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn text-xl font-bold btn-ghost btn-sm hover:btn-error"
                aria-label="Close"
              >
                <X />
              </button>
            </div>
            {contentType.description && (
              <p className="text-sm text-base-content/70">
                {contentType.description}
              </p>
            )}
          </div>
          <div className="overflow-y-auto p-4">
            {isFetching ?
              <Loading size={30} />
            : <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <FormFields
                  componentSchema={componentSchema}
                  formValues={formValues}
                  formErrors={formErrors}
                  setFormValues={setFormValues}
                  setFormErrors={setFormErrors}
                />

                <ButtonGrid rows={rows} setRows={setRows} />
              </form>
            }
          </div>
        </div>
      }
      <form method="dialog" className="modal-backdrop" onClick={handleCancel}>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ComponentDetail;
