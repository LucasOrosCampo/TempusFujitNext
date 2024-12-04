"use client";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-picker-range";
import { useToast } from "@/hooks/use-toast";
import { get, post } from "@/utils/api";
import { formatDurationFromH } from "@/utils/helpers";
import dayjs, { Dayjs } from "dayjs";
import { Table } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";


const GroupPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GroupPageContent />
    </Suspense>
  );
};

export default GroupPage;

type SessionStatus = 'Initial' | { start: Dayjs }

function GroupPageContent() {

  let groupId = useSearchParams().get("groupId");
  let [sessionStatus, setSessionStatus] = useState<SessionStatus>('Initial')
  let [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: dayjs().startOf('month'),
    to: dayjs().endOf('month'),
  })
  let [durationForPeriod, setDurationForPeriod] = useState<number | undefined>(undefined)

  let { toast } = useToast()
  async function load() {
    let group = await get<Group>(`group/${groupId}`);
    setGroup(group);
  }

  let [group, setGroup] = useState<Group | undefined>(undefined);

  useEffect(() => {
    load();
  }, []);

  async function getDuration() {
    if (!group) return
    let query = `session/duration?group=${group.name}&start=${dateRange?.from}`
    if (!!dateRange?.to) query += `&end=${dateRange?.to}`
    setDurationForPeriod(await get<number>(query))
  }

  useEffect(() => {
    getDuration();
  }, [dateRange, group]);

  async function handleCreateSession() {
    let now = dayjs()
    await post('session/start', { start: now, group: group?.id }, () => toast({ title: 'Error starting session', variant: 'destructive' }))
    setSessionStatus({ start: now })
  }

  async function handleStopSession(): Promise<void> {
    if (sessionStatus == 'Initial') return
    let { start } = sessionStatus
    try {
      await post('session/end', { start: start, end: dayjs(), group: group?.id })
      toast({ title: "Session added", variant: "default" });
    }
    catch { toast({ title: "Error while adding session", variant: "destructive" }) }
    finally { setSessionStatus('Initial') }
  }

  return (
    <div className="h-screen m-10 flex flex-col justify-start items-center gap-5">
      <div className="flex items-center gap-4">
        <p className="font-semibold font-serif text-5xl">{group?.name}</p>
        <Link className="pt-3" href={`/sessions?group=${group?.name}`}>
          <Table />
        </Link>
      </div>
      <p className="self-start">{group?.description}</p>
      {sessionStatus === 'Initial' ? <Button onClick={() => handleCreateSession()}>Create Session</Button> :
        <div className="flex gap-4">
          <h1 className="text-xl text-red-500">Session in progress</h1>
          <Button onClick={() => handleStopSession()}>Stop</Button>
        </div>}
      <div className="flex gap-5 mt-2">
        <h1 className="text-xl pt-1">{"Horas de sesion durante el periodo : "}</h1>
        <DatePickerWithRange dateRange={dateRange} setDateRange={setDateRange} />
        <h1 className="text-xl pt-1">{durationForPeriod ? formatDurationFromH(durationForPeriod!) : ''}</h1>
      </div>
    </div>
  );
}