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

export default function SessionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SessionsPageContent />
    </Suspense>
  );
}

function SessionsPageContent() {
  let [sessions, setSessions] = useState<Session[]>([]);

  let group = useSearchParams().get("group");
  let load = async () => {
    setSessions(await get(`session?=${group}`));
  };
  useEffect(() => {
    load();
  }, []);
  let columns: ColumnDef<Session>[] = [
    {
      accessorKey: "start",
      header: "Comienzo",
    },
    {
      accessorKey: "end",
      header: "Final",
    },
  ];
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <div className="rounded-xl p-5 m-5 flex items-center justify-center h-32 bg-gradient-to-r from-purple-700 via-pink-700 to-red-700 shadow-lg">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-wide">
          {"sessions de " + group}
        </h1>
      </div>
      <div className="w-10/12">
        <DataTable columns={columns} data={sessions} />
      </div>
    </div>
  );
}
