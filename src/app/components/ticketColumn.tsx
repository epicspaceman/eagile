import { useEffect, useRef, useState } from "react";
import TicketContainer from "./ticketContainer"
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import invariant from "tiny-invariant";

type Props = {
    tickets: Array<Object>
}

const TicketColumn = ({ tickets }: Props) => {
    const ref = useRef(null);
    const [isDraggedOver, setIsDraggedOver] = useState(false);
    
    useEffect(() => {
        const el = ref.current;
        invariant(el);

        return dropTargetForElements({
          element: el,
          onDragEnter: () => setIsDraggedOver(true),
          onDragLeave: () => setIsDraggedOver(false),
          onDrop: () => setIsDraggedOver(false),
        });
    }, []);

    return (
        <div className="text-center border-0 rounded-lg p-2 flex flex-col mt-3 bg-gray-200" style={{ backgroundColor: (isDraggedOver ? "#D1D5DB" : "#E5E7EB")}} ref={ref}>
          {tickets.length > 0 && tickets.map((item: any, idx) => {
            return (
                <TicketContainer key={idx} item={item} />
            )
          })}
        </div>
    )
}

export default TicketColumn