import { PublicUser, TicketFilter } from "@/app/lib/definitions"
import { useQuery } from "@tanstack/react-query"

type Props = {
    defaultUser?: PublicUser,
    updateTicketFilter?: ({ user, priority, clearUser }: { user?: PublicUser, priority?: string, clearUser?: boolean }) => void,
    ticketFilter?: TicketFilter
}

const UserSelector = ({ defaultUser, updateTicketFilter, ticketFilter }: Props) => {

    const fetchUsers = (): Promise<PublicUser[]> =>
        fetch(`api/user`, {method: "GET"}).then((response) => response.json()).then((json) => {
            const { users } = json
            return users
        })

    const { isPending, isError, data, error } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
    })

    if (isPending) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    return (
        <div className="flex flex-col">
            {!ticketFilter && (<label className="text-gray-500">Assignee</label>)}
            <select className="bg-gray-200 p-1 rounded-lg" name="assignee" defaultValue={ticketFilter?.user ? JSON.stringify(defaultUser) : "None"} onChange={(event) => {
                if (updateTicketFilter) {
                    if (event.target.value != "All") {
                        updateTicketFilter({ user: JSON.parse(event.target.value) })
                    } else {
                        updateTicketFilter({ clearUser: true })
                    }
                }
            }} required>
                {ticketFilter && (<option value="All">All Users</option>)}
                {data.length > 0 && data.map((user: PublicUser) => {
                    return (
                        <option value={JSON.stringify(user)} key={user.id}>{user.username}</option>
                    )
                })}
            </select>
        </div>
    )
}

export default UserSelector