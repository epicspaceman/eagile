'use client'

import { useEffect, useState } from "react"
import EpicContainer from "./components/epicContainer"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Epic } from "@prisma/client"
import { PublicUser, TicketFilter } from '@/app/lib/definitions'
import CreateTicketModal from "./components/createTicketModal"
import EpicModal from "./components/epicModal"
import Navbar from "./components/navbar/navbar"
import { getUser } from "./lib/dal"
import { redirect } from "next/navigation"
import UserIcon from "./components/userIcon"
import UserSelector from "./components/inputs/userSelector"
import PrioritySelector from "./components/inputs/prioritySelector"
import { flushSync } from "react-dom"

export default function Home() {
  const queryClient = useQueryClient()

  const [user, setUser] = useState<PublicUser>()
  const [userContextMenuVisible, setUserContextMenuVisible] = useState(false)
  const [ticketModalOpen, setTicketModalOpen] = useState(false)
  const [epicModalOpen, setEpicModalOpen] = useState(false)
  const [ticketFilter, setTicketFilter] = useState<TicketFilter>({})

  const updateTicketFilter = ({ user, priority, clearUser }: { user?: PublicUser, priority?: string, clearUser?: boolean }) => {
    flushSync(() => {
        if (user) {
            setTicketFilter(ticketFilter => ({...ticketFilter, ...{user: (((ticketFilter.user?.id != user.id)) ? user : undefined)}}))
        }
        if (clearUser) {
            setTicketFilter(ticketFilter => ({...ticketFilter, ...{user: undefined}}))
        }
        if (priority) {
            setTicketFilter(ticketFilter => ({...ticketFilter, ...{priority: ((ticketFilter.priority != priority && priority != "All") ? priority : undefined)}}))
        }
    })

    queryClient.invalidateQueries({ queryKey: ['tickets']})
  }
  
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
            {users && users.map((user: PublicUser) => {
                return(
                    <button className="border-white border-2 rounded-full -ml-2" 
                        style={{ borderColor: ((ticketFilter.user && ticketFilter.user.id == user.id) ? "black" : "white") }}
                        onClick={()=>updateTicketFilter({user: user})} key={user.id}>
                        <UserIcon name={user.username}/>
                    </button>
                )
            })}
            <div>
                <div className="border-white border-2 rounded-full -ml-2"
                style={{ borderColor: (userContextMenuVisible ? "black" : "white") }}>
                    <button className="size-10 text-center content-center rounded-full bg-gray-400 text-white" 
                        onClick={()=>{ setUserContextMenuVisible(!userContextMenuVisible) }}
                    >?</button>
                </div>
                {userContextMenuVisible && (
                    <div className="fixed z-10 w-fit h-fit bg-black/50 flex flex-col rounded-b-lg rounded-r-lg gap-y-1 py-2"
                        style={{ transform: "translateX(min(var(--mouse-x), calc(100vw - 100%))) translateY(min(var(--mouse-y), calc(100vh - 100%)))"}}>
                        <UserSelector defaultUser={ticketFilter.user ? ticketFilter.user : user} updateTicketFilter={updateTicketFilter} ticketFilter={ticketFilter}/>
                        <div className="fixed top-0 left-0 h-full w-full -z-10" onClick={() => setUserContextMenuVisible(false)}/>
                    </div>
                )}
            </div>
        </div>
        <PrioritySelector defaultPriority={ticketFilter.priority ? ticketFilter.priority : undefined} updateTicketFilter={updateTicketFilter} ticketFilter={ticketFilter}/>
      </div>
      <div className="w-full h-full grid grid-rows-[3rem_1fr] grid-cols-4 rounded-lg p-3 gap-x-3">
        <h1 className="w-full text-center content-center bg-french-purple text-white border-0 rounded-lg">To Do</h1>
        <h1 className="w-full text-center content-center bg-french-purple text-white rounded-lg">Blocked</h1>
        <h1 className="w-full text-center content-center bg-french-purple text-white rounded-lg">In Progress</h1>
        <h1 className="w-full text-center content-center bg-french-purple text-white rounded-lg">Completed</h1>
        <div className="col-span-4">
          {data && data.map((item: Epic) => {
            return(
              <EpicContainer epicId={item.id} ticketFilter={ticketFilter} key={item.id} />
            )
          })}
        </div>
      </div>
    </div>
  );
}
