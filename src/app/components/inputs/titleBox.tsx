
const TitleBox = ({ defaultTitle }: { defaultTitle?: string }) => {
    return (
        <div className="flex flex-col">
            <label className="text-gray-500">Title</label>
            <input className="bg-gray-200 p-1 rounded-lg" type="text" name="title" defaultValue={defaultTitle} required/>
        </div>
    )
}

export default TitleBox