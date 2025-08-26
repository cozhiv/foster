
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import ConfirmationPanel from "@/components/ConfirmationPanel";
import ConfirmationButtons from "@/components/Confirmation";
import { hideConfirmation, setConfirmation, setAct, setSubject, setListId, setItemId  } from "@/lib/slices/confirmationSlice"
// import DashboardProvider from "@/app/DashboardProvider";
import AddUser from "@/components/AddUser";
// import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from ''
//import { useItemsStore } from '@/lib/itemsStore';
// import { useWebSocketClient } from '@/utils/wsClient';
import Link from "next/link";
import BiButton from "@/components/Button";
import InputField from "@/components/Input";
import { setInvisibleUA, setToListInput, setVisibleUA } from "@/lib/slices/dashboardSlice";

export default function Budgets() {

  const dispatch = useAppDispatch()
  const { data: session, status } = useSession();
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [newSaleName, setNewSaleName] = useState({});
  const [newBudget, setNewBudget] = useState(0);
  const [newSale, setNewSale] = useState({})
  // const [loading, setLoading] = useState(false);

  //const [newUserInput, setNewUserInput] = useState("")
  

  //const invisibleUA = useAppSelector((state) => state.dashboard.invisibleUA)
  const confirmationQuestion = useAppSelector(state => state.confirmation.confirmationQuestion)
  const router = useRouter()
  useEffect(() => {
    if (status === "authenticated") fetchLists();
  }, [status]);

  const fetchLists = async () => {
    const res = await fetch("/api/lists/user");
    const data = await res.json();
    
    setLists(data);
    //console.log(JSON.stringify(data))
  };

  const createList = async () => {
    if (!newBudget) return;
    await fetch("/api/lists/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newListName, budget: newBudget }),
    });
    setNewListName("");
    setNewBudget(0);
    fetchLists();
  };

  const askForConfirmation = async () => {

  }

  const addSale = async (listId: string) => {
    const name = newSaleName[listId];
    const sale = newSale[listId]
    // if (!name) return;
    if (!sale) return;
    await fetch(`/api/lists/${listId}/sales/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, listId, price: sale }),
    });
    setNewSaleName((prev) => ({ ...prev, [listId]: "" }));
    setNewSale((prev) => ({ ...prev, [listId]: 0 }));
    fetchLists();
  };



  const deleteSale = async (listId: string, itemId: string) => {
    dispatch(setListId(listId))
    dispatch(setItemId(itemId))
    dispatch(setAct("delete"))
    dispatch(setSubject("sale"))
    dispatch(setConfirmation("Do you really want to remove this transaction?"))

    // await fetch(`/api/lists/${listId}/items/${itemId}/delete`, {
    //   method: "DELETE",
    // });
    // fetchLists();
  };

  const deleteList = async (listId: string) => {

    dispatch(setListId(listId))
    dispatch(setAct("delete"))
    dispatch(setSubject("list"))
    dispatch(setConfirmation("Do you really want to delete the list?"))
    // await fetch(`/api/lists/${listId}/delete`, {
    //   method: "DELETE",
    // });
    // fetchLists();
  };

  const setUserPanelOpen = async (listId: string) => {
    dispatch(setVisibleUA())
    // setInvisibleUA(false)
    dispatch(setToListInput(listId))
  }
  // console.log(JSON.stringify(lists))

  if (status === "loading") return <p>Ⰿ Loading...</p>;
  if (!session) return router.push("login");

  return (
        <div className="dashboard-container">
      <Link key='LinkToBudget' href={'/'}>Home</Link>
      <span className="space-maker">   |   </span>
      <Link key="signoutlink" href = "login" onClick={() => signOut()}>Sign out</Link>
      <span className="space-maker">   |   </span>
      <Link key="LinkToDashboard" href="dashboard" > Roster </Link>
          <div className="dashboard-head">
            <h2>{session.user.email}</h2>
            <h3>Create New Budget</h3>
            <div className="create-list">
              {/* <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Budget name"
                // onKeyUp={(e) => e.key === "Enter" ? createList() : null}
              />
            <input
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(parseFloat(e.target.value))}
              placeholder="Budget"
              onKeyUp={(e) => e.key === "Enter" ? createList() : null}
            />
              <button onClick={createList}>Create</button> */}
          </div>
        <div className="control-sale-container">
          <div className="input-sale-container">
            <div className="signup-inputs">
              <input
                className="signup-line"
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Budget name"
              />
            </div>
            <div className="signup-imputs">
              <input
                className="signup-line"
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(parseFloat(e.target.value))}
                placeholder="Budget"
                onKeyUp={(e) => e.key === "Enter" ? createList() : null}
              />
            </div>
          </div>
          <div className="input-sale-container">
            <button
              className="signup-line submit-sum"
              onClick={createList}>Create</button>
          </div>
        </div>
            <AddUser />

          </div>
      <h4>Your Budgets:</h4>
          <div className="lists-container">
        {lists.length === 0 && <p>No lists yet</p>}
        {lists.map((list) => (
          <div className="list-container" key={list.id} >
            <div className="link-to-list">
              <Link key={`LinkTo${list.id}`} href={`mylist/${list.id}/${list.status}`}>{list.name}</Link>
            </div>
            <div className="list-users">{list.users.map((user, index) => (
              <span key={`user-${list.id}-${index+1}`}>{` ${user};`}</span>
            ))} </div>
            <div className="list-budgets">{list.budget}</div>
            <div className="list-settings">
              <button onClick={() => deleteList(list.id)}>Delete Budget</button>
              <button
                className="rounded-md bg-gray-950/5 px-2.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-950/10"
                onClick={() => setUserPanelOpen(list.id)}
              >New user</button>

            </div>



            <div className="items-container">
              {list.sales.map((sale) => (
                <div key={sale.id} className="lists-item">
                  <span className="glagolitic item-start">ⱉ </span>
                  <span className="item-text">{sale.name}</span>
                  <span className="item-value"> {sale.price}</span>
                  <button className="remove-item" onClick={() => deleteSale(list.id, sale.id)} >×</button>
                  <span className="item-count"> × {sale.count}</span>
                </div>
              ))}
            </div>

            {/* <div className="add-item">
              <input
                className="add-item-content"
                placeholder="New item"
                value={newSaleName[list.id] || ""}
                onChange={(e) =>
                  setNewSaleName((prev) => ({ ...prev, [list.id]: e.target.value }))
                }
                onKeyUp={(e) => e.key === "Enter" ? addSale(list.id) : null}
              />
              <input
                className="add-item-content"
                placeholder="How many"
                value={newSale[list.id] || ""}
                onChange={(e) =>
                  setNewSale((prev) => ({ ...prev, [list.id]: e.target.value }))
                }
                onKeyUp={(e) => e.key === "Enter" ? addSale(list.id) : null}
              />
              <button
                onClick={() => addSale(list.id)}
                className="add-item-content rounded-md bg-gray-950/5 px-2.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-950/10"
              > Add </button>
            </div> */}

            <div className="control-sale-container">
              <div className="input-sale-container">
                <div className="signup-inputs">
                  <input
                    className="signup-line"
                    type="text"
                    placeholder="New item"
                    value={newSaleName[list.id] || ""}
                    onChange={(e) =>
                      setNewSaleName((prev) => ({ ...prev, [list.id]: e.target.value }))
                    }
                    onKeyUp={(e) => e.key === "Enter" ? addSale(list.id) : null}
                  />
                </div>
                <div className="signup-imputs">
                  <input
                    className="signup-line"
                    type="number"
                    placeholder="How many"
                    value={newSale[list.id] || ""}
                    onChange={(e) =>
                      setNewSale((prev) => ({ ...prev, [list.id]: e.target.value }))
                    }
                    onKeyUp={(e) => e.key === "Enter" ? addSale(list.id) : null}
                  />
                </div>
              </div>
              <div className="input-sale-container">
                <button
                  className="signup-line submit-sum"
                  onClick={() => addSale(list.id)}
                > Add</button>
              </div>
            </div>

          </div>
        ))}
          </div>
       <ConfirmationPanel>
          <div className="question-card">
            Delete
          </div>
        <div className="question-card">
         <ConfirmationButtons callback={fetchLists}/>
         </div>
      </ConfirmationPanel>
        </div>
      

    
  );
}



/* import { useSession, signOut } from "next-auth/react";
import { SessionProvider } from "next-auth/react";

export default function Dashboard() {
  
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>You must be logged in</p>;

  return (
    
    <div>
      <h1>Welcome, {session.user?.email}</h1>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}
 */
