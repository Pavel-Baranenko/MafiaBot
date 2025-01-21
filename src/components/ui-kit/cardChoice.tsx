import React from 'react'
import styles from "./index.module.scss"

export default function CardChoice({ onChange }: { onChange: (e: any) => void }) {

  const cards = ['citizen-1', 'citizen-2', 'citizen-3', 'citizen-4', 'citizen-5', 'citizen-6', 'citizen-7', 'citizen-8', 'comissar', 'doctor', 'journalist', 'gynecologist', 'sheriff', 'phychiatrist', 'traitor', 'maniac', 'gunseller', 'lawyer', 'prostitute', 'dragdiller', 'mafia-1', 'mafia-2', 'mafia-3', 'mafia-4', 'don']

  const [selcted, setSelected] = React.useState<string>()


  return (
    <>
      <div className={styles.cards}>
        {cards.map((e: string) => {
          return (
            <div className={`${styles.cards__item} ${selcted === e ? styles.selected__card : ""}`} key={e} onClick={() => {
              setSelected(e)
              onChange(e)
            }}>
              <img src={`./img/cards/${e}.jpg`} alt="" />
            </div>
          )
        })}

      </div >
    </>
  )
}
