import TicketContainer from "./ticketContainer"

type Props = {
    tickets: Array<Object>
}

const TicketColumn = ({ tickets }: Props) => {
    return (
        <div className="text-center border-0 rounded-lg p-2 flex flex-col mt-3 bg-gray-200">
          {tickets.length > 0 && tickets.map((item: any, idx) => {
            return (
                <TicketContainer key={idx} item={item} />
            )
          })}
        </div>
    )
}

export default TicketColumn