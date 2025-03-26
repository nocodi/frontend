import DnDFlow from "../components/DndFlow";
import SidePanel from "../components/MainSidebar";

function Workflow() {
  return (
    <div className="h-screen overflow-hidden text-white">
      <div className="flex h-full flex-row divide-x divide-white">
        <SidePanel />
        <div className="flex h-full w-full flex-col divide-y divide-white text-gray-800">
          <div className="h-15 shrink-0 bg-patina-300 px-5">
            <div className="">top right</div>
          </div>
          <DnDFlow />
        </div>
      </div>
    </div>
  );
}

export default Workflow;
