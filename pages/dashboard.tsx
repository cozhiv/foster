
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [newItemName, setNewItemName] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") fetchLists();
  }, [status]);

  const fetchLists = async () => {
    const res = await fetch("/api/lists/user"); // You’ll need to create this route
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

  const addItem = async (listId: string) => {
    const name = newItemName[listId];
    if (!name) return;
    await fetch(`/api/lists/${listId}/items/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, listId }),
    });
    setNewItemName((prev) => ({ ...prev, [listId]: "" }));
    fetchLists();
  };

  const deleteItem = async (listId: string, itemId: string) => {
    await fetch(`/api/lists/${listId}/items/${itemId}/delete`, {
      method: "DELETE",
    });
    fetchLists();
  };

  const deleteList = async (listId: string) => {
    await fetch(`/api/lists/${listId}/delete`, {
      method: "DELETE",
    });
    fetchLists();
  };

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>You must be signed in.</p>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Hello, {session.user.email}</h1>
      <button onClick={() => signOut()}>Sign out</button>

      <h2>Create New List</h2>
      <input
        value={newListName}
        onChange={(e) => setNewListName(e.target.value)}
        placeholder="List name"
      />
      <button onClick={createList}>Create</button>

      <h2>Your Lists</h2>
      {lists.length === 0 && <p>No lists yet</p>}
      {lists.map((list) => (
        <div key={list.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <h3>
            {list.name}
            <button onClick={() => deleteList(list.id)} style={{ marginLeft: 10 }}>Delete List</button>
          </h3>

          <ul>
            {list.items.map((item) => (
              <li key={item.id}>
                {item.name}
                <button onClick={() => deleteItem(list.id, item.id)} style={{ marginLeft: 10 }}>
                  ❌
                </button>
              </li>
            ))}
          </ul>

          <input
            placeholder="New item"
            value={newItemName[list.id] || ""}
            onChange={(e) =>
              setNewItemName((prev) => ({ ...prev, [list.id]: e.target.value }))
            }
          />
          <button onClick={() => addItem(list.id)}>Add Item</button>
        </div>
      ))}
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
