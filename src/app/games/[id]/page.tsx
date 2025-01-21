"use client";
import React from 'react'
import GameService from '@/services/GameService';
import { Context } from '@/store/provider';
import { GameUser, Game, Move, Messages } from '@/types';
import { enemies, userActionsList, stages, teamList, InfoEnemies, InfoCard } from '@/constants';



let currentTime = "0"
let currentStage = 0

export default function GamePage({ params }: { params: { id: string } }) {

  const { store } = React.useContext(Context)
  const id = params.id;

  const [info, setInfo] = React.useState<boolean>(false)
  const [users, setUsers] = React.useState<GameUser[]>([])
  const [move, setMove] = React.useState<boolean>(true)
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
  const [messages, setMessages] = React.useState<Messages[]>()

  const [resultsVote, setResults] = React.useState<Messages[]>()

  let min = Math.floor(gameTime / 60)
  let sec = (gameTime + 60) % 60

  const getRoleActions = (roleName: string): string => {
    return userActionsList[roleName];
  }

  let actions = player ? getRoleActions(player.role) : null

  let teams = player?.role ? teamList[player?.role] : null

  const getNameById = async (id: number) => {
    let name = ''
    users.forEach(e => {
      if (e.id == id && e.name) name = e.name
    })
    return name
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

  const getGame = async () => {

    if (store.user.tg_id) {
      const response = await GameService.getById(Number(id))

      setUsers(response.data.users)
      setGame(response.data.game)




      if ((currentStage != response.data.game.stage) && response.data.game.stage != undefined) {
        setMove(true)
        setMessage('')
        setJournalist(false)
        setSelectedUser(undefined)
        setNextUser(undefined)
        setGameTime(0);

        setGameTime(Number(response.data.game.timer));

        // if (currentTime != response.data.game.timer) {
        //   currentTime = response.data.game.timer;
        // }

        currentStage = response.data.game.stage

        response.data.users.forEach((el: GameUser) => {
          if (el.user_id == store.user.tg_id) {
            setPlayer(el)
          }
        })
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

  React.useEffect(() => {
    getGame()
    const gameInterval = setInterval(() => {
      getGame()
    }, 5000);
  }, [])


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
        console.log('aadddda');

        users[selectedUser].type == users[nextUser].type ? setMessage("В одной команде") : setMessage("В разных командах")
        setMove(false)
      }
      else {
        setMessage("Выберете второго игрока")
        setJournalist(true)
        console.log('sssssss');

      }
    }
    if (player?.role && enemies[player?.role] == user.role) {
      action = 'kill'
      killed_by_opponent = true
      setMove(false)
      // userMove = false
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

    console.log(response);
  }

  const Messages = async (id: number, round: number, time: string = 'night') => {
    const response = await GameService.getMessages(id, round, time)

    setMessages(response.data)
  }

  const ReultsVotes = async (id: number, round: number) => {
    console.log(id, round);
    const response = await GameService.getMessages(id, round, 'day')
    setResults(response.data)
    console.log(response.data);
  }

  const NomSelected = async (id: number, round: number) => {
    console.log(id);
    console.log(round);

    const response = await GameService.selected(id, round)
    console.log(response);

    let userselected = []
    response.data.forEach((e: any) => {
      if (e.selected == true) {
        userselected.push(e.user_id)
      }
      setNom(userselected);
    });
    console.log(response);

  }

  setTimeout(() => {
    if (gameTime != 0) {
      setGameTime(gameTime - 1)
    }
  }, 1000);

  return (

    <div className={`game__page  ${game?.stage == 2 || game?.stage == 3 ? 'night' : ""}`}>
      <div className="game__wrap">
        {game?.status == "new" &&
          <div className="game__heading-wrap">
            <span className="game__heading">Waiting for the game to start</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle fill="none" stroke-opacity="1" stroke="#FFFFFF" stroke-width=".5" cx="100" cy="100" r="0"><animate attributeName="r" calcMode="spline" dur="2" values="1;80" keyTimes="0;1" keySplines="0 .2 .5 1" repeatCount="indefinite"></animate><animate attributeName="stroke-width" calcMode="spline" dur="2" values="0;25" keyTimes="0;1" keySplines="0 .2 .5 1" repeatCount="indefinite"></animate><animate attributeName="stroke-opacity" calcMode="spline" dur="2" values="1;0" keyTimes="0;1" keySplines="0 .2 .5 1" repeatCount="indefinite"></animate></circle></svg>
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
                        <div className={`game__user-item  ${selectedUser == index ? "selected__user" : ""} ${nextUser == index ? "next__user_selected" : ""}`}
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
                        <div className={`game__user-item`}
                          key={item.user_id} >


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
                      <div className={`game__user-item ${selectedUser == index ? "selected__user" : ""} ${nextUser == index ? "next__user_selected" : ""}`}
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
                      <div className={`game__user-item ${selectedUser == index ? "selected__user" : ""} ${nextUser == index ? "next__user_selected" : ""}`}
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
                      }}>Пропустить</div>
                    }
                  </>
                }

                {((game.stage == 6) && selectedUser != undefined) &&
                  <div className="game__options-btn big-btn" onClick={() => {
                    if (voteUser) {
                      vote(voteUser)
                    }
                  }}>номинировать</div>
                }
                {(game.stage == 7 && selectedUser != undefined) &&
                  <div className="game__options-btn big-btn" onClick={() => {
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

  )
}
