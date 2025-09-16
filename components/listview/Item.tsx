
import { memo } from "react";
import { 
  setConfirmation,
  setAct,
  setSubject,
  setListId,
  setItemId 
} from "@/lib/slices/confirmationSlice";
import { useAppDispatch } from "@/lib/hooks";

export interface ItemParameters {
  itemId: string;
  listId: string;
  itemCount: string;
  itemName: string;
}

export default memo(function Input(
  {
    itemId,
    listId,
    itemName,
    itemCount,
  }: ItemParameters
){
  const dispatch = useAppDispatch()

  const deleteItem = async (listId: string, itemId: string) => {
      dispatch(setListId(listId))
      dispatch(setItemId(itemId))
      dispatch(setAct("delete"))
      dispatch(setSubject("item"))
      dispatch(setConfirmation("Do you really want to remove the item?"))
  
    };
  return (
    <div key={itemId} className="lists-item">
      <span className="item-text"><span className="glagolitic item-start">ⱌ</span> {itemName}</span>
      <button className="remove-item" onClick={() => deleteItem(listId, itemId)} >×</button>
      <span className="item-count"> × {itemCount}</span>
    </div>
  )
})
