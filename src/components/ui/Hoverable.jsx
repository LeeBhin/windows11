const BASE =
  "rounded-[4px] hover:bg-[#ffffffa6] transition-all duration-[120ms]";

const ACTIVE = {
  item: "active:bg-[#ffffff60]",
  icon: "active:bg-[#ffffff50]",
  text: "active:opacity-60",
  none: "",
};

export default function Hoverable({
  as: Tag = "div",
  type = "item",
  cursor = "pointer",
  className = "",
  children,
  ...rest
}) {
  return (
    <Tag className={`${BASE} ${ACTIVE[type]} cursor-${cursor} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
