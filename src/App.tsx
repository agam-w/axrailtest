import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DropBox, DropBoxContent, DropBoxTitle } from "./DropBox";
import Item from "./Item";
import { useState } from "react";

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

  function onItemMove(item: string, target: string) {
    if (target === BoxNames.Available) {
      setSelectedItems((items) => items.filter((i) => i !== item));
      setAvailableItems((items) => [...items, item]);
    } else {
      setAvailableItems((items) => items.filter((i) => i !== item));
      setSelectedItems((items) => [...items, item]);
    }
  }

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
              {availableItems.map((item) => (
                <Item key={item} name={item} onMove={onItemMove} />
              ))}
            </DropBoxContent>
          </DropBox>
          <DropBox
            name={BoxNames.Selected}
            className="bg-gradient-to-r from-orange-500 to-yellow-500"
          >
            <DropBoxTitle>{BoxNames.Selected}</DropBoxTitle>
            <DropBoxContent>
              {selectedItems.map((item) => (
                <Item key={item} name={item} onMove={onItemMove} />
              ))}
            </DropBoxContent>
          </DropBox>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
