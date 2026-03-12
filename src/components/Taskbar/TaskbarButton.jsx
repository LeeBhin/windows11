import { useState, useRef } from "react";
import TaskbarTooltip from "./TaskbarTooltip";
import { panelBorder } from "../ui/PanelShell";

const BG_STYLE = {
  backgroundColor: "#f2f6ff75",
  border: panelBorder(0.05),
  boxShadow: "0 0 .3px .5px #d1daeec9",
};

export default function TaskbarButton({
  children,
  onClick,
  tooltip,
  className = "",
  isActive = false,
  noScale = false,
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const hideTooltipRef = useRef(null);

  const showBg = hovered || isActive;
  const bgOpacity = pressed ? 0.7 : showBg ? 1 : 0;
  const iconScale = !noScale && pressed ? "scale(0.77)" : "scale(1)";

  return (
    <TaskbarTooltip tooltip={tooltip} hideRef={hideTooltipRef}>
      <button
        onClick={onClick}
        onMouseDown={(e) => {
          e.stopPropagation();
          setPressed(true);
          hideTooltipRef.current?.();
        }}
        onMouseUp={() => setPressed(false)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setPressed(false);
        }}
        className={`relative flex items-center justify-center rounded-[4px] ${className}`}
      >
        <div
          className="absolute inset-0 rounded-[4px] transition-opacity duration-150"
          style={{ ...BG_STYLE, opacity: bgOpacity }}
        />
        <span
          className="relative flex items-center justify-center"
          style={{
            transform: iconScale,
            transition: "transform 0.13s ease-out",
          }}
        >
          {children}
        </span>
      </button>
    </TaskbarTooltip>
  );
}
