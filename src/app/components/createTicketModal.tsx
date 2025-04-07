import { useMutation, useQueryClient } from "@tanstack/react-query"
import Modal from "./modal"
import { Dispatch, SetStateAction, useState } from "react"
import { Epic } from "@prisma/client"
import EpicSelector from "./inputs/epicSelector"
import PrioritySelector from "./inputs/prioritySelector"
import StatusSelector from "./inputs/statusSelector"
import DescriptionBox from "./inputs/descriptionBox"
import TitleBox from "./inputs/titleBox"

const CreateTicketModal = ({ isOpen, setOpen, epics, epic }: { isOpen: boolean, setOpen: Dispatch<SetStateAction<boolean>>, epics?: Epic[], epic?: Epic }) => {
    const queryClient = useQueryClient()

    const createTicket = async(formData: FormData) => {
        const title = formData.get("title")
        const description = formData.get("description")
        const status = formData.get("status")
        const priority = formData.get("priority")
        const epicId = epics ? Number(formData.get("epicId")) : epic ? epic.id : 0
    
        mutation.mutate(JSON.stringify({
          title,
          description,
          status,
          priority,
          epicId,
          authorId: 1,
        }))
        setOpen(false)
    }
    
    const mutation = useMutation({
        mutationFn: (newTicket: string) => {
            return fetch('api/ticket', {method: 'POST', body: newTicket})
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tickets']})
        }
    })

    return (
        <Modal isOpen={isOpen}>
            <form action={createTicket} className="flex flex-col gap-y-3 p-2">
                <h1 className="text-xl">Create Ticket</h1>
                <TitleBox />
                <DescriptionBox />
                <StatusSelector />
                <PrioritySelector />
                { epics && <EpicSelector epics={epics} /> }
                <div className="flex flex-row gap-x-3 justify-end">
                    <button className="w-fit h-fit bg-french-purple rounded-lg text-white p-3" onClick={()=>setOpen(false)}>Close</button>
                    <button type="submit" className="w-fit h-fit bg-french-purple rounded-lg text-white p-3">Create</button>
                </div>
            </form>
        </Modal>
    )
}

export default CreateTicketModal
