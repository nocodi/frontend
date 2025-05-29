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

type PropsType = {
  node: ComponentType;
  onClose: () => unknown;
};

const ComponentDetail = ({ node, onClose }: PropsType) => {
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

  const modalBox =
    "code" in contentType.schema ?
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
    : <div className="modal-box bg-base-100">
        <h3 className="text-lg font-bold text-base-content">
          {contentType.name}
        </h3>

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
      </div>;

  return (
    <dialog className="modal-open modal">
      {modalBox}
      <form method="dialog" className="modal-backdrop" onClick={handleCancel}>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ComponentDetail;
