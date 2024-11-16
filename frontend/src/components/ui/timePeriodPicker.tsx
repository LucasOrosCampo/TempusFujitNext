import { TimePeriod } from "@/hooks/use-time-period";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

type TimePeriodPickerProps = {
  timePeriod: TimePeriod;
};

type TimeBlock = {
  start: Dayjs;
  end: Dayjs;
  selected: boolean;
};

const timeframeStart = dayjs().hour(8).second(0);
const timeframeEnd = dayjs().hour(20).second(0);
const blockMinutes = 30;

function buildBlocks(): TimeBlock[] {
  let blocks: TimeBlock[] = [];
  let blockTime = timeframeStart.clone();
  while (blockTime.isBefore(timeframeEnd)) {
    return [];
  }

  return blocks;
}

export function TimePeriodPicker({ timePeriod }: TimePeriodPickerProps) {
  console.log("+-+-+--++-+-");
  let d = dayjs();
  console.log(d);
  d.month(2);
  console.log(d);
  let blocks = buildBlocks();
  let [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>();
  return <></>;
}
