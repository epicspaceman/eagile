import CreateTicketModal from "./createTicketModal"
import EpicModal from "./epicModal"
import { Dispatch, SetStateAction, useState } from 'react'
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { TicketedEpic } from "../lib/definitions"
import WarningModal from "./warningModal"

const EpicContextMenu = ( { data, isOpen, setOpen }: { data: TicketedEpic, isOpen: boolean, setOpen: Dispatch<SetStateAction<boolean>> } ) => {
    const queryClient = useQueryClient()

    const [editEpicModalVisible, setEditEpicModalVisible] = useState(false)
    const [ticketModalOpen, setTicketModalOpen] = useState(false)
    const [warningModalOpen, setWarningModalOpen] = useState(false)
    
    const deleteMutation = useMutation({
        mutationFn: (epicId: number) => fetch(`api/epic/${epicId}`, {
            method: 'DELETE'
        }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['epics']})
    })

    const deleteEpic = (ticketCount: number) => {
        if (ticketCount === 0) {
            deleteMutation.mutate(data.id)
            return
        }

        setWarningModalOpen(true)
    }

    if (!isOpen) return null

    return(
        <div className="absolute right-5 top-5 z-50">
            <div className=" w-fit h-fit bg-black/50 flex flex-col rounded-b-lg rounded-l-lg gap-y-1 py-2 text-sm">
                <button className="text-white px-2" onClick={()=>setTicketModalOpen(true)}>Add Ticket</button>
                <button className="text-white border-t border-b border-white/30 py-1" onClick={()=>setEditEpicModalVisible(true)}>Edit</button>
                <button className="text-red-400" onClick={() => deleteEpic(data.tickets.length)}>Delete</button>
            </div>
            <EpicModal isOpen={editEpicModalVisible} setOpen={setEditEpicModalVisible} epic={data} />
            <CreateTicketModal isOpen={ticketModalOpen} setOpen={setTicketModalOpen} epic={data}/>
            <WarningModal tickets={data.tickets} isOpen={warningModalOpen} setOpen={setWarningModalOpen} deleteEpic={deleteEpic}/>
            <div className="fixed top-0 left-0 h-full w-full -z-10" onClick={() => setOpen(false)}/>
        </div>
    )
} 

export default EpicContextMenu