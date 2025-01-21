"use client";
import React from 'react'

export default function NewGame({ onChange }: { onChange: () => void }) {


  return (
    <>
      <div className="new-game">
        <input type="number" placeholder='id игры' />
        <button className='big-btn' onClick={() => { onChange() }}>Войти</button>
      </div >
    </>
  )
}
