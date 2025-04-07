
const PrioritySelector = ({ defaultPriority }: { defaultPriority?: string }) => {
    return (
        <div className="flex flex-col">
            <label className="text-gray-500">Priority</label>
            <select className="bg-gray-200 p-1 rounded-lg" name="priority" defaultValue={defaultPriority} required>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
        </div>
    )
}

export default PrioritySelector