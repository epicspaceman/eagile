import { PublicUser, TicketFilter } from "@/app/lib/definitions"

type Props = {
    defaultPriority?: string,
    updateTicketFilter?: ({ user, priority, clearUser }: { user?: PublicUser, priority?: string, clearUser?: boolean }) => void,
    ticketFilter?: TicketFilter
}

const PrioritySelector = ({ defaultPriority, updateTicketFilter, ticketFilter }: Props ) => {

    return (
        <div className="flex flex-col align-center">
            <label className="text-gray-500">Priority</label>
            <select className="bg-gray-200 p-1 rounded-lg" name="priority" defaultValue={defaultPriority} onChange={(event) => {
                if (updateTicketFilter) {
                    updateTicketFilter({ priority: event.target.value })
                }
            }} required>
                {ticketFilter && (<option value="All">All Tickets</option>)}
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
        </div>
    )
}

export default PrioritySelector