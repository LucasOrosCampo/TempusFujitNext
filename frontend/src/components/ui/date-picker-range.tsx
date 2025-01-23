"use client"

import * as React from "react"
import {Calendar as CalendarIcon} from "lucide-react"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import dayjs from "dayjs"
import {DateRange} from "react-day-picker";

type DatePickerProps = {
    dateRange: DateRange | undefined
    setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}

export function DatePickerWithRange({
                                        className, dateRange, setDateRange
                                    }: React.HTMLAttributes<HTMLDivElement> & DatePickerProps) {
    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !dateRange && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon/>
                        {dateRange?.from
                            ? (
                                dateRange.to ? (
                                    <>
                                        {dayjs(dateRange.from).format("DD MMM, YY")} -{" "}
                                        {dayjs(dateRange.to).format("DD MMM, YY")}
                                    </>
                                ) : (
                                    dayjs(dateRange.from).format("DD MMM, YY")
                                )
                            )
                            : (
                                <span>Pick a date</span>
                            )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange ? {from: dateRange.from, to: dateRange.to} : undefined}
                        onSelect={(range) => setDateRange(range ? {
                            from: dayjs(range.from).hour(12).toDate(),
                            to: dayjs(range.to).hour(12).toDate()
                        } : range)}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
