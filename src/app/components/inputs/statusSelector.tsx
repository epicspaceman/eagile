
const StatusSelector = ({ defaultStatus }: { defaultStatus?: string }) => {
    return (
        <div className="flex flex-col">
            <label className="text-gray-500">Status</label>
            <select className="bg-gray-200 p-1 rounded-lg" name="status" defaultValue={defaultStatus} required>
                <option value="todo">To Do</option>
                <option value="blocked">Blocked</option>
                <option value="inProgress">In Progress</option>
                <option value="completed">Completed</option>
            </select>
        </div>
    )
}

export default StatusSelector