import DnDFlow from "../components/DndFlow";
import SidePanel from "../components/MainSidebar";

function Workflow() {
  return (
    <div className="h-screen text-white overflow-hidden">
      <div className="flex flex-row h-full divide-x divide-cream-100">
        <SidePanel />
        <div className="flex flex-col w-full h-full divide-y divide-cream-200">
          <div className="h-15 bg-primary shrink-0 px-5">
            <div className="">top right</div>
          </div>
          <DnDFlow />
        </div>
      </div>
    </div>
  );
}

export default Workflow;
