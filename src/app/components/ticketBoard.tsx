import { Ticket } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import TicketColumn from "./ticketColumn"
import { TicketFilter } from "../lib/definitions"

type Props = {
    epicId: number
    ticketFilter: TicketFilter
}

const constructUrl = (epicId: number, ticketFilter: TicketFilter): string => {
    let url = `api/ticket/epic/${epicId}`
    if (ticketFilter.user) {
        url += `/user/${ticketFilter.user.id}`
    }
    if (ticketFilter.priority) {
        url += `/priority/${ticketFilter.priority}`
    }

    return url
}

const TicketBoard = ({ epicId, ticketFilter }: Props) => {
    const fetchTickets = (): Promise<Ticket[]> =>
        fetch(constructUrl(epicId, ticketFilter), {method: "GET"}).then((response) => response.json()).then((json) => {
            const { tickets } = json
            return tickets
        })

    const { isPending, isError, data, error } = useQuery({
        queryKey: ['tickets', epicId],
        queryFn: fetchTickets,
    })

    const todoTickets: Ticket[] = []
    const blockedTickets: Ticket[] = []
    const inProgressTickets: Ticket[] = []
    const completedTickets: Ticket[] = []

    data?.forEach((ticket) => {
        switch (ticket.status) {
            case 'todo':
                todoTickets.push(ticket)
                break
            case 'blocked':
                blockedTickets.push(ticket)
                break
            case 'inProgress':
                inProgressTickets.push(ticket)
                break
            case 'completed':
                completedTickets.push(ticket)
                break
        }
    })

    if (isPending) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }
    return (
        <div className="grid grid-cols-4 gap-x-3">
            <TicketColumn tickets={todoTickets} status={"todo"} epicId={epicId} ticketFilter={ticketFilter}/>
            <TicketColumn tickets={blockedTickets} status={"blocked"} epicId={epicId} ticketFilter={ticketFilter}/>
            <TicketColumn tickets={inProgressTickets} status={"inProgress"} epicId={epicId} ticketFilter={ticketFilter}/>
            <TicketColumn tickets={completedTickets} status={"completed"} epicId={epicId} ticketFilter={ticketFilter}/>
        </div>
    )
}

export default TicketBoard