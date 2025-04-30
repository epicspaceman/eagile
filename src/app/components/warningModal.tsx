import { useMutation, useQueryClient } from "@tanstack/react-query"
import Modal from "./modal"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Ticket } from "@prisma/client"

const WarningModal = ({ isOpen, setOpen, tickets, deleteEpic }: { isOpen: boolean, setOpen: Dispatch<SetStateAction<boolean>>, tickets: Ticket[], deleteEpic: Function}) => {
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
            <div>
                <div>you have {tickets.length} tickets do you want to delete them?</div>
                <button onClick={() => deleteAllTickets()}>yes</button>
                <button onClick={() => setOpen(false)}>no</button>
            </div>
        </Modal>
    )
}

export default WarningModal