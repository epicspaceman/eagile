import { Ticket } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import TicketColumn from "./ticketColumn"

type Props = {
    epicId: number
}

const TicketBoard = ({ epicId }: Props) => {
    const fetchTickets = (): Promise<Ticket[]> =>
        fetch(`api/ticket/epic/${epicId}`, {method: "GET"}).then((response) => response.json()).then((json) => {
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
    console.log(`data: ${data}`)
    return (
        <div className="grid grid-cols-4 gap-x-3">
            <TicketColumn tickets={todoTickets} status={"todo"} epicId={epicId}/>
            <TicketColumn tickets={blockedTickets} status={"blocked"} epicId={epicId}/>
            <TicketColumn tickets={inProgressTickets} status={"inProgress"} epicId={epicId}/>
            <TicketColumn tickets={completedTickets} status={"completed"} epicId={epicId}/>
        </div>
    )
}

export default TicketBoard