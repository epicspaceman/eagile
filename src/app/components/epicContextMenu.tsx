import { Epic } from "@prisma/client"
import CreateTicketModal from "./createTicketModal"
import EpicModal from "./epicModal"
import { useState } from 'react'
import { useMutation, useQueryClient } from "@tanstack/react-query"


const EpicContextMenu = ( { data }: { data: Epic } ) => {
    const queryClient = useQueryClient()

    const [editEpicModalVisible, setEditEpicModalVisible] = useState(false)
    const [ticketModalOpen, setTicketModalOpen] = useState(false)
    
    const deleteMutation = useMutation({
        mutationFn: (epicId: number) => fetch(`api/epic/${epicId}`, {
            method: 'DELETE'
        }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['epics']})
    })

    return(
        <div className="absolute right-5 top-5">
            <div className="w-fit h-fit bg-gray-200 flex flex-col rounded-sm gap-y-1 p-1">
                <button className="bg-white px-2 rounded-sm" onClick={()=>setTicketModalOpen(true)}>Add Ticket</button>
                <button className="bg-white px-2 rounded-sm" onClick={()=>setEditEpicModalVisible(true)}>Edit</button>
                <button className="bg-red-400 text-white px-2 rounded-sm" onClick={()=>deleteMutation.mutate(data.id)}>Delete</button>
            </div>
            <EpicModal isOpen={editEpicModalVisible} setOpen={setEditEpicModalVisible} epic={data} />
            <CreateTicketModal isOpen={ticketModalOpen} setOpen={setTicketModalOpen} epic={data}/>
        </div>
    )
} 

export default EpicContextMenu