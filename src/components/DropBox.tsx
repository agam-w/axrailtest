import { useDrop } from "react-dnd";
import { twMerge } from "tailwind-merge";
import { ItemTypes } from "@/types/ItemTypes";
import { memo } from "react";

export const DropBox = memo(function DropBox({
  children,
  className,
  name,
}: {
  children?: React.ReactNode;
  className?: string;
  name: string;
}) {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.Item,
    drop: () => ({ name }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;

  return (
    <div
      ref={drop}
      className={twMerge(
        "flex-1 flex flex-col rounded p-2 bg-blue-500",
        isActive ? "opacity-75" : "",
        className
      )}
      data-testid="box"
    >
      {children}
    </div>
  );
});

export function DropBoxTitle({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="py-2">
      <h1 className={twMerge("text-white text-xl", className)}>{children}</h1>
    </div>
  );
}

export function DropBoxContent({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "flex-1 flex flex-col gap-2 p-4 bg-white/80 rounded",
        className
      )}
    >
      {children}
    </div>
  );
}
