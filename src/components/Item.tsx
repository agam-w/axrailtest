import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "@/types/ItemTypes";
import { twMerge } from "tailwind-merge";
import { memo, useRef } from "react";
import { Identifier, XYCoord } from "dnd-core";

interface DragItem {
  name: string;
  index: number;
}

interface DropResult {
  name: string;
}
export interface ItemProps {
  name: string;
  index: number;
  boxName: string;
  className?: string;
  onMove?: (item: string, target: string) => void;
  onSort?: (dragIndex: number, hoverIndex: number, boxName: string) => void;
}

export default memo(function Item({
  name,
  className,
  index,
  boxName,
  onMove,
  onSort,
}: ItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  // drag hook, start grab the Item
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.Item,
      item: { name, index, boxName },
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult<DropResult>();
        if (item && dropResult?.name) {
          // console.log("end", item, dropResult, boxName);
          if (onMove) {
            onMove(item.name, dropResult.name);
          }
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        handlerId: monitor.getHandlerId(),
      }),
    }),
    [name, index, boxName]
  );

  // drop hook, drop on the Item
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.Item,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        // console.log("drag downward");
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        // console.log("drag upward");
        return;
      }

      // Time to actually perform the action
      // console.log("move", dragIndex, hoverIndex);
      onSort?.(dragIndex, hoverIndex, boxName);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={twMerge(
        "p-2 bg-white border rounded touch-none cursor-grab active:cursor-grabbing",
        isDragging ? "opacity-30 !cursor-grabbing" : "",
        className
      )}
      data-testid="item"
      data-handler-id={handlerId}
    >
      {name}
    </div>
  );
});
