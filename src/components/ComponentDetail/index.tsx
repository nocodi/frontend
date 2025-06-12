import { ComponentType } from "../../types/Component";
import {
  useComponentDetails,
  useContentTypes,
} from "../../services/getQueries";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import api from "../../services/api";
import { formValuesType } from "../../types/ComponentDetailForm";
import { toast } from "react-toastify";
import CodeEditor from "./CodeEditor";
import ButtonGrid from "./ButtonGrid";
import { makeFormData } from "./makeFormData";
import FormFields from "./FormFields";
import { useReactFlow } from "reactflow";
import { updateNodeHoverText } from "./updateNodeHoverText";

type PropsType = {
  node: ComponentType;
  onClose: () => unknown;
};

const ComponentDetail = ({ node, onClose }: PropsType) => {
  const flowInstance = useReactFlow();

  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<formValuesType>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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
      : <div className="modal-box w-9/12 max-w-2xl bg-base-100 p-0">
          <div className="sticky top-0 z-10 border-b border-base-300 bg-base-100 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-base-content">
                  {contentType.name}
                </h3>
                <div className="badge badge-sm badge-primary">{node.id}</div>
              </div>
              <div className="text-sm text-base-content/70">
                {
                  Object.values(componentSchema).filter(
                    (field) => field?.required,
                  ).length
                }{" "}
                required fields
              </div>
            </div>
            {contentType.description && (
              <p className="text-sm text-base-content/70">
                {contentType.description}
              </p>
            )}
          </div>
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-8">
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

                <ButtonGrid />
                <div className="modal-action">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button type="button" className="btn" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
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
