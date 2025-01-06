import {GroupExport, GroupsExport} from "@/app/models/group";
import {ExportedSession} from "@/app/models/session";
import dayjs from "dayjs";
import {Workbook, Worksheet, Cell} from "exceljs";
import {saveAs} from "file-saver";
import {formatDurationFromH} from "@/utils/helpers";

export function createExport(content: GroupsExport): Workbook {
    let exportWorkbook = new Workbook();
    content.groupExports.forEach((x) => createGroupSheet(x, exportWorkbook));
    return exportWorkbook;
}

function createGroupSheet(groupExport: GroupExport, workbook: Workbook): void {
    let groupSheet = workbook.addWorksheet(remove_invalid_chars(groupExport.groupName));
    fillSheet(groupSheet, groupExport);
}

function fillSheet(groupSheet: Worksheet, groupExport: GroupExport): void {
    if (groupExport.sessions.length > 0) {
        createHeader(groupSheet, groupExport);
        groupExport.sessions.forEach(x => createRow(groupSheet, x));
    }
}


function createHeader(ws: Worksheet, data: GroupExport): void {
    let row = ws.addRow(Object.keys(data.sessions[0]).map(key => getHeader(key)).filter(x => x !== undefined));
    ws.getColumn(1).numFmt = "dd/mm/yy hh:mm";
    ws.getColumn(1).width = 20;
    ws.getColumn(2).numFmt = "dd/mm/yy hh:mm";
    ws.getColumn(2).width = 20;
}

function getHeader(value: string): string | undefined {
    return value === "start" ? "Comienzo" : value === "end" ? "Final" : value === "duration" ? "Duracion" : undefined;
}

function createRow(ws: Worksheet, session: ExportedSession) {
    let startDate = dayjs(session.start)?.toDate();
    let endDate = session.end ? dayjs(session.end)?.toDate() : "";
    let duracion = formatDurationFromH(session.duration);
    let row = ws?.addRow([startDate, endDate, duracion]);
}


function remove_invalid_chars(input: string): string {
    const invalidCharacterMatching = /[\*\?\:\\\/\[\]]/g;
    return input.replace(invalidCharacterMatching, " ");
}

export async function downloadWorkbook(workbook: Workbook) {
    let buffer = await workbook.xlsx.writeBuffer();
    let blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    let day = dayjs().format("MMDDhhmm");
    saveAs(blob, `TempusFujit_${day}.xlsx`);
}
