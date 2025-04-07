'use client'

import { ReactElement } from "react"

type Props = {
    isOpen: boolean,
    children: ReactElement
}

const Modal = ({ isOpen, children }: Props) => {
    if (!isOpen) return null

    return(
        <div className="bg-black/50 flex items-center justify-center w-full h-full fixed inset-0">
            <div className="bg-white p-2 w-1/3 h-fit rounded-lg overflow-scroll">
                {children}
            </div>
        </div>
    )
}

export default Modal