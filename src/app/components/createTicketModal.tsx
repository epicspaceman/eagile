import { useMutation, useQueryClient } from "@tanstack/react-query"
import Modal from "./modal"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Epic, Ticket } from "@prisma/client"
import { PublicUser } from "../lib/definitions"
import EpicSelector from "./inputs/epicSelector"
import PrioritySelector from "./inputs/prioritySelector"
import StatusSelector from "./inputs/statusSelector"
import DescriptionBox from "./inputs/descriptionBox"
import TitleBox from "./inputs/titleBox"
import UserSelector from "./inputs/userSelector"
import { getUser } from "../lib/dal"

const CreateTicketModal = ({ isOpen, setOpen, epics, epic }: { isOpen: boolean, setOpen: Dispatch<SetStateAction<boolean>>, epics?: Epic[], epic?: Epic }) => {
    const queryClient = useQueryClient()

    const [user, setUser] = useState<PublicUser>()

    useEffect(() => {
        const fetchUser = async () => {
            const data = await getUser() ?? undefined
            console.log(data)
            setUser(data)
            console.log(user)
        }

        fetchUser()
    }, [])

    const createTicket = async(formData: FormData) => {
        const title = formData.get("title")
        const description = formData.get("description")
        const status = formData.get("status")
        const priority = formData.get("priority")
        const assigneeId = Number(formData.get("assignee"))
        const epicId = epics ? Number(formData.get("epicId")) : epic ? epic.id : 0

        const authorId = user === undefined ? 0 : user.id
    
        mutation.mutate(JSON.stringify({
          title,
          description,
          status,
          priority,
          epicId,
          authorId,
          assigneeId,
        }))
        setOpen(false)
    }
    
    const mutation = useMutation({
        mutationFn: (newTicket: string): Promise<Ticket> => {
            return fetch('api/ticket', {method: 'POST', body: newTicket}).then((res) => res.json()).then((json) => {
                const { ticket } = json
                return ticket
            })
        },
        onSuccess: (ticket) => {
            queryClient.invalidateQueries({ queryKey: ['tickets']})
            queryClient.invalidateQueries({ queryKey: ['epic', ticket.epicId]})
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
                <UserSelector />
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
