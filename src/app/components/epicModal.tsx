import { useMutation, useQueryClient } from "@tanstack/react-query"
import Modal from "./modal"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import TitleBox from "./inputs/titleBox"
import { Epic } from "@prisma/client"
import { PublicUser } from "../lib/definitions"
import { getUser } from "../lib/dal"

const EpicModal = ({ isOpen, setOpen, epic }: { isOpen: boolean, setOpen: Dispatch<SetStateAction<boolean>>, epic?: Epic }) => {
    const queryClient = useQueryClient()

    const [user, setUser] = useState<PublicUser>()
    
    useEffect(() => {
        const fetchUser = async () => {
            const data = await getUser() ?? undefined
            console.log(data)
            setUser(data)
        }

        fetchUser()
    }, [])

    const createEpic = async(formData: FormData) => {
        const title = formData.get("title")
        const authorId = user === undefined ? 0 : user.id
    
        createMutation.mutate(JSON.stringify({
          title,
          authorId,
        }))
        setOpen(false)
    }
    
    const createMutation = useMutation({
        mutationFn: (newEpic: string) => fetch('api/epic', {method: 'POST', body: newEpic}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['epics']})
        }
    })

    const updateEpic = async(formData: FormData) => {
        const title = formData.get("title")

        updateMutation.mutate(JSON.stringify({
            title
        }))
        setOpen(false)
    }

    const updateMutation = useMutation({
        mutationFn: (title: string) => fetch(`api/epic/${epic?.id}/title`, {method: 'PATCH', body: title}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`epic`, epic?.id]})
            queryClient.invalidateQueries({ queryKey: ['epics']})
        }
    })

    return (
        <Modal isOpen={isOpen}>
            <form className="flex flex-col gap-y-3 p-2">
                <h1 className="text-xl">{epic ? "Update" : "Create"} Epic</h1>
                <TitleBox defaultTitle={epic?.title}/>
                <div className="flex flex-row gap-x-3 justify-end">
                    <button className="w-fit h-fit bg-french-purple rounded-lg text-white p-3" onClick={()=>setOpen(false)}>Close</button>
                    {epic ? <button type="submit" formAction={updateEpic} className="w-fit h-fit bg-french-purple rounded-lg text-white p-3">Update</button>
                     : <button type="submit" formAction={createEpic} className="w-fit h-fit bg-french-purple rounded-lg text-white p-3">Create</button>
                    }
                </div>
            </form>
        </Modal>
    )
}

export default EpicModal