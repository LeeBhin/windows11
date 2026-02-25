import { useState, useEffect } from 'react'

const DAY_NAMES = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
const DAY_SHORT = ['일', '월', '화', '수', '목', '금', '토']

export function useClock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hour = now.getHours()
  const minute = now.getMinutes().toString().padStart(2, '0')
  const period = hour < 12 ? '오전' : '오후'
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  const time = `${period} ${hour12}:${minute}`

  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const date = `${year}-${month}-${day}`

  const dayName = DAY_NAMES[now.getDay()]
  const dayShort = DAY_SHORT[now.getDay()]
  const tooltipLine1 = `${year}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${dayName}`
  const tooltipLine2 = `${dayShort} ${time} (현지 시각)`

  return { time, date, tooltipLine1, tooltipLine2 }
}
