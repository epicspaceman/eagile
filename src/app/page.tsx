'use client'

import { useState } from "react"
import Modal from "./components/modal"
import EpicContainer from "./components/epicContainer"
import { QueryClientProvider, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Epic } from "@prisma/client"
import CreateTicketModal from "./components/createTicketModal"
import EpicModal from "./components/epicModal"

export default function Home() {
  const queryClient = useQueryClient()

  const fetchEpics = (): Promise<Epic[]> =>
    fetch(`api/epic/`, {method: "GET"}).then((response) => response.json()).then((json) => {
        const { epics } = json
        return epics
    })

  const { isPending, isError, data, error } = useQuery({
      queryKey: [`epics`],
      queryFn: fetchEpics,
  })

  const [ticketModalOpen, setTicketModalOpen] = useState(false)
  const [epicModalOpen, setEpicModalOpen] = useState(false)

  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  return (
    <div className="h-screen font-[family-name:var(--font-geist-sans)]">
      eagile
      <div className="h-16 border-0 rounded-lg bg-gray-200 mx-3 flex flex-row gap-x-3 items-center p-2">
        <button className="w-fit h-fit bg-french-purple rounded-lg text-white p-3" onClick={()=>setEpicModalOpen(true)}>New Epic</button>
        <EpicModal isOpen={epicModalOpen} setOpen={setEpicModalOpen} />
        <button className="w-fit h-fit bg-french-purple rounded-lg text-white p-3" onClick={()=>setTicketModalOpen(true)}>New Ticket</button>
        <CreateTicketModal isOpen={ticketModalOpen} setOpen={setTicketModalOpen} epics={data}/>
      </div>
      <div className="w-full h-full grid grid-rows-[3rem_1fr] grid-cols-4 rounded-lg p-3 gap-x-3">
        <h1 className="w-full text-center content-center bg-french-purple text-white border-0 rounded-lg">To Do</h1>
        <h1 className="w-full text-center content-center bg-french-purple text-white rounded-lg">Blocked</h1>
        <h1 className="w-full text-center content-center bg-french-purple text-white rounded-lg">In Progress</h1>
        <h1 className="w-full text-center content-center bg-french-purple text-white rounded-lg">Completed</h1>
        <div className="col-span-4">
          {data && data.map((item: any) => {
            return(
              <EpicContainer epicId={item.id} key={item.id} />
            )
          })}
        </div>
      </div>
    </div>
  );
}
