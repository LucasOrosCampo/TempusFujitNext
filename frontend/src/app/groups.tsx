"use client";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import {DataTable} from "@/components/ui/datatable";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useToast} from "@/hooks/use-toast";
import {get, post} from "@/utils/api";
import {ColumnDef} from "@tanstack/react-table";
import {CirclePlus, Delete, Download} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState, useEffect, useMemo, SyntheticEvent} from "react";
import {Trash} from "lucide-react";
import {Group, GroupRequest, GroupsExport} from "./models/group";
import {createExport, downloadWorkbook} from "@/utils/exporter";

export default function GroupsPage() {
    let [groups, setGroups] = useState<Group[]>([]);
    let [name, setName] = useState<string | undefined>(undefined);
    let [description, setDescription] = useState<string | undefined>(undefined);


    let router = useRouter();

    let shouldDisplayAdd = useMemo<boolean>(() => {
        return !groups.some((x) => x.name === name);
    }, [name, groups]);
    let {toast} = useToast();

    let load = async () => {
        setGroups(await get("group"));
    };
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
        {
            header: "actions",
            cell: (x) => (<DeleteGroupConfirmationPopup group={x.row.original} load={load}/>)
        },
    ];

    let handleAdd = async () => {
        if (!name || groups.some((x) => x.name === name)) {
            toast({title: "Cannot add", variant: "destructive"});
            return;
        }
        await post<GroupRequest>("group/create", {
            name: name,
            description: description ?? null,
        });
        toast({title: "Group created", variant: "default"});
        load();
    };

    let handleExport = async () => {
        let groupsExport = await get<GroupsExport>('group/export', () => {
            toast({title: "Export Loading Error", variant: 'destructive'})
        })
        console.log(groupsExport)
        try {
            await downloadWorkbook(createExport(groupsExport))
        } catch {
            toast({title: "Export Error", variant: 'destructive'})
        }
    }

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
            <div className="flex self-end m-4">
                <Button onClick={() => handleExport()}>
                    <Download/>
                </Button>
            </div>
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
                        <CirclePlus/>
                    </Button>
                )}
            </div>
            <div className="w-10/12">
                <DataTable
                    columns={columns}
                    data={groups.filter(shouldIncludeGroup)}
                    onRowClick={(group) => router.push(`group?groupId=${group.id}`)}
                />
            </div>
        </div>
    );
}

type DeleteGroupConfirmationPopupProp = {
    group: Group,
    load: () => void,
}

export function DeleteGroupConfirmationPopup({group, load}: DeleteGroupConfirmationPopupProp) {

    let {toast} = useToast();

    async function confirm() {
        await post<{}>(`group/delete/${group.id}`, {})
        load()
        toast({title: "Group deleted", variant: "default"});
    }

    return (
        <div onClick={e => e.stopPropagation()}>
            <Dialog>
                <DialogTrigger><Trash/></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{`Deseas borrar permanentemente el grupo ${group.name} ?`}</DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose onClick={confirm}>
                            Confirmar
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}