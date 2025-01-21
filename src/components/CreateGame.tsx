"use client"
import { Context } from '@/store/provider'
import React from 'react'
import GameService from "../services/GameService"
import DropDown from './ui-kit/DropDown'
import MyInput from './ui-kit/MyInput'
import { useRouter } from 'next/navigation';

export default function CreateGame() {

  const { push } = useRouter()
  const options = ["30", "40", "60", "1 min", "2 min", "3 min"]

  const [selected, setSelected] = React.useState<string>()
  const [count, setCount] = React.useState<number>(0)


  const { store } = React.useContext(Context)
  const id = store.user.tg_id

  const create = async () => {
    try {
      const response = await GameService.create({
        creator_id: id,
        stage: 0,
        status: "new",
        roles: [""],
        live_user: count
      })
      push("/games")
    } catch (e) {
      console.log(e);
    }
  }


  return (
    <>
      <div className="new-game creator">
        {/* <input type="number" placeholder='id игры' /> */}
        <MyInput type='number' onChange={e => setCount(e.target.value)} placeholder="amount" />
        {/* <DropDown options={options} onChange={setSelected} selected={selected || "Таймер"} /> */}
        <button className='big-btn' onClick={create}>Create</button>
      </div >
    </>
  )
}
