import { useSession, signOut } from "next-auth/react";
import { useEffect, useState , useRef, useMemo, useCallback} from "react";
import { useRouter } from 'next/router';
import io from 'socket.io-client';
//import StoreProvider from "@/app/StoreProvider";
//import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "@/lib/slices/syncListSlice";
import { useAppSelector, useAppDispatch, useAppStore } from '../../../lib/hooks'
import type { JSX, ReactNode } from "react";
import Link from "next/link";
interface Props {
  children: ReactNode
}
// interface Socket {
//   emit: (a: string, b:string) => void,
//   on: (a:string, b:Function) => void
// }


let socket //: Socket

export function SyncedList({ children }: Props): ReactNode {
  const dispatch = useAppDispatch()

  const socketInitializer = async () => {
    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      console.log('socket connected in mylist!')
    })
    socket.on('add-item', () => {
      dispatch(increment())
    })
    socket.on('remove-item', () => {
      dispatch(decrement())
    })
  }

  useEffect(() => {
    socketInitializer()
  }, [])

  return (
    <div className="containers">
      {children}
    </div>
  )
}
export function MyList() {

  const count =  useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()
  const { data: session, status } = useSession();
  const router = useRouter();
  const { mylistid } = router.query;

  // const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([])
  const [sales, setSales] = useState([])
  const [name, setName] = useState('');
  const [title, setTitle] = useState("")
  const [users, setUsers] = useState([])

  const fetcher = async (): Promise<void> => {
    fetch(`/api/lists/${mylistid}/mylist`)
      .then(res => res.json())
      .then(d => {
        setItems(d.items)
        setTitle(d.name)
        setSales(d.sales)
        setUsers(d.users)
      })
  }

  useEffect(() => {
      fetcher()
    
  }, [count]);

  const addItem = async () => {
    const added = await fetch(`/api/lists/${mylistid}/items/addit`, {
      method: 'POST',
      body: JSON.stringify({ name, listId: mylistid}),
      headers: { "Content-Type": "application/json" },
    });
    setName('');
    // setRend((prev) => prev + 1);
    dispatch(increment())
    // console.log(added)
    if (added) {
      socket.emit('add', JSON.stringify({ name, listId: mylistid }))
      // fetcher()
    }
  };


  const takeItem = async ( itemId: string) => {
    const deleted = await fetch(`/api/lists/${mylistid}/items/${itemId}/take`, {
      method: "DELETE",
    });
    // console.log(deleted)
    if (deleted.ok) {
      socket.emit('remove', itemId)
      // fetcher()
    }
    dispatch(decrement())
    //setRend((prev) => prev - 1);
    // fetcher()
    // fetchLists();
  };

  const turnBackSale = async (itemId: string) => {
    const deleted = await fetch(`/api/lists/${mylistid}/sales/${itemId}/giveback`, {
      method: "DELETE",
    });
    // console.log(deleted)
    if (deleted.ok) {
      socket.emit('remove', itemId)
    }
    dispatch(decrement())
  };

  if (status === "loading") return <p>Loading...</p>;
  if (!session) router.push("/login");
  return (
    <div className="list-execution">
      <Link className="" key={'LinkToDashboard'} href={'../../dashboard'}>Lists Settings</Link>
      <h1>{title}</h1>
      {/* <h3>Content balance: {count}</h3> */}
      <div className="users-in-list">Users: {users ? users.map((user, index) => (
        <span key={`listUsers${user}${index}`}>{user};</span>
      )): <p>no users?</p>}
      </div>
      
      <div className="container sales-container">
        
            {sales ? sales.map((sale) => (
              <div key={`row${sale.id}${Date.now()}`} className="salel-label">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold highbutton"
                  onClick={() => turnBackSale(sale.id)}
                ><span className="sale-name-ctrl">{sale.name}</span><button className="sale-count-ctrl">{sale.count}</button> <span style={{color: "green"}}>✓</span></button>
              </div>
            )) : router.push("/dashboard")}

      </div>
    <div className="">
      <div className="container input-container">
        <textarea
          className="add-item-ctrl"
          value={name}
          onChange={(e) => setName(e.target.value)} 
          onKeyUp={(e) => e.key === "Enter" ? addItem() : null}
        />
        <button
          className="add-item-ctrl"
          onClick={() => addItem()
          }>Add</button>
      </div>
      <div className="container">
        {/* <div className="item-container"> */}
          {items ? items.map((item) => (
            <div key={`row${item.id}${Date.now()}`} className="item-label">
              <button className="item-button bg-blue-500 hover:bg-blue-700 text-white font-bold highbutton"
              onClick={() => takeItem(item.id)}
              > <span 
              className="item-name-ctrl"
                >Ⰰ {item.name}</span><button
              className="item-count-ctrl"
              >{item.count}</button><span 
              className="inputty">➾</span></button>
            </div>
          )) : router.push("/dashboard")}
        {/* </div> */}

      </div>
    </div>
    </div>
  )
}


// <button>-</button><span>{item.count}</span><button>+</button>

export default function ItemRace() {
  return (
      <SyncedList><MyList></MyList></SyncedList>
  )
}