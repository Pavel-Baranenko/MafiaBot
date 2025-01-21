"use client";
import GameService from '@/services/GameService';
import { Context } from '@/store/provider'
import { Game } from '@/types';
import Link from 'next/link';
import React from 'react'

export default function Games() {

  const { store } = React.useContext(Context);

  const [games, setGames] = React.useState<Game[]>()

  const getGames = async () => {
    try {
      let id = await store.user.tg_id
      const response = await GameService.getByAdminId(id)
      setGames(response.data?.reverse())
    } catch (e) {
      console.log(e);
    }
  }
  React.useEffect(() => {
    getGames()
  }, [])


  return (
    <>
      {games &&
        <div className="games-box">
          <div className="games-item">
            <div className="games-item-left">
              <span>ID</span>
              <span>Amount</span>
              <span>Status</span>
            </div>

            <div className="games-item-right">
            </div>
          </div>
          {games.map((el: Game) => {
            return (
              <div className="games-item" key={el.id}>
                <div className="games-item-left">
                  <span>{el.id}</span>
                  <span>{el.live_user}</span>
                  <span>{el.status}</span>
                </div>
                <div className="games-item-right">
                  <Link href={`/games/report/${el.id}`} className='games-item-link'>Raport</Link>
                  <Link href={`/games/control/${el.id}`} className='games-item-link' >game</Link>
                </div>
              </div>
            )
          })}
        </div>
      }
    </>
  )
}
