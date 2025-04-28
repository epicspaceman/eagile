import { MouseEvent, useState } from "react";

type Props = {
    name: string
}

const stringToColor = (str: string) => {
    let hash = 0;
    str.split('').forEach(char => {
      hash = char.charCodeAt(0) + ((hash << 5) - hash)
    })
    let color = '#'
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff
      color += value.toString(16).padStart(2, '0')
    }
    return color
}

const UserIcon = ({ name }: Props) => {
    const [showName, setShowName] = useState(false)
    const [inIcon, setInIcon] = useState(false)
    
    const [xPos, setXPos] = useState(0)
    const [yPos, setYPos] = useState(0)

    const onMouseHover = async (event: MouseEvent<HTMLDivElement>) => {
      setInIcon(true)
      await new Promise(f => setTimeout(f, 300));
      setXPos(event.clientX)
      setYPos(event.clientY)
      setShowName(true)
    }

    return(
        <div>
          <div
           className="size-10 text-center content-center rounded-full text-white" 
           style={{ backgroundColor: (stringToColor(name)) }} 
           onMouseEnter={onMouseHover}
           onMouseLeave={() => {
            setShowName(false)
            setInIcon(false)
           }}
          >
            {name.charAt(0)}
          </div>
          {showName && inIcon && <div className="fixed bg-gray-50 p-1 text-center text-sm text-gray-500" style={{top: yPos, left: xPos}} >{name}</div>}
        </div>
    )
}

export default UserIcon