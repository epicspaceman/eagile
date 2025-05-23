import { useMutation, useQueryClient } from "@tanstack/react-query"
import Modal from "./modal"
import { Dispatch, SetStateAction } from "react"
import { Ticket } from "@prisma/client"

const WarningModal = ({ isOpen, setOpen, tickets, deleteEpic }: { isOpen: boolean, setOpen: Dispatch<SetStateAction<boolean>>, tickets: Ticket[], deleteEpic: (ticketCount: number) => void}) => {
    const queryClient = useQueryClient()

    const deleteMutation = useMutation({
        mutationFn: (ticketId: number) => fetch(`api/ticket/${ticketId}`, {
            method: "DELETE",
        }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets']})
    })

    const deleteAllTickets = () => {
        tickets.forEach((ticket) => {
            deleteMutation.mutate(ticket.id)
        })

        deleteEpic(0)

        setOpen(false)
    }

    return (
        <Modal isOpen={isOpen}>
            <div className="flex flex-col p-2">
                <h1 className="text-2xl">Delete Epic</h1>
                <p className="text-base text-gray-500">You have {tickets.length} ticket{tickets.length > 1 ? 's' : ''}. Are you sure you want to delete them?</p>
                <div className="flex flex-row gap-3 justify-end mt-3">
                    <button type="submit" className="w-fit h-fit bg-red-500 rounded-lg text-white p-3" onClick={() => deleteAllTickets()}>Delete</button>
                    <button type="button" className="w-fit h-fit bg-french-purple rounded-lg text-white p-3" onClick={() => setOpen(false)}>Cancel</button>
                </div>
            </div>
        </Modal>
    )
}

export default WarningModal