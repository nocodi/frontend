import DnDFlow from "../components/DndFlow";
import SidePanel from "../components/MainSidebar";

function Workflow() {
  return (
    <div className="h-screen text-white overflow-hidden">
      <div className="flex flex-row h-full divide-x divide-white">
        <SidePanel />
        <div className="flex text-gray-800 flex-col w-full h-full divide-y divide-white">
          <div className="h-15 bg-patina-300 shrink-0 px-5">
            <div className="">top right</div>
          </div>
          <DnDFlow />
        </div>
      </div>
    </div>
  );
}

export default Workflow;
