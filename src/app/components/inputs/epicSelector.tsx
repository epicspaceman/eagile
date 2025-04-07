import { Epic } from "@prisma/client"

const EpicSelector = ({ epics }: { epics: Epic[]}) => {
    return (
        <div className="flex flex-col">
            <label className="text-gray-500">Parent Epic</label>
            <select className="bg-gray-200 p-1 rounded-lg" name="epicId" required>
                {epics.map((epic) => <option key={epic.id} value={epic.id}>{epic.title}</option>)}
            </select>
        </div>
    )
}

export default EpicSelector