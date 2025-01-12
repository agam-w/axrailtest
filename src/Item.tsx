import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import { twMerge } from "tailwind-merge";

interface DropResult {
  name: string;
}
export interface ItemProps {
  name: string;
  className?: string;
  onMove?: (item: string, target: string) => void;
}

export default function Item({ name, className, onMove }: ItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.Item,
    item: { name },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
        if (onMove) {
          onMove(item.name, dropResult.name);
        }
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={twMerge(
        "p-2 bg-white border rounded",
        isDragging ? "opacity-50" : "",
        className,
      )}
    >
      {name}
    </div>
  );
}
