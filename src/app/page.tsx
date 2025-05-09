'use client'

import { useEffect, useState } from "react"
import EpicContainer from "./components/epicContainer"
import { useQuery } from "@tanstack/react-query"
import { Epic } from "@prisma/client"
import { PublicUser } from '@/app/lib/definitions'
import CreateTicketModal from "./components/createTicketModal"
import EpicModal from "./components/epicModal"
import Navbar from "./components/navbar/navbar"
import { getUser } from "./lib/dal"
import { redirect } from "next/navigation"
import UserIcon from "./components/userIcon"
import UserSelector from "./components/inputs/userSelector"

export default function Home() {
  const [user, setUser] = useState<PublicUser>()
  const [contextMenuVisible, setContextMenuVisible] = useState(false)
  const [ticketModalOpen, setTicketModalOpen] = useState(false)
  const [epicModalOpen, setEpicModalOpen] = useState(false)
  
  useEffect(() => {
      const fetchUser = async () => {
          const data = await getUser() ?? undefined
          console.log(data)
          setUser(data)

          if (data === undefined) {
            redirect('/login')
          }
      }

      fetchUser()
  }, [])

  const fetchEpics = (): Promise<Epic[]> =>
    fetch(`api/epic/`, {method: "GET"}).then((response) => response.json()).then((json) => {
        const { epics } = json
        return epics
    })

  const { isPending, isError, data, error } = useQuery({
      queryKey: [`epics`],
      queryFn: fetchEpics,
  })

  const fetchUsers = (): Promise<PublicUser[]> =>
    fetch(`api/user/list/5`, {method: "GET"}).then((response) => response.json()).then((json) => {
        const { users } = json
        return users
    })

  const userQuery = useQuery({
      queryKey: [`assignees`],
      queryFn: fetchUsers,
  })

  const users = userQuery.data

  if (isPending || userQuery.isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  if (user === undefined) {
    return (
      <div>no</div>
    )
  }

  return (
    <div className="h-screen font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      <div className="h-16 border-0 rounded-lg bg-gray-200 mx-3 flex flex-row gap-x-3 items-center p-2">
        <button className="w-fit h-fit bg-french-purple rounded-lg text-white p-3" onClick={()=>setEpicModalOpen(true)}>New Epic</button>
        <EpicModal isOpen={epicModalOpen} setOpen={setEpicModalOpen}/>
        <button className="w-fit h-fit bg-french-purple rounded-lg text-white p-3" onClick={()=>setTicketModalOpen(true)}>New Ticket</button>
        <CreateTicketModal isOpen={ticketModalOpen} setOpen={setTicketModalOpen} epics={data}/>
        <div className="flex flex-row ml-5">
            {users && users.map((user: any) => {
                return(
                    <button className="-ml-2 border-red-500 border-2 border-dotted " onClick={()=>console.log(`clicked ${user.username}`)}key={user.id}>
                        <UserIcon name={user.username}/>
                    </button>
                )
            })}
            <div className=" border-red-500 border-2 border-dotted ">
                <button className=" border-red-500 border-2 border-dotted size-10 text-center content-center rounded-full bg-gray-400 text-white -ml-2" onClick={()=>setContextMenuVisible(!contextMenuVisible)}>?</button>
                {contextMenuVisible && (
                    <div className="fixed z-10 w-fit h-fit border-red-500 border-2 border-dotted bg-black/50 flex flex-col rounded-b-lg rounded-r-lg gap-y-1 py-2"
                        style={{ transform: "translateX(min(var(--mouse-x), calc(100vw - 100%))) translateY(min(var(--mouse-y), calc(100vh - 100%)))"}}>
                        <UserSelector defaultUser={user}/>
                        <div className="fixed border-red-500 border-2 border-dotted top-0 left-0 h-full w-full -z-10" onClick={() => setContextMenuVisible(false)}/>
                    </div>
                )}
            </div>
        </div>
      </div>
      <div className="w-full h-full grid grid-rows-[3rem_1fr] grid-cols-4 rounded-lg p-3 gap-x-3">
        <h1 className="w-full text-center content-center bg-french-purple text-white border-0 rounded-lg">To Do</h1>
        <h1 className="w-full text-center content-center bg-french-purple text-white rounded-lg">Blocked</h1>
        <h1 className="w-full text-center content-center bg-french-purple text-white rounded-lg">In Progress</h1>
        <h1 className="w-full text-center content-center bg-french-purple text-white rounded-lg">Completed</h1>
        <div className="col-span-4">
          {data && data.map((item: Epic) => {
            return(
              <EpicContainer epicId={item.id} key={item.id} />
            )
          })}
        </div>
      </div>
    </div>
  );
}
