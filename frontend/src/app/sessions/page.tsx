"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/datatable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { get, post } from "@/utils/api";
import { ColumnDef } from "@tanstack/react-table";
import { CirclePlus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo, Suspense } from "react";
import { Session } from "../models/session";
import dayjs, { Dayjs } from "dayjs";
import { DatePickerWithRange } from "@/components/ui/date-picker-range";
import React from "react";
import utc from "dayjs/plugin/utc"
import { formatDurationFromMs } from "@/utils/helpers";

dayjs.extend(utc)
export default function SessionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SessionsPageContent />
    </Suspense>
  );
}

export type DateRange = {
  from: Dayjs
  to?: Dayjs | undefined
}

function SessionsPageContent() {
  let [sessions, setSessions] = useState<Session[]>([]);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: dayjs().startOf('month').hour(12),
    to: dayjs().endOf('month').hour(12),
  })

  let group = useSearchParams().get("group");

  let load = async () => {
    if (dateRange === undefined) return
    let query = `session?group=${group}&start=${dateRange?.from.utc().hour(0).minute(0).second(0)}`
    if (!!dateRange?.to) query += `&end=${dateRange?.to.utc().hour(0).minute(0).second(0)}`

    setSessions(await get(query));
  };
  useEffect(() => {
    load();
  }, []);

  useEffect(() => { load() }, [dateRange])

  let columns: ColumnDef<Session>[] = [
    {
      accessorFn: (x: Session) => x.start ? dayjs(x.start).format('DD/MM HH:mm') : '',
      header: "Comienzo",
    },
    {
      accessorFn: (x: Session) => x.end ? dayjs(x.end).format('DD/MM HH:mm') : '',
      header: "Final",
    },
    {
      accessorFn: (x: Session) => !!x.end && !!x.start ? formatDurationFromMs(dayjs(x.end).diff(dayjs(x.start))) : '',
      header: "Duracion",
    },
  ];
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <div className="rounded-xl p-5 m-5 flex items-center justify-center h-32 bg-gradient-to-r from-purple-700 via-pink-700 to-red-700 shadow-lg">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-wide">
          {"sessions de " + group}
        </h1>
      </div>
      <div className="flex gap-8 my-6">
        <div className="grid w-full max-w-sm items-center">
          <Label className="px-3" htmlFor="nameSearch">
            Name
          </Label>
          <DatePickerWithRange dateRange={dateRange} setDateRange={setDateRange} />
        </div>
      </div>
      <div className="w-10/12">
        <DataTable columns={columns} data={sessions} />
      </div>
    </div>
  );
}