
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import ConfirmationPanel from "@/components/ConfirmationPanel";
import ConfirmationButtons from "@/components/Confirmation";

import AddUser from "@/components/AddUser";

import Link from "next/link";
// import { Virtuoso } from "react-virtuoso";
import List from "@/components/listview/List";


export default function Dashboard() {

  // const dispatch = useAppDispatch()
  const { data: session, status } = useSession();
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  // const [loading, setLoading] = useState(false);

  const confirmationQuestion = useAppSelector(state => state.confirmation.confirmationQuestion)
  const router = useRouter()
  
  useEffect(() => {
    if (status === "authenticated") fetchLists();
  }, [status]);

  const fetchLists = useCallback( async () => {
    const res = await fetch("/api/lists/user");
    const data = await res.json();

    setLists(data);
  }, [])

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


  if (status === "loading") return <p>Ⰿ Loading...</p>;
  if (!session) return router.push("login");

  return (
        <div className="dashboard-container">
          <Link key='LinkToHome' href={'/'}>Home</Link>
          <span className="space-maker">   |   </span>
          <Link 
            key="signoutlink"
            href = "login"
            onClick={() => signOut()}
          > Sign out </Link>
          <span className="space-maker">   |   </span>
          <Link key='LinkToBudget' href={'budgets'}>  
            Budgets
          </Link>
          <div className="fontsize5">{session.user.email}</div>
          <div className="fontsize3 centered-div">Lists</div>
          <div className="dashboard-head">
            <div className="fontsize5">Create New List</div>
            <div className="control-sale-container">
              <div className="signup-inputs">
                <input
                  className="signup-line"
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="List name"
                  onKeyUp={(e) => e.key === "Enter" ? createList() : null}
                />
              </div>

              
              <div className="input-sale-container">
                <button
                  className="signup-line submit-sum"
                  onClick={createList}
                ><span className="glagolitic">Ⰶ</span> Create</button>
              </div>
            </div>               
            <AddUser />
            <div className="fontsize4 centered-div">Your lists</div>
          </div>
          <div className="lists-container">
            {lists.length === 0 && <p>No lists yet</p>}
        {lists.map((list) => (
          <List
            key={"list_no_"+list.listId}
            listId={list.id}
            listName={list.name}
            listStatus={list.status}
            listItems={list.items}
            listUsers={list.users}
            fetchLists={fetchLists}
          />
        
        ))}
            {/* <Virtuoso
              totalCount={lists.length}
              // horizontalDirection
              itemContent={(index) => (
                <List
                  listId={lists[index].id}
                  listName={lists[index].name}
                  listStatus={lists[index].status}
                  listItems={lists[index].items}
                  listUsers={lists[index].users}
                  fetchLists={fetchLists}
                />
              )}
              computeItemKey={(index) => `list-virtu-${index}}`}
              overscan={200}
              
            /> */}
          
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
