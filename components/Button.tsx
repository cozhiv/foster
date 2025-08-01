import React from "react";
import type { MouseEventHandler } from "react";
interface Buttony {
  name: string
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onMouseUp?: MouseEventHandler<HTMLButtonElement>;
  onMouseDown?: MouseEventHandler<HTMLButtonElement>;
  className: string
}

function BigButton({ name, onClick, onMouseUp, onMouseDown, className }: Buttony) {
  return (
    <div className="btn btn-primary">
      <label>
        <button
          type="button"
          onClick={onClick}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          className={className}
        >{name}</button>
      </label>
    </div>
  )
}

const BiButton = React.memo(BigButton)
export default BiButton;