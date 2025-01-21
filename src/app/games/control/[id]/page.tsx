"use client";
import React from 'react'
import GameService from '@/services/GameService';
import { CardsCount, Game, GameUser, Messages } from '@/types';
import DropDown from '@/components/ui-kit/DropDown';
import { Context } from '@/store/provider';
import { enemies, times, teamList, stages, userActionsList, InfoCard, InfoEnemies } from '@/constants';


let currentTime = "0"
let currentStage = 0

export default function GameControl({ params }: { params: { id: string } }) {

  const id = params.id
  const { store } = React.useContext(Context)

  const [cards, setCards] = React.useState<CardsCount>()
  const [other, setOther] = React.useState<boolean>(false)
  const [users, setUsers] = React.useState<GameUser[]>([])
  const [player, setPlayer] = React.useState<GameUser>()
  const [message, setMessage] = React.useState<string>()
  const [game, setGame] = React.useState<Game>()
  const [showMe, setShowMe] = React.useState<boolean>(false)
  const [journalist, setJournalist] = React.useState<boolean>(false)
  const [team, setTeam] = React.useState<boolean>(false)
  const [timer, setTimer] = React.useState<string>('')
  const [gameTime, setGameTime] = React.useState<number>(0)
  const [selectedUser, setSelectedUser] = React.useState<number>()
  const [nextUser, setNextUser] = React.useState<number>()
  const [voteUser, setVoteUser] = React.useState<number>()
  const [nom, setNom] = React.useState<any[]>()
  const [moves, setMoves] = React.useState<any[]>([])
  const [messages, setMessages] = React.useState<Messages[]>()
  const [resultsVote, setResults] = React.useState<Messages[]>()
  const [panel, setPanel] = React.useState<boolean>(false)
  const [move, setMove] = React.useState<boolean>(true)
  const [info, setInfo] = React.useState<boolean>(false)

  let min = Math.floor(gameTime / 60)
  let sec = (gameTime + 60) % 60

  const getNameById = async (id: number) => {
    let name = ''
    users.forEach(e => {
      if (e.id == id && e.name) name = e.name
    })
    return name
  }

  const getRoleActions = (roleName: string): string => {
    return userActionsList[roleName];
  }

  let actions = player ? getRoleActions(player.role) : null

  let teams = player?.role ? teamList[player?.role] : null
  let userOpt = ((player?.role == "mafia" && game?.stage == 2) || (player?.role != "mafia" && game?.stage == 3)) ? true : false

  const getGame = async () => {
    if (store.user.tg_id) {
      const response = await GameService.getById(Number(id))

      setUsers(response.data.users)
      setGame(response.data.game)

      if (game?.status == "new") {
        setCards(getCards(response.data.users))
      }

      if ((currentStage != response.data.game.stage) && response.data.game.stage != undefined) {
        setMove(true)
        setMessage('')
        setJournalist(false)
        setSelectedUser(undefined)
        setNextUser(undefined)
        setMoves([])


        setGameTime(0);
        setGameTime(Number(response.data.game.timer));

        currentStage = response.data.game.stage

        response.data.users.forEach((el: GameUser) => {
          if (el.user_id == store.user.tg_id) {
            setPlayer(el)
          }
        })
      }

      if (response.data.game.stage == 3) {
        const gameMoves = await GameService.gameMoves(response.data.game.id, response.data.game.stage, response.data.game.round)
        if (gameMoves.status == 200) {
          gameMoves.data.forEach(e => setMoves([...moves, e.artor_id]))
        }
      }
      if (response.data.game.stage == 9) {
        Messages(response.data.game.id, response.data.game.round, 'nomination')
      }
      if (response.data.game.stage == 4) {
        Messages(response.data.game.id, response.data.game.round)
      }
      if (response.data.game.stage == 7) {
        NomSelected(response.data.game.id, response.data.game.round)
      }
      if (response.data.game.stage == 8) {
        ReultsVotes(response.data.game.id, response.data.game.round)

        Messages(response.data.game.id, response.data.game.round, 'vote')
      }

    }
  }

  const nominate = async (user_id: number) => {
    setMove(false)
    if (game?.id) {
      const response = await GameService.nomination(user_id, game?.id, game?.round)
      const name = await getNameById(user_id)
      console.log(name);

      const message = await GameService.message({
        game_id: game.id,
        gameTime: 'vote',
        game_round: game.round,
        message: `Player ${player?.name} voted for ${name}`
      })
    }

  }

  const vote = async (user_id: number) => {
    setMove(false)
    if (game?.id && game?.round != undefined) {
      const response = await GameService.nominationSelect(user_id, game?.id, game?.round)
      const name = await getNameById(user_id)
      console.log(name);

      const message = await GameService.message({
        game_id: game.id,
        gameTime: 'nomination',
        game_round: game.round,
        message: `Player ${player?.name} nominated ${name}`
      })
    }
  }

  const setUser = async (options: string, user: GameUser) => {
    let action = options
    let killed_by_opponent = false

    if (player?.role != "journalist") {
      setMove(false)

      if (options == "check") {
        if (player?.role == "comissar") {
          if (user.type == "dark") {
            setMessage("It's the mafia")
          } else {
            setMessage("It's not the mafia")
          }
        }
        else if (player?.role == "gynecologist") {
          (user.role == "prostitute") ? setMessage("It's a prostitute") : setMessage("It's not a prostitute")

        }
        else if (player?.role == "phychiatrist") {
          user.role == "maniac" ? setMessage("It's a maniac") : setMessage("It's not a maniac")

        }
        else if (player?.role == "don") {
          if (user.role == "sheriff") {
            setMessage("sheriff")
          }
          if (user.role == "comissar") {
            setMessage("comissar")
          }
        }

      }
    }
    if (player?.role == "journalist") {

      if (nextUser != undefined && selectedUser != undefined) {
        users[selectedUser].type == users[nextUser].type ? setMessage("В одной команде") : setMessage("В разных командах")
        setMove(false)
      }
      else {
        setMessage("Выберете второго игрока")
        setJournalist(true)
      }
    }
    if (player?.role && enemies[player?.role] == user.role) {
      action = 'kill'
      killed_by_opponent = true
      setMove(false)
    }
    const response = await GameService.userMove({
      action: action,
      artor_name: player?.name,
      artor_role: player?.role,
      artor_id: player?.id,
      game_id: id,
      game_stage: game?.stage,
      opponent_name: user.name,
      opponent_id: user.id,
      opponent_role: user.role,
      killed_by_opponent: killed_by_opponent,
      round: game?.round
    })

  }

  const Messages = async (id: number, round: number, time: string = 'night') => {
    const response = await GameService.getMessages(id, round, time)
    console.log(response);

    setMessages(response.data)
  }


  const ReultsVotes = async (id: number, round: number) => {
    const response = await GameService.getMessages(id, round, 'day')
    setResults(response.data)
  }

  const NomSelected = async (id: number, round: number) => {
    const response = await GameService.selected(id, round)

    let userselected = []
    response.data.forEach((e: any) => {
      if (e.selected == true) {
        userselected.push(e.user_id)
      }
      setNom(userselected);
    });

  }

  const getStage = () => {
    switch (game?.stage) {
      case 0:
        return "общее обсуждение"
      case 10:
        return "Город засыпает"
      case 11:
        return "общее обсуждение"
      case 1:
        return "Город засыпает"
      case 2:
        return "Все просыпаются"
      case 3:
        return "Итоги ночи"
      case 4:
        return "общее обсуждение"
      case 5:
        return "номинирование"
      case 9:
        return "голосование"
      case 6:
        return "общее обсуждение"
      case 7:
        return "итоги голосования"
      case 8:
        return "Город засыпает"
    }
  }

  const getCards = (users: GameUser[]) => {
    let count: CardsCount = {
      "citizen": 8,
      "comissar": 1,
      "doctor": 1,
      "don": 1,
      "dragdiller": 1,
      "gunseller": 1,
      "gynecologist": 1,
      "journalist": 1,
      "lawyer": 1,
      "mafia": 4,
      "maniac": 1,
      "phychiatrist": 1,
      "prostitute": 1,
      "sheriff": 1,
      "traitor": 1
    }

    users.forEach((el: GameUser) => {
      if (el.role in count) {
        count[el.role]--
      }

      if (count[el.role] == 0) delete count[el.role]
    })

    return count;
  }

  const UpdateGame = async (action: string) => {
    if (game) {
      const response = await GameService.update({
        id: game.id,
        stage: game.stage,
        creator_id: game.creator_id,
        live_user: users.length,
        status: action
      })
    }
  }

  const setStage = async (stage: number, round?: boolean) => {
    if (game && game.round != undefined) {
      let gameRound = round ? game.round + 1 : game.round

      const response = await GameService.update({
        id: game.id,
        creator_id: game.creator_id,
        live_user: users.length,
        stage: stage,
        timer: timer,
        round: gameRound
      })

      const updateUser = async (userId: number,) => {
        const response = await GameService.setUser({
          id: userId,
          drags: false,
          lawyer_immuniter: false,
          wearon: false
        })
      }
      if (round) {
        users.forEach(e => {
          if (e.id) updateUser(e.id)
        })
      }
    }
  }

  const Kill = async (id?: number) => {
    try {
      const response = await GameService.setUser({
        id: id,
        status: "dead"
      })
    } catch (e) {
      console.log(e);
    }
  }

  const update = async (id: number, action: string) => {
    try {
      if (action == "bordel") {
        const response = await GameService.setUser({
          id: id,
          bordel: true
        })
      }
      else if (action == "protection") {
        const response = await GameService.setUser({
          id: id,
          lawyer_immuniter: true
        })
      }
      else if (action == "drags") {
        const response = await GameService.setUser({
          id: id,
          drags: true
        })
      }
      else if (action == "wearon") {
        const response = await GameService.setUser({
          id: id,
          wearon: true
        })
      }
    } catch (e) {
      console.log(e);
    }
  }

  const nightFinal = async () => {
    if (game?.id && game.round != undefined) {
      const response = await GameService.gameMoves(game?.id, game?.stage, game?.round)
      response.data.forEach(e => {

        if (e.action == "kill" && e.killed_by_opponent == false) {
          let userKill = true
          response.data.forEach(item => {
            if (item.opponent_id == e.opponent_id) {
              if (item.action == "heal" || item.action == "bordel") {
                userKill = false
              }
            }
          });

          if (userKill) {
            Kill(e.opponent_id)
            try {
              const response = GameService.message({
                game_id: game.id,
                gameTime: 'night',
                game_round: game.round,
                message: `Player ${e.opponent_name} was killed by ${e.artor_role}`
              })
            } catch (e) {
              console.log(e);
            }
          }
        }
        if (e.action == "kill" && e.killed_by_opponent == true) {
          Kill(e.opponent_id)

          try {
            const response = GameService.message({
              game_id: game.id,
              gameTime: 'night',
              game_round: game.round,
              message: `Player ${e.opponent_name} was killed in a gunfight`
            })
          } catch (e) {
            console.log(e);
          }
        }
        else if (e.action == "bordel") {
          try {
            const response = GameService.message({
              game_id: game.id,
              gameTime: 'night',
              game_round: game.round,
              message: `Player ${e.opponent_name} has been sent to a bordel`
            })
          } catch (e) {
            console.log(e);
          }
        }

        else if (['drags', 'protection', 'wearon'].indexOf(e.action)) update(e.opponent_id, e.action)
      });

      setStage(4);
    }
  }

  const checkUsers = async (id: number, type?: string) => {
    if (type == 'dark') {
      let count = 0
      let traitor = 0
      let lawyer = 0
      let gunseller = 0
      let dragdiller = 0
      let prostitute = 0

      const setRole = async (user_id: number) => {
        const response = await GameService.setUser({
          id: user_id,
          role: 'mafia'
        })
      }

      users.forEach(e => {
        if (e.id != id) {
          if ((e.role == 'mafia' || e.role == 'don') && e.status == 'live') {
            count++
          }
          if (e.role == 'traitor' && e.id) traitor = e.id
          if (e.role == 'lawyer' && e.id) lawyer = e.id
          if (e.role == 'gunseller' && e.id) gunseller = e.id
          if (e.role == 'dragdiller' && e.id) dragdiller = e.id
          if (e.role == 'prostitute' && e.id) prostitute = e.id
        }
      })
      if (count == 0) {
        if (traitor) setRole(traitor)
        else {
          if (lawyer) setRole(traitor)
          else if (gunseller) setRole(gunseller)
          else if (dragdiller) setRole(dragdiller)
          else if (prostitute) setRole(prostitute)
        }
      }
    }
  }

  const results = async () => {
    if (game?.id && game.round != undefined) {

      const response = await GameService.allNominated(game?.id, game?.round)
      let selected = 0
      let max = 0
      response.data.forEach((e: any) => {
        if (e.votes >= max) {
          max = e.votes
          selected = e.user_id
        }
      });

      users.forEach(e => {
        if (e.id == selected && max > 0) {
          if (e.lawyer_immuniter) {
            try {
              const response = GameService.message({
                game_id: game.id,
                gameTime: 'day',
                game_round: game.round,
                message: `Great job, mob lawyer!`
              })
            } catch (e) {
              console.log(e);
            }
          }
          else {
            Kill(selected)
            checkUsers(e.id, e.type)
            try {
              const response = GameService.message({
                game_id: game.id,
                gameTime: 'day',
                game_round: game.round,
                message: `As a result of voting, ${e.name} leaves the game with ${max} votes`
              })


            } catch (e) {
              console.log(e);
            }
          }

        }
      })

    }
  }

  React.useEffect(() => {
    getGame()
    const gameInterval = setInterval(() => {
      getGame()
    }, 3000);
  }, [])


  setTimeout(() => {
    if (gameTime != 0) {
      setGameTime(gameTime - 1)
    }
  }, 1000);



  return (

    <div className={`admin-control-page ${panel ? 'show-admin-settings' : ""}`}>
      <button className="show-admin-panel" onClick={() => setPanel(!panel)}>
        <img src="/img/icons/settings.svg" alt="" />
      </button>
      <div className="game__wrap-control">
        <div className="control">
          <div className="control__count">
            Amount {" " + users.length}
          </div>
          {game?.status == "new" &&
            <>
              <div className={`setother ${other ? "active" : ""}`} onClick={() => setOther(!other)}>Cards</div>
              {other &&
                <div className="control__count-bar">
                  {cards && Object.keys(cards).map(key =>
                    <div className='control__count-item' key={key}>
                      <p>{key}</p>
                      <span>{cards[key]}</span>
                    </div>)}
                </div>
              }
            </>

          }
          <div className={`setother ${other ? "active" : ""}`} onClick={() => setOther(!other)}>users</div>
          {other &&
            <div className="control__count-bar">
              {users.map(e =>
                <div className='control__count-item' key={e.id}>
                  <p>{e.name}</p>
                  <span>{e.role}</span>
                </div>)}
            </div>
          }

          {game?.status == "new" &&
            <button className="big-btn start" onClick={() => UpdateGame("active")}>Start game</button>
          }
          {game?.status == "active" &&
            <>
              {gameTime != 0 &&
                <span className='timer'>{`${min}:${sec}`}</span>
              }
              <div className="control-buttons-box  mt60">
                <button className="big-btn" onClick={() => UpdateGame("Peaceful victory")}> победа мирных </button>
                <button className="big-btn" onClick={() => UpdateGame("closed")}>остановить иру⛔️</button>
                <button className="big-btn" onClick={() => UpdateGame("Mafia victory")}> победа тёмных </button>
              </div>

              <div className="game__control-navbar">
                {/* <DropDown selected={timer || "мин"} options={times} onChange={setTimer} /> */}
                <button className="big-btn" onClick={() => {
                  if (game.stage == 0) setStage(10)
                  if (game.stage == 10) setStage(11)
                  if (game.stage == 11) setStage(5)

                  if (game.stage == 1) setStage(2)
                  if (game.stage == 2) setStage(3)
                  if (game.stage == 3) { nightFinal() }
                  if (game.stage == 4) setStage(5)
                  if (game.stage == 5) setStage(6)
                  if (game.stage == 6) setStage(9)
                  if (game.stage == 9) setStage(7)
                  if (game.stage == 7) { results(); setStage(8) }
                  if (game.stage == 8) { setStage(1, true) }

                }}>{getStage()}</button>
              </div>

            </>


          }

        </div>
      </div>

      <div className={`game__page  ${game?.stage == 2 || game?.stage == 3 ? 'night' : ""}`}>
        <div className="game__wrap">
          {game?.status == "new" &&
            <div className="game__heading-wrap">
              <span className="game__heading">Waiting for the game to start</span>
              <svg viewBox="0 0 200 200"><circle fill="none" stroke-opacity="1" stroke="#FFFFFF" stroke-width=".5" cx="100" cy="100" r="0"><animate attributeName="r" calcMode="spline" dur="2" values="1;80" keyTimes="0;1" keySplines="0 .2 .5 1" repeatCount="indefinite"></animate><animate attributeName="stroke-width" calcMode="spline" dur="2" values="0;25" keyTimes="0;1" keySplines="0 .2 .5 1" repeatCount="indefinite"></animate><animate attributeName="stroke-opacity" calcMode="spline" dur="2" values="1;0" keyTimes="0;1" keySplines="0 .2 .5 1" repeatCount="indefinite"></animate></circle></svg>
            </div>
          }
          {game?.status == "active" &&
            <>
              {(game?.stage != 4 && game?.stage != 7 && game?.stage != 6 && game?.stage != 8 && game?.stage != 9) &&

                <>
                  <div className="game__users">
                    {users.map((item: GameUser, index: number) => {
                      if (item.status != 'dead') {

                        return (
                          <div className={`game__user-item  ${selectedUser == index ? "selected__user" : ""} ${nextUser == index ? "next__user_selected" : ""}
                            ${moves.includes(String(item.id)) && ' user__move'}
                            `}
                            key={item.user_id} onClick={() => {
                              if ([3, 6, 7].includes(game.stage)) {
                                if (selectedUser && journalist) {
                                  if (game.stage == 3) {
                                    setNextUser(index)
                                  }
                                } else {
                                  setSelectedUser(index)
                                }
                              }

                            }}>

                            {((team && teams?.includes(item.role)) || (team && item.status == "dead")) &&
                              <img src={`/img/cards/${item.card}.jpg`} className="view-role" />
                            }
                            <span>{item.name}</span>

                          </div>
                        )
                      }

                    })}
                  </div>
                  <div className="game__users dead-users">
                    {users.map((item: GameUser) => {
                      if (item.status == 'dead') {
                        return (
                          <div className={`game__user-item `}
                            key={item.user_id} >

                            {((team && teams?.includes(item.role)) || (team && item.status == "dead")) &&
                              <img src={`/img/cards/${item.card}.jpg`} className="view-role" />
                            }
                            <span>{item.name}</span>

                          </div>
                        )
                      }

                    })}
                  </div>
                </>
              }
              {game?.stage == 6 &&
                <div className="game__users">
                  {users.map((item: GameUser, index: number) => {
                    if (item.status != 'dead') {
                      return (
                        <div className={`game__user-item  ${selectedUser == index ? "selected__user" : ""} ${nextUser == index ? "next__user_selected" : ""}`}
                          key={item.user_id} onClick={() => {

                            if ([3, 6, 7].includes(game.stage)) {
                              setSelectedUser(index); setVoteUser(item.id)
                            }
                          }
                          }>


                          {((team && teams?.includes(item.role)) || (team && item.status == "dead")) &&
                            <img src={`/img/cards/${item.card}.jpg`} className="view-role" />
                          }
                          <span>{item.name}</span>

                        </div>
                      )
                    }

                  })}
                </div>
              }

              {game?.stage == 7 &&
                <div className="game__users">
                  {users.map((item: GameUser, index: number) => {
                    if (nom?.indexOf(item.id) != -1) {
                      return (
                        <div className={`game__user-item  ${selectedUser == index ? "selected__user" : ""} ${nextUser == index ? "next__user_selected" : ""}`}
                          key={item.user_id} onClick={() => {
                            if ([3, 6, 7].includes(game.stage)) {
                              setSelectedUser(index); setVoteUser(item.id)
                            }
                          }
                          }>
                          {((team && teams?.includes(item.role)) || (team && item.status == "dead")) &&
                            <img src={`/img/cards/${item.card}.jpg`} className="view-role" />
                          }
                          <span>{item.name}</span>

                        </div>
                      )
                    }
                  })}
                </div>
              }
              {game?.stage == 8 &&
                <>

                  <div className="game__itog">{
                    resultsVote?.length == 0 ? "As a result of the vote, no one was excluded" :
                      resultsVote?.map((el) => {
                        return (
                          <div className="game__itog_item">
                            <span>{el.message}</span>
                          </div>
                        )
                      })}</div>

                  <div className="game__itog">{
                    messages?.length == 0 ? "As a result of the vote, no one was excluded" :
                      messages?.map((el) => {
                        return (
                          <div className="game__itog_item">
                            <span>{el.message}</span>
                          </div>
                        )
                      })}</div>
                </>

              }
              {game?.stage == 9 &&
                <div className="game__itog">{
                  messages?.length == 0 ? "As a result of the vote, no one was excluded" :
                    messages?.map((el) => {
                      return (
                        <div className="game__itog_item">
                          <span>{el.message}</span>
                        </div>
                      )
                    })}</div>
              }

              {game?.stage == 4 &&
                <div className="game__itog">
                  {messages?.length == 0 ? "No one was killed overnight" :
                    messages?.map((el) => {
                      return (
                        <div className="game__itog_item">
                          <span>{el.message}</span>
                        </div>
                      )
                    })}
                </div>
              }
            </>

          }
          {game?.status == "closed" &&
            <div className="game__heading-wrap">
              <span className="game__heading">Игра окончена</span>
            </div>
          }
          {game?.status == "Mafia victory" &&
            <div className="game__heading-wrap">
              <span className="game__heading">Mafia victory</span>
            </div>
          }
          {game?.status == "Peaceful victory" &&
            <div className="game__heading-wrap">
              <span className="game__heading">Peaceful victory</span>
            </div>
          }

        </div>
        {
          message &&
          <div className="game__message-box">{message}</div>
        }
        {
          game?.status == "active" &&
          <>
            <div className="game__status">
              {player?.status == "dead" &&
                <span className='youdead'>You dead</span>
              }
              {game.round != undefined &&
                <span className='game__stage'>{[11, 2, 3].includes(game.stage) ? `Night ${game.round + 1} — ` : `Day ${game.round + 1} — `}</span>
              }
              <span>{stages[game.stage]}</span>
              {gameTime != 0 &&
                <span className='timer'>{gameTime > 60 ? `${min}:${sec}` : gameTime}</span>
              }
            </div>
            <div className="game__navbar">
              <button className="user__roles" onClick={() => { setTeam(!team) }}>
                <svg enable-background="new 0 0 24 24" id="Layer_1" version="1.0" viewBox="0 0 24 24"><g><circle cx="18.5" cy="6.5" r="2.5" /></g><g><circle cx="5.5" cy="6.5" r="2.5" /></g><g><circle cx="12" cy="5" r="3" /></g><path d="M18.5,10c-0.5,0-1.6,0.2-2,0.5c0,0,0.5,1.1,0.5,2.5c0,0-1.2-4-5-4s-5,4-5,4c0-1.4,0.5-2.5,0.5-2.5C7.1,10.2,6,10,5.5,10  C3.8,10,2,12,2,13.3V19c0,1.1,0.9,2,2,2h2.9c0.9-0.9,2.5-2,5.1-2s4.2,1.1,5.1,2H20c1.1,0,2-0.9,2-2v-5.7C22,12,20,10,18.5,10z   M12,18c-1.4,0-2.5-1.1-2.5-2.5c0-1.4,1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5C14.5,16.9,13.4,18,12,18z" /></svg>
              </button>
              {(player?.status == "live" && move) &&
                <>

                  {(game.stage == 3) &&
                    <>
                      {(selectedUser != undefined && actions) &&
                        <div className="game__options-btn big-btn" onClick={() => {
                          setUser(actions, users[selectedUser])
                        }}>{actions}</div>
                      }
                      {(player?.role == "sheriff") &&
                        <div className="game__options-btn big-btn" onClick={() => {
                          // userMove = false
                          setMove(false)
                        }}>Пропустить</div>
                      }
                    </>
                  }

                  {((game.stage == 6) && selectedUser != undefined) &&
                    <div className="game__options-btn big-btn" onClick={() => {
                      setMove(false)
                      if (voteUser) {
                        vote(voteUser)
                      }
                    }}>номинировать</div>
                  }
                  {(game.stage == 7 && selectedUser != undefined) &&
                    <div className="game__options-btn big-btn" onClick={() => {
                      setMove(false)
                      if (voteUser) nominate(voteUser)
                    }}>Голосовать</div>
                  }
                </>

              }


              <button className="user__role left" onClick={() => setInfo(!info)}>?</button>
              <button className="user__role" onClick={() => setShowMe(true)}>Me</button>
              <div className={`user__card ${showMe ? "show" : ""}`} onClick={() => setShowMe(false)}>
                <img height={200} width={120} src={`/img/cards/${player?.card}.jpg`} alt="" />
              </div>



            </div>
            {info &&
              <div className="info-box" onClick={() => setInfo(false)}>
                <div className="info-card">
                  <img src={`/img/cards/${player?.card}.jpg`} alt="" />
                  <div className="info-h2 cap">{player?.role}</div>
                  {player?.role &&
                    <>
                      <div className="info-text ">{InfoCard[player?.role]}</div>
                      {InfoEnemies[player?.role] &&
                        <>
                          <div className="info-h2">Your enemies {InfoEnemies[player?.role]}</div>
                        </>
                      }
                    </>
                  }
                </div>
              </div>
            }

          </>
        }

      </div >
    </div>
  )
}
