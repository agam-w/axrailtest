import { DndProvider } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { DropBox, DropBoxContent, DropBoxTitle } from "@/components/DropBox";
import Item from "./components/Item";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import update from "immutability-helper";
import { twMerge } from "tailwind-merge";

enum BoxNames {
  Available = "Available Options",
  Selected = "Selected Options",
}

const colors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-pink-500",
];

function App() {
  const [availableItems, setAvailableItems] = useState([
    "Sales Cloud",
    "Service Cloud",
    "Community Cloud",
    "Financial Cloud",
    "Einstein AI",
    "Wave Analytics",
    "Health Cloud",
  ]);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const randomColors = useMemo(() => {
    // random sort
    return [...colors].sort(() => Math.random() - 0.5);
  }, []);

  function onItemMove(item: string, target: string) {
    if (target === BoxNames.Available) {
      const exists = availableItems.includes(item);
      if (exists) return;

      setSelectedItems((items) => items.filter((i) => i !== item));
      setAvailableItems((items) => [...items, item]);
    } else {
      const exists = selectedItems.includes(item);
      if (exists) return;

      setAvailableItems((items) => items.filter((i) => i !== item));
      setSelectedItems((items) => [...items, item]);
    }
  }

  const onItemSort = useCallback(
    (dragIndex: number, hoverIndex: number, boxName: string) => {
      // console.log("onItemSort", boxName, ":", dragIndex, "->", hoverIndex);

      const sortItem = (prevItems: string[]) =>
        update(prevItems, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevItems[dragIndex]],
          ],
        });

      if (boxName === BoxNames.Available) {
        setAvailableItems(sortItem);
      } else {
        setSelectedItems(sortItem);
      }
    },
    []
  );

  return (
    <DndProvider options={HTML5toTouch}>
      <div className="container mx-auto p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedItems.map((name, i) => (
            <div
              key={i}
              className={twMerge(
                "flex rounded py-1 px-2 text-sm text-white",
                randomColors[i % colors.length]
              )}
            >
              {name}
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <DropBox
            name={BoxNames.Available}
            className="bg-gradient-to-r from-blue-500 to-green-500"
          >
            <DropBoxTitle>{BoxNames.Available}</DropBoxTitle>
            <DropBoxContent>
              {availableItems.map((item, i) => (
                <Item
                  key={item}
                  index={i}
                  name={item}
                  boxName={BoxNames.Available}
                  onMove={onItemMove}
                  onSort={onItemSort}
                />
              ))}
            </DropBoxContent>
          </DropBox>
          <DropBox
            name={BoxNames.Selected}
            className="bg-gradient-to-r from-orange-500 to-yellow-500"
          >
            <DropBoxTitle>{BoxNames.Selected}</DropBoxTitle>
            <DropBoxContent>
              {selectedItems.map((item, i) => (
                <Item
                  key={item}
                  index={i}
                  name={item}
                  boxName={BoxNames.Selected}
                  onMove={onItemMove}
                  onSort={onItemSort}
                />
              ))}
            </DropBoxContent>
          </DropBox>
        </div>
      </div>
    </DndProvider>
  );
}

export default memo(App);
