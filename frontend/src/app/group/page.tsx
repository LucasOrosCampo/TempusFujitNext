"use client";
import { Button } from "@/components/ui/button";
import { TimePeriodPicker } from "@/components/ui/timePeriodPicker";
import { useTimePeriod } from "@/hooks/use-time-period";
import { get } from "@/utils/api";
import { Table } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const GroupPage = () => {
  let router = useRouter();

  let timePeriod = useTimePeriod();

  let groupName = useSearchParams().get("groupName");

  let [group, setGroup] = useState<Group | undefined>(undefined);
  useEffect(() => {
    load();
  }, []);

  async function load() {
    let group = await get<Group>(`group/${groupName}`);
    setGroup(group);
  }

  function handleCreateSession() {
    console.log("hello");
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
      <Button onClick={() => handleCreateSession()}>Create Session</Button>
      <TimePeriodPicker timePeriod={timePeriod.timePeriod} />
    </div>
  );
};

export default GroupPage;
