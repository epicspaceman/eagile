import { useEffect, useRef, useState } from "react"
import Modal from "./modal"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import PrioritySelector from "./inputs/prioritySelector"
import { Ticket } from "@prisma/client"
import StatusSelector from "./inputs/statusSelector"
import DescriptionBox from "./inputs/descriptionBox"
import TitleBox from "./inputs/titleBox"
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import invariant from 'tiny-invariant';

const TicketContainer = ({item}: { item: Ticket}) => {
    const queryClient = useQueryClient()
    const priority = item.priority.toUpperCase()

    const ref = useRef(null)
    const [dragging, setDragging] = useState<boolean>(false);

    useEffect(() => {
        const el = ref.current
        invariant(el)

        return draggable({
            element: el,
            getInitialData: () => ({ id: item.id, status: item.status, epicId: item.epicId }),
            onDragStart: () => setDragging(true),
            onDrop: () => setDragging(false),
        })
    }, [item])

    const [modalOpen, setModalOpen] = useState(false)

    const updateTicket = async(formData: FormData) => {
        const title = formData.get("title")
        const description = formData.get("description")
        const status = formData.get("status")
        const priority = formData.get("priority")
    
        updateMutation.mutate(JSON.stringify({
            title,
            description,
            status,
            priority
        }))
        setModalOpen(false)
    }

    const updateMutation = useMutation({
        mutationFn: (updatedTicket: string) => fetch(`api/ticket/${item.id}`, {
            method: 'PUT',
            body: updatedTicket
        }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets']})
    })

    const deleteTicket = async() => {
        deleteMutation.mutate()
        setModalOpen(false)
    }

    const deleteMutation = useMutation({
        mutationFn: () => fetch(`api/ticket/${item.id}`, {
            method: "DELETE",
        }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets']})
    })

    return (
        <div>
            <button className="h-fit w-full border-2 rounded-lg bg-white p-3 text-left flex-col gap-y-4" style={{ display: (!dragging ? "flex" : "none")}} ref={ref} onClick={() => setModalOpen(true)}>
                <div>
                    <h1 className="text-lg">{item.title}</h1>
                    <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <div className="rounded-lg w-fit h-fit p-2 bg-french-purple text-white">{priority}</div>
            </button>
            <Modal isOpen={modalOpen}>
                <form action={updateTicket} className="flex flex-col gap-y-3 p-2 text-left">
                    <h1 className="text-xl">Update Ticket</h1>
                    <TitleBox defaultTitle={item.title} />
                    <DescriptionBox defaultDescription={item.description} />
                    <StatusSelector defaultStatus={item.status} />
                    <PrioritySelector defaultPriority={item.priority} />
                    <div className="flex flex-row gap-x-3 justify-end">
                        <button className="w-fit h-fit bg-french-purple rounded-lg text-white p-3" onClick={()=>setModalOpen(false)}>Close</button>
                        <button className="w-fit h-fit bg-red-500 rounded-lg text-white p-3" onClick={deleteTicket}>Delete</button>
                        <button type="submit" className="w-fit h-fit bg-french-purple rounded-lg text-white p-3">Update</button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default TicketContainer