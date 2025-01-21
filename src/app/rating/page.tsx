"use client"
import { STATIC } from '@/http'
import UserService from '@/services/UserService'
import { User } from '@/types'
import React from 'react'

export default function Rating() {
  const [rating, setRating] = React.useState<User[]>()


  const getRating = async () => {
    try {
      const response = await UserService.getRating()
      setRating(response.data)
    } catch (e) {
      console.log(e);
    }
  }
  React.useEffect(() => {
    getRating()
  }, [])

  return (
    <>
      <div className="rating">
        <table className="rating__box">
          <tbody>
            {rating?.map((el: User, index: number) => {
              return (
                <tr className="rating__item" key={el.tg_id}>
                  <td className="rating__item-id">{index + 1}</td>
                  <td>
                    <div className="rating-image">
                      {el.avatar &&
                        <img alt='' src={`${STATIC}${el.avatar}`} />
                      }
                    </div>
                  </td>
                  <td>{el.firstname} {el.lastname} </td>
                  <td className="rating__item-score">{el.rating}</td>
                </tr>
              )
            })}
          </tbody>

        </table>
      </div>
    </>
  )
}
