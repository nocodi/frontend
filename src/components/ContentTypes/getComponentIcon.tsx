import {
  MessageSquare,
  Image,
  FileText,
  Video,
  Mic,
  MapPin,
  Contact,
  BarChart2,
  Keyboard,
  Reply,
  Layout,
  Square,
  MousePointerClick,
  Puzzle,
} from "lucide-react";

const getComponentIcon = (name: string, size: "small" | "large" = "large") => {
  const iconClass = {
    small: "mx-1 size-4.5",
    large: "mx-2 size-6",
  }[size];
  const colorClass = {
    message: "text-blue-500",
    photo: "text-pink-500",
    document: "text-gray-500",
    video: "text-purple-500",
    voice: "text-orange-500",
    location: "text-green-500",
    contact: "text-teal-500",
    poll: "text-yellow-500",
    keyboard: "text-indigo-500",
    reply: "text-cyan-500",
    markup: "text-lime-500",
    button: "text-rose-500",
    callback: "text-fuchsia-500",
    default: "text-gray-500",
  };
  const lower = name.toLowerCase();
  if (lower.includes("message"))
    return <MessageSquare className={`${iconClass} ${colorClass.message}`} />;
  if (lower.includes("photo"))
    return <Image className={`${iconClass} ${colorClass.photo}`} />;
  if (lower.includes("document"))
    return <FileText className={`${iconClass} ${colorClass.document}`} />;
  if (lower.includes("video"))
    return <Video className={`${iconClass} ${colorClass.video}`} />;
  if (lower.includes("voice"))
    return <Mic className={`${iconClass} ${colorClass.voice}`} />;
  if (lower.includes("location"))
    return <MapPin className={`${iconClass} ${colorClass.location}`} />;
  if (lower.includes("contact"))
    return <Contact className={`${iconClass} ${colorClass.contact}`} />;
  if (lower.includes("poll"))
    return <BarChart2 className={`${iconClass} ${colorClass.poll}`} />;
  if (lower.includes("keyboard"))
    return <Keyboard className={`${iconClass} ${colorClass.keyboard}`} />;
  if (lower.includes("reply"))
    return <Reply className={`${iconClass} ${colorClass.reply}`} />;
  if (lower.includes("markup"))
    return <Layout className={`${iconClass} ${colorClass.markup}`} />;
  if (lower.includes("button"))
    return <Square className={`${iconClass} ${colorClass.button}`} />;
  if (lower.includes("callback"))
    return (
      <MousePointerClick className={`${iconClass} ${colorClass.callback}`} />
    );
  return <Puzzle className={`${iconClass} ${colorClass.default}`} />;
};

export default getComponentIcon;
