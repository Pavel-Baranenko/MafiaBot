"use client"

import React from "react";
import { Context } from "@/store/provider";
import GameService from "@/services/GameService";
import MyInput from "@/components/ui-kit/MyInput";
import Link from "next/link";
import { Game, GameUser, User } from "@/types";
import { useRouter } from "next/navigation";
import CardChoice from "@/components/ui-kit/cardChoice";



export default function Home() {
  const { push } = useRouter()
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
      setGameId(response.data.id)
      setStage('createNewGame')
      setOpenMenu(true)
    } catch (e) {
      console.log(e);
    }
  }
  const [stage, setStage] = React.useState("home")
  const [gameId, setGameId] = React.useState<number>()
  const [error, setError] = React.useState<string>()
  const [role, setRole] = React.useState<string>('')
  const [name, setName] = React.useState<string>('')
  const [openMenu, setOpenMenu] = React.useState<boolean>()



  const add = async (user: User, admin?: boolean) => {
    console.log("ADD");

    try {
      const response = await GameService.addUser({
        user_id: user.tg_id,
        gameId: gameId,
        name: name,
        avatar: user.avatar,
        status: "live",
        role: role.split('-')[0],
        card: role,
        type: getType(role),
      })
      console.log(response);
      admin ? push(`/games/control/${gameId}`) : push(`/games/${gameId}`)
    } catch (e) {
      console.log(e);
    }

  }
  const getType = (role: string) => {
    let type;
    if (["don", "dragdiller", "gunseller", "lawyer", "mafia", "prostitute"].includes(role)) type = "dark";
    else type = "light";

    return type;
  }

  const checkUser = async (users: GameUser[], game: Game) => {
    let user = store.user
    let count = 0;
    users.forEach((el: GameUser) => {
      if (el.user_id == user.tg_id) {
        count++
        //Если раскоментировать, будет проверка игрока на наличие в игре
        return 0;
      }
    })

    if (count == 0) {
      setOpenMenu(true)
    }
    else {
      push(`/games/${gameId}`)
    }

  }

  const getGame = async () => {

    if (gameId) {
      try {
        const response = await GameService.getById(Number(gameId))
        if (response.data.game == null) {
          setError("игра не найдена")
        }
        else {
          checkUser(response.data.users, response.data.game)
        }
      } catch (e) {
        console.log(e);
      }

    }
  }

  return (

    <div className="game__body">
      {stage == "new" ?
        <>

          {openMenu ?
            <>

              <CardChoice onChange={setRole} />
              {role &&
                <div className="new-game-box">

                  <div className="add__name">
                    <MyInput placeholder="Input name" onChange={(e) => setName(e.target.value)} />
                  </div>
                  <button className=' choice-bth' onClick={() => {
                    if (name) add(store.user, false)
                  }}>Enter</button>
                </div>
              }
            </>
            :
            <div className="center">
              <div className="new-game">
                <MyInput type="number" placeholder="id игры" onChange={(e) => { setGameId(e.target.value); error ? setError("") : "" }} />
                {error &&
                  <span className="error">{error}</span>
                }
                <button className='big-btn' onClick={() => {
                  if (!openMenu) getGame()
                  else add(store.user, false)
                }}>Enter</button>
              </div >
            </div>
          }
        </>

        :
        <>
          {stage == 'createNewGame' &&

            <>
              <CardChoice onChange={setRole} />
              {role &&
                <div className="new-game-box">
                  <div className="add__name">
                    <MyInput placeholder="Input name" onChange={(e) => setName(e.target.value)} />
                  </div>
                  <button className=' choice-bth' onClick={() => {
                    if (name) add(store.user, true)
                  }}>Enter</button>
                </div>
              }
            </>
          }

          <div className="center">
            {stage == "home" &&
              <>
                <button className="big-btn  go-to-game" onClick={() => setStage("new")}>Game</button>
                {store.user.role != "USER" &&
                  <>
                    <button className="big-btn" onClick={() => setStage("create")}>Create game</button>
                    <Link href="/games" className="settings big-btn" >
                      <img src="./img/icons/settings.svg" alt="" />
                      <span>Game management</span>
                    </Link>
                  </>
                }
              </>
            }


            {stage == "create" &&
              <>
                {/* <CreateGame /> */}
                <div className="new-game creator">
                  {/* <input type="number" placeholder='id игры' /> */}
                  <MyInput type='number' onChange={e => setCount(e.target.value)} placeholder="amount" />
                  {/* <DropDown options={options} onChange={setSelected} selected={selected || "Таймер"} /> */}
                  <button className='big-btn' onClick={create}>Create</button>
                </div >
                <button className="big-btn" onClick={() => setStage("home")}>back</button>
              </>
            }
          </div>
        </>

      }


    </div>
  );
}
