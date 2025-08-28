import { PropsWithChildren, useEffect, useRef } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { hideConfirmation, setConfirmation  } from "@/lib/slices/confirmationSlice"



const ConfirmationPanel = function ({ children }: PropsWithChildren) { //, titleClass = "", containerClass= ""
  const background = useRef(null);
  const dispatch = useAppDispatch();
  const handleCancelation = () => {
    dispatch(hideConfirmation());
  }

  // useEffect(() => {
  //   const backDiv = background.current;
  //   backDiv.addEventListener('click', handleCancelation)
  //   return ()=> {
  //     backDiv.removeEventListener("scroll", handleCancelation)
  //   }
  // }, [])
  
  const confirmationQuestion = useAppSelector((state) => state.confirmation.confirmationQuestion)

  if (!confirmationQuestion) return null;
    else {
      return (
        <div>
          <div className="confirmation-panel" ref={background}></div>
          <div>
            <div className="confirmation-container">
              <div className="confirmation-title">{confirmationQuestion}</div>
              <div className="confirmation-content" >{children}</div>
            </div>
          </div>
        </div>

      )
    }
  }
export default ConfirmationPanel
