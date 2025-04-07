import TicketColumn from "./ticketColumn"
import { useState, useEffect, MouseEvent } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Epic, Ticket } from "@prisma/client"
import TicketBoard from "./ticketBoard"
import EpicModal from "./epicModal"
import CreateTicketModal from "./createTicketModal"
import EpicContextMenu from "./epicContextMenu"

type Props = {
    epicId: number
}

const EpicContainer = ({ epicId }: Props) => {
    const [collapsed, setCollapsed] = useState(true)
    const [contextMenuVisible, setContextMenuVisible] = useState(false)

    const fetchEpic = (): Promise<Epic> =>
        fetch(`api/epic/${epicId}`, {method: "GET"}).then((response) => response.json()).then((json) => {
            const { epic } = json
            return epic
        })

    const { isPending, isError, data, error } = useQuery({
        queryKey: [`epic`, epicId],
        queryFn: fetchEpic,
    })


    if (isPending) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    console.log(`data: ${data}`)

    const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        setContextMenuVisible(!contextMenuVisible)
    }

    return(
        <div className="w-full h-fit flex flex-col rounded-lg mt-3" onContextMenu={handleContextMenu}>
            <div className="flex flex-row justify-between relative">
                <button className="col-span-4 text-left text-gray-600" onClick={() => setCollapsed(!collapsed)}>{data.title}</button>
                <button onClick={()=>setContextMenuVisible(!contextMenuVisible)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                </button>
                {contextMenuVisible && <EpicContextMenu data={data}/>}
            </div>
            {!collapsed && <TicketBoard epicId={epicId} />}
        </div>
    )
}

export default EpicContainer