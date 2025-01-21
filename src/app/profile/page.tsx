"use client"
import { STATIC } from '@/http'
import { Context } from '@/store/provider'
import Link from 'next/link'
import React from 'react'

export default function Profile() {

  const { store } = React.useContext(Context)
  return (
    <>
      <div className="wrap">
        <div className="profile__box">

          <div className="profile__photo">
            {store.user.avatar &&
              <img src={`${STATIC}${store.user.avatar}`} alt="" />
            }
          </div>
          <div className="profile__info">
            <span>{store.user.firstname}</span>
            <span>{store.user.lastname}</span>
          </div>
          <Link href="/profile/edit" className='big-btn'>Edit</Link>

          <div className="profile__rating-box">
            <div className="profile__rating">
              <p>Rating</p>
              <span>{store.user.rating}</span>
            </div>
            <div className="profile__rating">
              <p>Mafia</p>
              <span>{store.user.mafia_rating}</span>
            </div>
            <div className="profile__rating">
              <p>Commissar</p>
              <span>{store.user.commissar_rating}</span>
            </div>
            <div className="profile__rating">
              <p>Maniac</p>
              <span>{store.user.maniac_rating}</span>
            </div>
            <div className="profile__rating">
              <p>Doctor</p>
              <span>{store.user.doctor_rating}</span>
            </div>
            <div className="profile__rating">
              <p>Sheriff</p>
              <span>{store.user.sheriff_rating}</span>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
