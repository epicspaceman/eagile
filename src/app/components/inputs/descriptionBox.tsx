
const DescriptionBox = ({ defaultDescription }: { defaultDescription?: string }) => {
    return (
        <div className="flex flex-col">
            <label className="text-gray-500">Description</label>
            <textarea className="bg-gray-200 p-1 rounded-lg" name="description" defaultValue={defaultDescription} required/>
        </div>
    )
}

export default DescriptionBox