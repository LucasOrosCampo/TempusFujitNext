"use client";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { TimePeriodPicker } from "@/components/ui/timePeriodPicker";
import { useTimePeriod } from "@/hooks/use-time-period";
import { useToast } from "@/hooks/use-toast";
import { get, post } from "@/utils/api";
import dayjs, { Dayjs } from "dayjs";
import { Table } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

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

  let groupName = useSearchParams().get("groupName");
  let [sessionStatus, setSessionStatus] = useState<SessionStatus>('Initial')

  let { toast } = useToast()

  let [group, setGroup] = useState<Group | undefined>(undefined);
  useEffect(() => {
    load();
  }, []);

  async function load() {
    let group = await get<Group>(`group/${groupName}`);
    setGroup(group);
  }

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
    </div>
  );
}