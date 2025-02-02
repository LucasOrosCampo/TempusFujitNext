import dayjs from "dayjs";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {CalendarIcon} from "lucide-react";
import {useState} from "react";


let currentYear = dayjs().year();
let yearsNumber = 8
let futureYears = 6;
let yearChoices: (number | undefined)[] = Array.from({length: yearsNumber}, (_, i) => currentYear + futureYears - i)
yearChoices.unshift(undefined)

function YearSelectorPopover(props: { year: number | undefined, setYear: (year: (number | undefined)) => void }) {
    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">Select a Year</h2>
            <div className="grid grid-cols-3 gap-2">
                {yearChoices.map((y) => (
                    <Button
                        key={y}
                        variant={"ghost"}
                        className={cn(
                            "w-full h-10 justify-center text-center font-normal",
                            y === props.year && "bg-primary text-white"
                        )}
                        onClick={() => props.setYear(y)}
                    >
                        {y ?? "None"}
                    </Button>
                ))}
            </div>
        </div>
    );
}

export function YearPicker({year, setYear}: { year: number | undefined, setYear: (year: number | undefined) => void }) {
    let [isOpen, setIsOpen] = useState(false);

    return (
        <Popover open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
            <PopoverTrigger asChild>
                <Button
                    id="date"
                    variant={"outline"}
                    className={"w-[100px] justify-start text-left font-normal mr-5"}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <CalendarIcon/>
                    {year}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 mr-20" align="start">
                <YearSelectorPopover year={year} setYear={(y) => {
                    setIsOpen(false);
                    setYear(y)
                }}/>
            </PopoverContent>
        </Popover>
    )
}
