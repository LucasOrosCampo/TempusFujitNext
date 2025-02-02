"use client";
import {Button} from "@/components/ui/button";
import {DatePickerWithRange} from "@/components/ui/date-picker-range";
import {useToast} from "@/hooks/use-toast";
import {dateAsUtc, get, post} from "@/utils/api";
import {formatDurationFromH} from "@/utils/helpers";
import dayjs, {Dayjs} from "dayjs";
import {Table} from "lucide-react";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {Suspense, useEffect, useState, useCallback} from "react";
import {DateRange} from "react-day-picker";
import {Group} from "@/app/group/_models";
import {Textarea} from "@/components/ui/textarea";

const GroupPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GroupPageContent/>
        </Suspense>
    );
};

export default GroupPage;

dayjs.extend(require('dayjs/plugin/utc'));
type SessionStatus = 'Initial' | { start: Dayjs }

function GroupPageContent() {
    let groupId = useSearchParams().get("groupId");

    let [sessionNote, setSessionNote] = useState<string | undefined>(undefined);
    let [sessionStatus, setSessionStatus] = useState<SessionStatus>('Initial');
    let [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: dayjs().startOf('month').toDate(),
        to: dayjs().endOf('month').toDate(),
    });
    let [durationForPeriod, setDurationForPeriod] = useState<number | undefined>(undefined);

    let {toast} = useToast();

    const load = useCallback(async () => {
        let group = await get<Group>(`group/${groupId}`);
        setGroup(group);
    }, [groupId]);

    let [group, setGroup] = useState<Group | undefined>(undefined);

    useEffect(() => {
        load();
    }, [load]);

    const getDuration = useCallback(async () => {
        if (!group) return;
        let query = `session/duration?group=${group.name}&start=${dateAsUtc(dateRange?.from)}`;
        if (!!dateRange?.to) query += `&end=${dateAsUtc(dateRange?.to)}`;
        setDurationForPeriod(await get<number>(query));
    }, [dateRange, group]);

    useEffect(() => {
        getDuration();
    }, [dateRange, group]);

    async function handleCreateSession() {
        let now = dayjs();
        await post('session/start', {start: now, group: group?.id}, () => toast({
            title: 'Error starting session',
            variant: 'destructive'
        }));
        setSessionStatus({start: now});
    }

    async function handleStopSession(): Promise<void> {
        if (sessionStatus == 'Initial') return;
        let {start} = sessionStatus;
        try {
            await post('session/end', {start: start, end: dayjs(), group: group?.id, note: sessionNote ?? ''});
            toast({title: "Session added", variant: "default"});
        } catch {
            toast({title: "Error while adding session", variant: "destructive"});
        } finally {
            setSessionStatus('Initial');
        }
    }

    if (!groupId) {
        return <div>Group ID is missing in the URL parameters.</div>;
    }

    return (
        <div className="h-screen m-10 flex flex-col justify-start items-center gap-5">
            <div className="flex items-center gap-4">
                <p className="font-semibold font-serif text-5xl">{group?.name}</p>
                <Link className="pt-3" href={`/sessions?group=${group?.name}`}>
                    <Table/>
                </Link>
            </div>
            <p className="self-start">{group?.description}</p>
            {sessionStatus === 'Initial' ? <Button onClick={() => handleCreateSession()}>Create Session</Button>
                : <div className={"flex flex-col "}>
                    <div className="flex gap-4 mb-5">
                        <h1 className="text-xl text-red-500">Session in progress</h1>
                        <Button onClick={() => handleStopSession()}>Stop</Button>
                    </div>
                    <Textarea value={sessionNote} onChange={e => setSessionNote(e.target.value)}/>
                </div>}
            <div className="flex gap-5 mt-2">
                <h1 className="text-xl pt-1">{"Horas de sesion durante el periodo : "}</h1>
                <DatePickerWithRange dateRange={dateRange} setDateRange={setDateRange}/>
                <h1 className="text-xl pt-1">{durationForPeriod ? formatDurationFromH(durationForPeriod!) : ''}</h1>
            </div>
        </div>
    );
}