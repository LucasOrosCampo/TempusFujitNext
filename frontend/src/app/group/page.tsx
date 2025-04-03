"use client";
import {Button} from "@/components/ui/button";
import {DatePickerWithRange} from "@/components/ui/date-picker-range";
import {useToast} from "@/hooks/use-toast";
import {dateAsUtc, get, post} from "@/utils/api";
import {formatDurationFromH} from "@/utils/helpers";
import dayjs, {Dayjs} from "dayjs";
import {Table, Aperture} from "lucide-react";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {Suspense, useEffect, useState, useCallback} from "react";
import {DateRange} from "react-day-picker";
import {Group} from "@/app/group/_models";
import {Textarea} from "@/components/ui/textarea";
import {Separator} from "@/components/ui/separator";

const GroupPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GroupPageContent/>
        </Suspense>
    );
};

type ManualButtonColor = 'red' | 'green';

export default GroupPage;

dayjs.extend(require('dayjs/plugin/utc'));
type SessionStatus = 'Initial' | { start: Dayjs }

function GroupPageContent() {
    let groupId = useSearchParams().get("groupId");

    let [sessionNote, setSessionNote] = useState<string | undefined>(undefined);
    let [sessionStatus, setSessionStatus] = useState<SessionStatus>('Initial');
    let [manualStart, setManualStart] = useState<Dayjs | undefined>(undefined);
    let [manualEnd, setManualEnd] = useState<Dayjs | undefined>(undefined);
    let [manualAddColor, setManualAddColor] = useState<ManualButtonColor>('red');
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
    useEffect(() => {
        console.log(`manualStart: ${manualStart}, manualEnd: ${manualEnd}`);
        if (manualStart && manualEnd && manualEnd.isAfter(manualStart))
            setManualAddColor('green');
        else
            setManualAddColor('red');
    }, [manualStart, manualEnd]);

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
            load()
        } catch (e) {
            let textException = JSON.stringify(e)
            toast({title: `Error añadiendo la session : ${textException}`, variant: "destructive"});
        } finally {
            setSessionStatus('Initial');
        }
    }

    if (!groupId) {
        return <div>Group ID is missing in the URL parameters.</div>;
    }

    function setTime(time: string, setter: (utc: Dayjs) => void) {
        let hour = time.split(':')[0];
        let minute = time.split(':')[1];
        let now = dayjs().hour(parseInt(hour)).minute(parseInt(minute));
        setter(now)
    }

    async function handleCreateManualSession() {
        if (!manualStart || !manualEnd || manualEnd.isBefore(manualStart)) {
            toast({title: "Invalid time range", variant: "destructive"});
            return;
        }
        try {
            await post('session/add', {start: manualStart, end: manualEnd, group: group?.id, note: sessionNote ?? ''});
            toast({title: "Session añadida", variant: "default"});
            load()
        } catch (e) {
            let textException = JSON.stringify(e)
            toast({title: `Error añadiendo la session : ${textException}`, variant: "destructive"});
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white flex items-center justify-center">
            <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-4xl">
                <div className="flex flex-col justify-center items-center w-full">
                    <div className="flex items-center gap-4">
                        <p className="font-semibold font-serif text-5xl text-gray-800">{group?.name}</p>
                        <Link className="pt-3" href={`/sessions?group=${group?.name}`}>
                            <Table/>
                        </Link>
                    </div>
                    <p className="self-center text-justify m-8 text-gray-600">{group?.description}</p>
                    {sessionStatus === 'Initial' ? <Button onClick={() => handleCreateSession()}>Create Session</Button>
                        : <div className="flex flex-col">
                            <div className="flex gap-4 mb-5">
                                <h1 className="text-xl text-red-500">Session in progress</h1>
                                <Button onClick={() => handleStopSession()}>Stop</Button>
                            </div>
                            <Textarea value={sessionNote} onChange={e => setSessionNote(e.target.value)}/>
                        </div>}
                    <div className="self-start m-10 flex flex-row gap-5 items-center w-fit">
                        <input type="time" onChange={e => setTime(e.target.value, setManualStart)}/>
                        <Separator orientation="horizontal"/>
                        <input type="time" onChange={e => setTime(e.target.value, setManualEnd)}/>
                        <Button disabled={manualAddColor === 'red'} onClick={handleCreateManualSession}>
                            <Aperture color={manualAddColor}/>
                        </Button>
                    </div>
                    <div className="flex gap-5 mt-2 items-center self-start ml-8">
                        <h1 className="text-xl pt-1">{"Horas de sesion durante el periodo : "}</h1>
                        <DatePickerWithRange dateRange={dateRange} setDateRange={setDateRange}/>
                        <h1 className="text-xl pt-1">{durationForPeriod ? formatDurationFromH(durationForPeriod!) : ''}</h1>
                    </div>

                </div>
            </div>
        </div>
    );
}
