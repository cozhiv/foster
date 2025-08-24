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
const levro = 1.95563
const roundOn3rd = (val) => {
  // const unrounded = String(val)
  // const pointPosition = unrounded.indexOf(".");
  // if (pointPosition !== -1) {
  //   const toRound = unrounded + "000"
  //   const decimalcut = toRound.charAt(pointPosition + 3)
  //   const hundreds = parseFloat(decimalcut)
  //   if (hundreds >= 5) {
  //     return parseFloat(decimalcut) + 0.01
  //   } else {
  //     return parseFloat(decimalcut)
  //   }
  // }
  return Math.round(val * 100) / 100
}

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
  const [ items, setItems ] = useState([])
  const [ sales, setSales ] = useState([])
  const [ name, setName ] = useState('');
  const [ title, setTitle ] = useState("")
  const [ users, setUsers ] = useState([])
  const [ lev, setLev] = useState(null)
  const [ euro, setEuro ] = useState(null)
  const [ budget, setBudget ] = useState("");
  const [ budgetLeft, setBudgetLeft ] = useState(0)
  // const budgetLeft = useRef(0);
  


  const nullSum = () => {
    setEuro(null)
    setLev(null)
    
  }
  const handleLev = (value) => {
    if (value === 0 || value == null) {
      nullSum()
    } else {
      setEuro(roundOn3rd(value / levro))
      setLev(value)
    }
    
  }

  const handleEuro = (value) => {
    if (value === 0 || value == null) {
      nullSum()
    } else {
      setLev(roundOn3rd(value * levro))
      setEuro(value)
    }
  }

  const fetcher = async (): Promise<void> => {
    fetch(`/api/lists/${mylistid}/mylist`)
      .then(res => res.json())
      .then(d => {
        setItems(d.items)
        setTitle(d.name)
        setSales(d.sales)
        setUsers(d.users)
        setBudget(d.budget)
        if (d.sales) {
          setBudgetLeft(d.budget - d.sales.reduce((c, i) => c + parseFloat(i.price), 0))
        }
        // if (d.sales) {
        //   budgetLeft.current = d.budget - d.sales.reduce((c, i) => c + parseFloat(i.price), 0)
        // }
      })
  }

  useEffect(() => {
      fetcher()
    
  }, [count]);

  const addSale = async () => {
    const added = await fetch(`/api/lists/${mylistid}/sales/add`, {
      method: 'POST',
      body: JSON.stringify({ name, listId: mylistid, price: lev}),
      headers: { "Content-Type": "application/json" },
    });
    setName('');
    // setRend((prev) => prev + 1);
    nullSum()
    dispatch(increment())

    // console.log(added)
    if (added) {
      socket.emit('add', JSON.stringify({ name, listId: mylistid }))
      // fetcher()
    }
  };


  const takeItem = async ( itemId: string) => {
    const deleted = await fetch(`/api/lists/${mylistid}/sales/${itemId}/delete`, {
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

  if (status === "loading") return <p>Ⰿ Loading...</p>;
  if (!session) router.push("/login");
  return (
    <div className="list-execution">
      <Link className="" key={'LinkToBudget'} href={'../../budgets'}>Budget Settings</Link>
      <h3>{title}</h3>
      <h4><span className="glagolitic">ⱂ</span>{"          " + budget}лв</h4>
      <h4><span className="glagolitic">ⱀ</span>{"          " + budgetLeft}лв</h4>
      {/* <h3>Content balance: {count}</h3> */}
      <div className="users-in-list">Users: {users ? users.map((user, index) => (
        <span key={`listUsers${user}${index}`}>{user};</span>
      )): <p>no users?</p>}
      </div>
      
      <div className="container sales-container">
        
            {/* {sales ? sales.map((sale) => (
              <div key={`row${sale.id}${Date.now()}`} className="salel-label">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold highbutton"
                  onClick={() => turnBackSale(sale.id)}
                ><span className="sale-name-ctrl">{sale.name}</span><button className="sale-count-ctrl">{sale.count}</button> <span style={{color: "green"}}>✓</span></button>
              </div>
            )) : router.push("/dashboard")} */}

      </div>
    <div className="">
      <div className="control-sale-container">
        <div className="input-sale-container">
          <div className="signup-inputs">
              <div className="legend signup-line"
              > <span className="glagolitic"> ⰽ </span></div>
          </div>
        
            <div className="signup-inputs">
              <div className="legend signup-line"
              ><span className="glagolitic"> ⱁ </span></div>
            </div>
            <div className="signup-inputs">
              <div className="legend signup-line"
              > € </div>
            </div>
        </div>
        <div className="input-sale-container">
            <div className="signup-inputs">
              <input
                className="signup-line"
                value={name}
                placeholder="Description"
                onChange={(e) => setName(e.target.value)}
                onKeyUp={(e) => e.key === "Enter" ? addSale() : null}
              />
            </div>
            <div className="signup-imput">
              <input
                type="number"
                className="signup-line"
                value={lev}
                placeholder="Лева"
                onChange={(e) => handleLev(e.target.value)}
                onKeyUp={(e) => e.key === "Enter" ? addSale() : null}
              />
            </div>
            <div className="signup-input">
              <input
                type="number"
                className="signup-line"
                placeholder="Euro"
                value={euro}
                onChange={(e) => handleEuro(e.target.value)}
                onKeyUp={(e) => e.key === "Enter" ? addSale() : null}
              />
            </div>
        </div>
        <div className="input-sale-container">
            <button
              className="signup-line submit-sum"
              onClick={() => addSale()
              }>Add</button>
        </div>
            
              
           
    
      </div>
      <div className="container">
        {/* <div className="item-container"> */}
          {sales ? sales.map((sale) => {
            return (
            <div key={`row${sale.id}${Date.now()}`} className="item-label">
              <button 
              // key={`row${item.id}${Date.now()}`}
              className="item-button bg-blue-500 hover:bg-blue-700 text-white font-bold"
              onClick={() => takeItem(sale.id)}
              > <span 
              className="item-name-ctrl"
                  ><span className="glagolitic">Ⰰ</span> {sale.name} </span> <span className="sale-title"> </span>
                <span className="linedup">
                    <span
                      className="item-count-ctrl sale-price-ctrl"
                    >{roundOn3rd(parseFloat(sale.price) / levro)}€</span>
                    <span
                      className="e-and-l"> <span className="glagolitic">Ⱐ</span> </span><span
                        className="item-count-ctrl sale-price-ctrl"
                      >{sale.price}лв</span>
                </span>
                </button>
          </div>
          )}) : router.push("/dashboard")}
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