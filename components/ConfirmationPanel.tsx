import { PropsWithChildren } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { hideConfirmation, setConfirmation  } from "@/lib/slices/confirmationSlice"



const ConfirmationPanel = function ({ children }: PropsWithChildren) { //, titleClass = "", containerClass= ""

  const confirmationQuestion = useAppSelector((state) => state.confirmation.confirmationQuestion)

  if (!confirmationQuestion) return null;
    else {
      return (
        <div>
          <div className="confirmation-panel"></div>
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
