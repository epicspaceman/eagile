import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import TicketBoard from "./ticketBoard"
import EpicContextMenu from "./epicContextMenu"
import { TicketedEpic, TicketFilter } from "../lib/definitions"

type Props = {
    epicId: number
    ticketFilter: TicketFilter
}

const EpicContainer = ({ epicId, ticketFilter }: Props) => {
    const [collapsed, setCollapsed] = useState(true)
    const [contextMenuVisible, setContextMenuVisible] = useState(false)

    const fetchEpic = (): Promise<TicketedEpic> =>
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


    return(
        <div className="w-full h-fit flex flex-col rounded-lg mt-3">
            <div className="flex flex-row justify-between relative">
                <button className="col-span-4 text-left text-gray-600 flex flex-row" onClick={() => setCollapsed(!collapsed)}>
                    {collapsed ? <img className="opacity-45 h-3/4 self-center" src='/assets/chevron-right.svg'/> : <img className="opacity-45 h-3/4 self-center" src='/assets/chevron-down.svg'/>}
                    {data.title}
                </button>
                <button onClick={()=>setContextMenuVisible(!contextMenuVisible)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                </button>
                <EpicContextMenu data={data} isOpen={contextMenuVisible} setOpen={setContextMenuVisible}/>
            </div>
            {!collapsed && <TicketBoard epicId={epicId} ticketFilter={ticketFilter} />}
        </div>
    )
}

export default EpicContainer