import { useEffect, useRef, useState } from "react";
import TicketContainer from "./ticketContainer"
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import invariant from "tiny-invariant";
import { useMutation, useQueryClient } from "@tanstack/react-query"

type Props = {
    tickets: Array<Object>,
    epicId: number,
    status: string
}

const TicketColumn = ({ tickets, epicId, status }: Props) => {
    const queryClient = useQueryClient();
    const ref = useRef(null);
    const [isDraggedOver, setIsDraggedOver] = useState(false);

    const updateTicket = async(id: number, updatedTicket: string) => {
        updateMutation.mutate({
            id,
            updatedTicket
        });
    }

    const updateMutation = useMutation({
        mutationFn: ({ id, updatedTicket }: { id: number, updatedTicket: string}) => fetch(`api/ticket/${id}`, {method: 'PATCH', body: updatedTicket}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tickets']});
        }
    });
    
    useEffect(() => {
        const el = ref.current;
        invariant(el);

        return dropTargetForElements({
            element: el,
            onDragEnter: () => setIsDraggedOver(true),
            onDragLeave: () => setIsDraggedOver(false),
            onDrop: ({ source }) => {
                setIsDraggedOver(false);
                if (typeof source.data.id != "number" || (status == source.data.status && epicId == source.data.epicId)) {
                    return;
                };
                updateTicket(source.data.id, JSON.stringify({ status, epicId }));
            },
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