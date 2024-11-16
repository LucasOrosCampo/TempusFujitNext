import  dayjs, { Dayjs } from 'dayjs'
import { useState } from 'react'

export type TimePeriod = {
    date: Dayjs 
    startTime: Dayjs | undefined
    endTime: Dayjs | undefined
}

type TimePeriodHook = {
    start: (time: Dayjs) => void
    end: (time: Dayjs) => void
    changeDate: (time: Dayjs) => void 
    timePeriod: TimePeriod
}


export function useTimePeriod(): TimePeriodHook {
    let [date, setDate] = useState<Dayjs>(dayjs())
    let [startTime, setStartTime] = useState<Dayjs | undefined>(undefined)
    let [endTime, setEndTime] = useState<Dayjs | undefined>(undefined)

    let timePeriod : TimePeriod = {
        date,
        startTime,
        endTime
    }
    
    let start = (time: Dayjs): void => setStartTime(time)
    let end = (time: Dayjs): void => setEndTime(time)
    let changeDate = (time: Dayjs): void => setDate(time)

    return { start, end, changeDate, timePeriod }

}
