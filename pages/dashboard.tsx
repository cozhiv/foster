
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

export default function Dashboard() {

  const dispatch = useAppDispatch()
  const { data: session, status } = useSession();
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [newItemName, setNewItemName] = useState({});
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
  };

  const createList = async () => {
    if (!newListName) return;
    await fetch("/api/lists/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newListName }),
    });
    setNewListName("");
    fetchLists();
  };

  const askForConfirmation = async () => {

  }

  const addItem = async (listId: string) => {
    const name = newItemName[listId];
    if (!name) return;
    await fetch(`/api/lists/${listId}/items/addit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, listId }),
    });
    setNewItemName((prev) => ({ ...prev, [listId]: "" }));
    fetchLists();
  };



  const deleteItem = async (listId: string, itemId: string) => {
    dispatch(setListId(listId))
    dispatch(setItemId(itemId))
    dispatch(setAct("delete"))
    dispatch(setSubject("item"))
    dispatch(setConfirmation("Do you really want to remove the item?"))

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


  if (status === "loading") return <p>Ⰿ Loading...</p>;
  if (!session) return router.push("login");

  return (
        <div className="dashboard-container">
      <Link key="signoutlink" href = "login" onClick={() => signOut()}>Sign out</Link>
      <span className="space-maker">   |   </span>
      <Link key='LinkToBudget' href={'budgets'}>  
       Budgets
      </Link>
          <div className="dashboard-head">
            <h2>{session.user.email}</h2>
            <h3>Create New List</h3>
            <div className="create-list">
              <input
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="List name"
                onKeyUp={(e) => e.key === "Enter" ? createList() : null}
              />
              <button onClick={createList}>Create</button>
            </div>
            <AddUser />

            <h2>Your Lists</h2>
          </div>
          <div className="lists-container">
        {lists.length === 0 && <p>No lists yet</p>}
        {lists.map((list) => (
          <div className="list-container" key={list.id} >
            <div className="link-to-list">
              <Link key={`LinkTo${list.id}`} href={`mylist/${list.id}/${list.staus}`}>{list.name}</Link>
            </div>
            <div className="list-users">{list.users.map((user, index) => (
              <span key={`user-${list.id}-${index+1}`}>{` ${user};`}</span>
            ))} </div>
            <div className="list-settings">
              <button onClick={() => deleteList(list.id)}>Delete List</button>
              <button
                className="rounded-md bg-gray-950/5 px-2.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-950/10"
                onClick={() => setUserPanelOpen(list.id)}
              >New user</button>

            </div>



            <div className="items-container">
              वस्तु {list.items.map((item) => (
                <div key={item.id} className="lists-item">
                  <span className="item-text">ⱝ {item.name}</span>
                  <button className="remove-item" onClick={() => deleteItem(list.id, item.id)} >×</button>
                  <span className="item-count"> × {item.count}</span>
                </div>
              ))}
            </div>

            <div className="add-item">
              <input
                className="add-item-content"
                placeholder="New item"
                value={newItemName[list.id] || ""}
                onChange={(e) =>
                  setNewItemName((prev) => ({ ...prev, [list.id]: e.target.value }))
                }
                onKeyUp={(e) => e.key === "Enter" ? addItem(list.id) : null}
              />
              <button
                onClick={() => addItem(list.id)}
                className="add-item-content rounded-md bg-gray-950/5 px-2.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-950/10"
              > Add </button>
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
