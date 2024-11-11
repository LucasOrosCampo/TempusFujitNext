"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/datatable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import { CirclePlus } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

type Group = {
  id: number;
  name: string;
  description: string | null;
};

export default function GroupsPage() {
  let [groups, setGroups] = useState<Group[]>([]);
  let [name, setName] = useState<string | undefined>(undefined);
  let [description, setDescription] = useState<string | undefined>(undefined);

  let shouldDisplayAdd = useMemo<boolean>(() => {
    return !groups.some((x) => x.name === name);
  }, [name, groups]);
  let { toast } = useToast();

  let load = async () => {};
  useEffect(() => {
    load();
  }, []);
  let columns: ColumnDef<Group>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
  ];

  let handleAdd = () => {
    if (!name || groups.some((x) => x.name === name)) {
      toast({ title: "Cannot add", variant: "destructive" });
      return;
    }
    let lastid = Math.floor(100 * Math.random());
    setGroups([
      ...groups,
      { id: lastid, name: name, description: description ?? null },
    ]);
  };

  let shouldIncludeGroup = (group: Group): boolean => {
    return (
      (!name || group.name.toLowerCase().includes(name.toLowerCase())) &&
      ((!description ||
        group.description?.toLowerCase().includes(description.toLowerCase())) ??
        false)
    );
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex gap-8 my-6">
        <div className="grid w-full max-w-sm items-center">
          <Label className="px-3" htmlFor="nameSearch">
            Name
          </Label>
          <Input
            id="nameSearch"
            className="max-w-sm m-3"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid w-full max-w-sm items-center">
          <Label className="px-3" htmlFor="descriptionSearch">
            Description
          </Label>
          <Input
            id="descriptionSearch"
            className="max-w-sm m-3"
            placeholder="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {shouldDisplayAdd && (
          <Button
            className="mt-7"
            variant="outline"
            size="sm"
            onClick={handleAdd}
          >
            <CirclePlus />
          </Button>
        )}
      </div>
      <div className="w-10/12">
        <DataTable columns={columns} data={groups.filter(shouldIncludeGroup)} />
      </div>
    </div>
  );
}
