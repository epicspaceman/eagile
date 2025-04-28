import { PublicUser } from "@/app/lib/definitions"
import { useQuery, useQueryClient } from "@tanstack/react-query"

const UserSelector = ({ defaultUser }: { defaultUser?: PublicUser }) => {
    const queryClient = useQueryClient()

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
            <label className="text-gray-500">Asignee</label>
            <select className="bg-gray-200 p-1 rounded-lg" name="assignee" defaultValue={defaultUser?.username} required>
                {data.length > 0 && data.map((user: PublicUser) => {
                    return (
                        <option value={user.id} key={user.id}>{user.username}</option>
                    )
                })}
            </select>
        </div>
    )
}

export default UserSelector