import { memo } from "react";
import { Virtuoso } from "react-virtuoso";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { useState } from "react";
import Link from "next/link";
import { setVisibleUA, setToListInput } from "@/lib/slices/dashboardSlice";
import { setListId, setAct, setSubject, setConfirmation } from "@/lib/slices/confirmationSlice";
import Item from './Item';
import { ItemParameters } from "./Item";

export default memo(function List(
  { listId, listStatus, listName, listUsers, listItems, fetchLists }:
    {
      listId: string;
      listStatus: string;
      listName: string;
      listUsers: [string];
      listItems: [{
        id: string; 
        status: string;
        name: string;
        count: string;
        }];
      fetchLists: () => {};
    }
) {
  const dispatch = useAppDispatch()
  const [newItemName, setNewItemName] = useState({});

  const addItem = async () => {

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
  const deleteList = async (listId: string) => {
    dispatch(setListId(listId))
    dispatch(setAct("delete"))
    dispatch(setSubject("list"))
    dispatch(setConfirmation("Do you really want to delete the list?"))

  };

  const setUserPanelOpen = async (listId: string) => {
    dispatch(setVisibleUA())
    dispatch(setToListInput(listId))
  }

  return (
    <div className="list-container" key={listId} >
      <div className="link-to-list">
        <Link key={`LinkTo${listId}`} href={`mylist/${listId}/${listStatus}`}>{listName}</Link>
      </div>
      <div className="list-users">{listUsers.map((user, index) => (
        <span key={`user-${listId}-${index + 1}`}>{` ${user};`}</span>
      ))} </div>
      <div className="list-settings">
        <button onClick={() => deleteList(listId)}
        ><span className="glagolitic">Ⱍ</span> Delete List</button>
        <button
          className="rounded-md bg-gray-950/5 px-2.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-950/10"
          onClick={() => setUserPanelOpen(listId)}
        > <span className="glagolitic">Ⰾ</span> New user</button>

      </div>
      {
        // वस्तु
      }
      <div className="items-container">

        {listItems.map((item) => (
          <Item
            key= {"item_no_" + item.id}
            listId={listId}
            itemId={item.id}
            itemCount={item.count}
            itemName={item.name}
          />
        ))}

        {/* <Virtuoso
          totalCount={listItems.length}
          // horizontalDirection
          itemContent={(index) => (
            <Item
              listId={listId}
              itemId={listItems[index].id}
              itemCount={listItems[index].count}
              itemName={listItems[index].name}
            />
          )}
          computeItemKey={(index) => `item-virtu-${index}}`}
          overscan={200}
        /> */}
      </div>


      <div className="control-sale-container">
        <div className="input-sale-container">
          <div className="signup-inputs">
            <input
              className="signup-line"
              type="text"
              placeholder="New item"
              value={newItemName[listId] || ""}
              onChange={(e) =>
                setNewItemName((prev) => ({ ...prev, [listId]: e.target.value }))
              }
              onKeyUp={(e) => e.key === "Enter" ? addItem() : null}
            />
          </div>

        </div>
        <div className="input-sale-container">
          <button
            className="signup-line submit-sum"
            onClick={() => addItem()}
          ><span className="glagolitic">Ⰶ</span> Add </button>
        </div>
      </div>

    </div>
  )
})