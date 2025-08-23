import { ComponentType, EdgeType } from "../../types/Component";
import {
  useComponentDetails,
  useContentTypes,
} from "../../services/getQueries";
import { useEffect, useRef, useState } from "react";
import Loading from "../Loading";
import api from "../../services/api";
import {
  formValuesType,
  GridItem,
  KeyboardType,
} from "../../types/ComponentDetailForm";
import { toast } from "react-toastify";
import CodeEditor from "./CodeEditor";
import ButtonGrid from "./ButtonGrid";
import { makeFormData } from "./makeFormData";
import FormFields from "./FormFields";
import { Node, Edge } from "reactflow";
import { updateNodeHoverText } from "./updateNodeHoverText";
import { Check, RefreshCcw, X, Eye } from "lucide-react";
import TelegramPreview from "./TelegramPreview";
import { getPathOfContent } from "../../utils/freqFuncs";
import { WorkflowParams } from "../../pages/Workflow";
import { useParams } from "react-router-dom";
import { handleButtons } from "./handleButtons";

type PropsType = {
  setNodes: React.Dispatch<
    React.SetStateAction<Node<ComponentType, string | undefined>[]>
  >;
  setEdges: React.Dispatch<React.SetStateAction<Edge<EdgeType>[]>>;
  node: ComponentType;
  onClose: () => unknown;
};

const ComponentDetail = ({ setNodes, setEdges, node, onClose }: PropsType) => {
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<formValuesType>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [rows, setRows] = useState<GridItem[][]>([]);
  const [isPatch, setIsPatch] = useState(false);
  const [keyboardType, setKeyboardType] =
    useState<KeyboardType>("InlineKeyboard");
  const modalRef = useRef<HTMLDialogElement>(null);
  const { botId } = useParams<WorkflowParams>();

  const { contentTypes } = useContentTypes();
  const contentType = contentTypes!.find(
    (i) => i.id === node.component_content_type,
  )!;

  const componentPath = getPathOfContent(
    node.component_content_type,
    contentTypes!,
  );
  const { details, isFetching } = useComponentDetails(componentPath!, node.id);

  const componentSchema = Object.fromEntries(
    Object.keys(details ?? {}).map((key) => [key, contentType.schema[key]]),
  );

  useEffect(() => {
    setFormValues(details ?? {});
    if (node.reply_markup != null) {
      setIsPatch(true);
      let cnt = 0;
      const rws = node.reply_markup.buttons.map((row) =>
        row.map((item) => ({
          ...item,
          id: String(cnt++),
        })),
      );
      setRows([...rws]);
      setKeyboardType(node.reply_markup.type || node.reply_markup.markup_type);
    }
  }, [details]);

  const canShowPreview = () => {
    if (isFetching) return false;

    const requiredFields = Object.entries(componentSchema)
      .filter(([_, schema]) => schema.required)
      .map(([key, _]) => key);

    if (requiredFields.length === 0) return true;

    const allRequiredFilled = requiredFields.every((field) => {
      const value = formValues[field];
      return (
        value !== undefined && value !== null && value !== "" && value !== false
      );
    });

    return allRequiredFilled;
  };

  const handleSubmit = (override?: formValuesType) => {
    const formData = makeFormData(componentSchema, override, formValues);

    setLoading(true);
    handleButtons({
      botID: botId,
      isPatch: isPatch,
      rows: rows,
      markupID: node.reply_markup?.id,
      parentID: node.id,
      markup_type: keyboardType,
      setNodes: setNodes,
      setEdges: setEdges,
    });

    api
      .patch(`${componentPath}${node.id}/`, formData)
      .then(() => {
        updateNodeHoverText(setNodes, formData, node.id);
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

              {/* Preview Button */}
              {canShowPreview() && (
                <button
                  type="button"
                  onClick={() => modalRef.current?.showModal()}
                  className="btn text-lg font-bold btn-ghost btn-sm hover:btn-info"
                  aria-label="Preview"
                >
                  <Eye />
                </button>
              )}

              <button
                type="button"
                disabled={loading}
                onClick={() => handleSubmit()}
                className="btn text-xl font-bold btn-ghost btn-sm hover:btn-success"
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
                }}
              >
                <FormFields
                  componentSchema={componentSchema}
                  formValues={formValues}
                  formErrors={formErrors}
                  setFormValues={setFormValues}
                  setFormErrors={setFormErrors}
                />
                {node.reply_markup_supported && (
                  <ButtonGrid
                    rows={rows}
                    setRows={setRows}
                    keyboardType={keyboardType}
                    setKeyboardType={setKeyboardType}
                    formValues={formValues}
                    componentSchema={componentSchema}
                    componentName={contentType.name}
                  />
                )}
              </form>
            }
          </div>
        </div>
      }

      {/* Telegram Preview Modal */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box max-w-md p-0">
          <div className="border-b border-base-300 p-4">
            <h3 className="text-lg font-bold">📱 Telegram Preview</h3>
            <p className="text-sm text-base-content/70">
              How your component will look in Telegram
            </p>
          </div>
          <div className="p-4">
            {node.reply_markup_supported && (
              <TelegramPreview
                rows={rows}
                keyboardType={keyboardType}
                formValues={formValues}
                componentSchema={componentSchema}
                componentName={contentType.name}
              />
            )}
          </div>
          <div className="modal-action p-4">
            <button
              type="button"
              onClick={() => modalRef.current?.close()}
              className="btn btn-primary"
            >
              Close
            </button>
          </div>
        </div>
        <div
          className="modal-backdrop"
          onClick={() => modalRef.current?.close()}
        ></div>
      </dialog>

      <form method="dialog" className="modal-backdrop" onClick={handleCancel}>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ComponentDetail;
