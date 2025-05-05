import { Loader2 } from "lucide-react";

const Loading = ({ size = 9 }: { size?: number }) => {
  return (
    <div className="flex items-center justify-center">
      <Loader2 size={size} className="animate-spin text-primary" />
    </div>
  );
};

export default Loading;
