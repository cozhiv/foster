import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setToListInput } from '@/lib/slices/dashboardSlice'
import { setInvisibleUA, setVisibleUA } from '@/lib/slices/dashboardSlice'
import InputField from './Input'
import BiButton from './Button'

const AddUser = React.memo(AddUserRaw)
function AddUserRaw() {
  const [newUserInput, setNewUserInput] = useState("")
  // const [ivisibleUA, setivisibleUA] = useState(true)


  
  const dispatch = useAppDispatch()
  const toListInput = useAppSelector((state) => state.dashboard.toListInput)
  const invisibleUA = useAppSelector(state => state.dashboard.invisibleUA)
  const addUserToList = async () => {
    const userAddition =  await fetch(`/api/lists/${toListInput}/adduser`, {
      method: "Post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail: newUserInput }),
    })
    // console.log(JSON.stringify(userAddition))
    dispatch(setInvisibleUA())
    return userAddition
  }
  return (
    <div className={`relative z-10 ${invisibleUA ? "invisible" : ""}`}>

      <div
        className=""
      ></div>

      <div className="add-user-popup fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            className=""
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">

                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-base font-semibold text-gray-900">
                    Add User
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      The email of the user to be added                     </p>
                    <InputField
                      value={newUserInput}
                      onChange={(e) => setNewUserInput(e.target.value)}
                      placeholder="Hasmokar!"
                    ></InputField>
                    <p className="text-sm text-gray-500">
                      The ID of the list in which the User will be added                       </p>
                    <label htmlFor=""></label>
                    <InputField
                      value={toListInput}
                      placeholder='List ID'
                      onChange={(e) => dispatch(setToListInput(e.target.value))} ></InputField>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <BiButton
                name= "Add User"
                onClick={() => addUserToList()}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
              </BiButton>
              <BiButton
                name = "Cancel"
                onClick={() => dispatch(setInvisibleUA())}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
              </BiButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddUser;
