
type Props = {
    name: string
}

const stringToColour = (str: string) => {
    let hash = 0;
    str.split('').forEach(char => {
      hash = char.charCodeAt(0) + ((hash << 5) - hash)
    })
    let colour = '#'
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff
      colour += value.toString(16).padStart(2, '0')
    }
    return colour
}

const UserIcon = ({ name }: Props) => {

    return(
        <div className="size-10 text-center content-center rounded-full text-white" style={{ backgroundColor: (stringToColour(name)) }}> {name.charAt(0)} </div>
    )
}

export default UserIcon