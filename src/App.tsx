import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DropBox, DropBoxContent, DropBoxTitle } from "./DropBox";
import Item from "./Item";
import { memo, useCallback, useState } from "react";
import update from "immutability-helper";

enum BoxNames {
  Available = "Available Options",
  Selected = "Selected Options",
}

function App() {
  const [availableItems, setAvailableItems] = useState([
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5",
  ]);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // useEffect(() => {
  //   console.log("availableItems", availableItems);
  // }, [availableItems]);

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
    [],
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-4">
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
