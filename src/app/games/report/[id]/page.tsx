"use client";
import React from 'react'
import { Context } from '@/store/provider';
import MyInput from '@/components/ui-kit/MyInput';
import StatsService from '@/services/StatsService';
import { gameFinance } from '@/types';
import { useRouter } from 'next/navigation';



export default function Report({ params }: { params: { id: string } }) {
  const { push } = useRouter()


  const id = params.id

  const { store } = React.useContext(Context)

  const [report, setReport] = React.useState<gameFinance>()

  const [count, setCount] = React.useState<number>(report ? (report.count || 0) : 0)
  const [standart, setStandart] = React.useState(
    report ? { count: (report.standart_count || 0), price: (report.standart_price || 0), } : { count: 0, price: 750, })
  const [discount, setDiscount] = React.useState(report ? { count: (report.discount_count || 0), price: (report.discount_price || 0) } :
    { count: 0, price: 500, })
  const [free, setFree] = React.useState<number>(report ? (report.free || 0) : 0)


  const [adminCoast, setAdminCoast] = React.useState<number>(report ? (report.admin_coast || 0) : 25)


  const getStats = async () => {
    const response = await StatsService.getById(Number(id))
    setReport(response.data)
    console.log(response);

  }
  React.useEffect(() => {
    getStats()
  }, [])


  const sendReport = async () => {
    if (report) {
      const response = await StatsService.update({
        gameId: Number(id),
        count: count,
        standart_count: standart.count,
        standart_price: standart.price,
        discount_count: discount.count,
        discount_price: discount.price,
        free: free,
        total: (standart.count * standart.price + discount.count * discount.price),
        admin_coast: adminCoast,
      })
    }
    else {
      const response = await StatsService.create({
        gameId: Number(id),
        count: count,
        standart_count: standart.count,
        standart_price: standart.price,
        discount_count: discount.count,
        discount_price: discount.price,
        free: free,
        total: (standart.count * standart.price + discount.count * discount.price),
        admin_coast: adminCoast,
      })
    }
    push("/games")

  }


  return (
    <>
      <div className="report__wrap wrap">
        <MyInput type='number' placeholder='Количество человек'
          value={count}
          onChange={e => setCount(e.target.value)} />
        <div className="report__box">
          <div className="report__box-item">
            <MyInput type='number' placeholder='Розница' value={standart.price} onChange={e => setStandart({
              count: standart.count,
              price: e.target.value
            })} />
          </div>
          <div className="report__box-item">
            <MyInput type='number' placeholder='0' onChange={e => setStandart({
              count: e.target.value,
              price: standart.price
            })} />
          </div>
        </div>
        <div className="report__box">
          <div className="report__box-item">
            <MyInput type='number' placeholder='По скидке' value={discount.price} onChange={e => setDiscount({
              count: discount.count,
              price: e.target.value
            })} />
          </div>
          <div className="report__box-item">
            <MyInput type='number' placeholder='0' onChange={e => setDiscount({
              count: e.target.value,
              price: discount.price
            })} />
          </div>

        </div>
        <div className="report__box">
          <div className="report__box-item full">
            <MyInput type='number' placeholder='Без оплаты' onChange={e => setFree(e.target.value)} />
          </div>
          <div className="report__box-item full">
            <MyInput type='number' placeholder='% Админа' value={adminCoast} onChange={e => setAdminCoast(e.target.value)} />
          </div>
        </div>
        <div className="report__box">
          <span className='report__price'>{(standart.price || 0) * (standart.count || 0) + (discount.price || 0) * (discount.count || 0)}</span>
        </div>
        <button className='big-btn' onClick={sendReport}>Сохранить</button>
      </div>
    </>
  )
}
