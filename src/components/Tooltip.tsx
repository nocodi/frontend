import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type TooltipProps = {
  children: React.ReactNode;
  content: string;
};

export default function Tooltip({ children, content }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX - 400,
      });
    }
    setVisible(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      const tooltipHovered = tooltipRef.current?.matches(":hover");
      const triggerHovered = triggerRef.current?.matches(":hover");

      if (!tooltipHovered && !triggerHovered) {
        setVisible(false);
      }
    }, 50);
  };

  useEffect(() => {
    const trigger = triggerRef.current;
    trigger?.addEventListener("mouseenter", handleMouseEnter);
    trigger?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      trigger?.removeEventListener("mouseenter", handleMouseEnter);
      trigger?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <>
      <div ref={triggerRef}>{children}</div>
      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            className="absolute z-50 max-w-xs rounded bg-black px-2 py-1 text-xs text-white shadow"
            style={{ top: coords.top, left: coords.left }}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => setVisible(true)}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
