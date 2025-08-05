import { PropsWithChildren } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { hideConfirmation, setConfirmation  } from "@/lib/slices/confirmationSlice"


interface ConfirmationButtons extends PropsWithChildren {
  
  callback: VoidFunction
}


const ConfirmationButtons = function ({ children, callback }: ConfirmationButtons) { //, titleClass = "", containerClass= ""
  const dispatch = useAppDispatch();
  const listId = useAppSelector(store => store.confirmation.listId)
  const itemId = useAppSelector(store => store.confirmation.itemId)
  const subject = useAppSelector(store => store.confirmation.subject)
  const act = useAppSelector(store => store.confirmation.act)

  const handleCancel = () => {

    dispatch(hideConfirmation())
  }
  const handleDeletion = () => {
    

    callback()
    return dispatch(hideConfirmation())

  }
  const deleteItem = async () => {
    await fetch(`/api/lists/${listId}/items/${itemId}/delete`, {
      method: "DELETE",
    });
    callback();
    dispatch(hideConfirmation())
  };

  const deleteList = async () => {
    await fetch(`/api/lists/${listId}/delete`, {
      method: "DELETE",
    });
    callback();
    dispatch(hideConfirmation())
  };
  // if (! confirmationQuestion) return null;
  // else
   //  {
    // const bodyStyle = document.body.style;
    // bodyStyle.backgroundColor = "grey";
    // document.body.className = ""
    console.log(subject)
    switch (subject) {
      case "list":
        return (
          <div>
            <div className="confirmation-buttons">
              <button className="confirmation-button" onClick={handleCancel}> No </button>
              <button className="confirmation-button" onClick={deleteList}> Yes </button>
              <div className="additional-children" >{children}</div>
            </div>
          </div>
        )
      case "item":
        return (
          <div>
            <div className="confirmation-buttons">
              <button className="confirmation-button" onClick={handleCancel}>No</button>
              <button className="confirmation-button" onClick={deleteItem}> Yes </button>
              <div className="confirmation-children" >{children}</div>
            </div>
          </div>
        )
      default:
        return (
          <div>
            <div>
              Would you like to do something?
            </div>
            <button className="" onClick={handleCancel}>Cancel</button>
          </div>
        )
    }
  //}
}
export default ConfirmationButtons
