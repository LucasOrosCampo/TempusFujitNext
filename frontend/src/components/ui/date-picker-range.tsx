"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import dayjs from "dayjs"

type DatePickerProps = {
    dateRange: DateRange | undefined
    setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}
dayjs.locale("es");
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
                        <CalendarIcon />
                        {dateRange?.from ? (
                            dateRange.to ? (
                                <>
                                    {dateRange.from.format("DD MMM, YY")} -{" "}
                                    {dateRange.to.format("DD MMM, YY")}
                                </>
                            ) : (
                                dateRange.from.format("DD MMM, YY")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from ? dateRange?.from.toDate() : undefined}
                        selected={{ from: dateRange?.from?.toDate(), to: dateRange?.to?.toDate() }}
                        onSelect={(date) => setDateRange({ from: dayjs(date?.from), to: date?.to ? dayjs(date?.to) : undefined })}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
