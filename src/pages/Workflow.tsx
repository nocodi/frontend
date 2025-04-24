import { useParams } from "react-router-dom";
import DnDFlow from "../components/DndFlow";
import { useState } from "react";

export type WorkflowParams = {
  botId: string;
};

function Workflow() {
  const { botId } = useParams<WorkflowParams>();
  const [loading, setLoading] = useState(false);
  return (
    <>
      {!botId || isNaN(Number(botId)) ?
        <div>Not a Number</div>
      : <div className="h-screen overflow-hidden text-white">
          <div className="flex h-full w-full flex-col divide-y divide-white text-gray-800">
            <div className="h-15 shrink-0 bg-patina-300 px-5">
              <div className="flex flex-row">
                <div className="">title whatever</div>
                {loading ?
                  <svg
                    className="h-6 w-6 animate-spin text-cream-900"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                : <svg
                    className="h-6 w-6 text-patina-700"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 11.917 9.724 16.5 19 7.5"
                    />
                  </svg>
                }
              </div>
            </div>
            <DnDFlow botId={Number(botId)} setLoading={setLoading} />
          </div>
        </div>
      }
    </>
  );
}

export default Workflow;
