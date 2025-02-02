import {GroupExport, GroupsExport} from "@/app/group/_models";
import {ExportedSession} from "@/app/sessions/_models";
import dayjs from "dayjs";
import {Workbook, Worksheet} from "exceljs";
import {saveAs} from "file-saver";
import {formatDurationFromH} from "@/utils/helpers";

require('dayjs/locale/es');

export function createExport(content: GroupsExport): Workbook {
    let exportWorkbook = new Workbook();
    content.groupExports.forEach((x) => createGroupSheet(x, exportWorkbook));
    return exportWorkbook;
}

function createGroupSheet(groupExport: GroupExport, workbook: Workbook): void {
    let hasYearlyModeStructure = !!groupExport.yearlySummary
    let groupSheet = workbook.addWorksheet(remove_invalid_chars(groupExport.groupName));
    if (hasYearlyModeStructure) {
        fillYearlyModeSheet(groupSheet, groupExport);
    } else {
        fillExhaustiveSheet(groupSheet, groupExport);
    }
}

function fillExhaustiveSheet(groupSheet: Worksheet, groupExport: GroupExport): void {
    if (groupExport.sessions.length > 0) {
        createExhaustiveHeaders(groupSheet, groupExport);
        groupExport.sessions.forEach(x => createExhaustiveRow(groupSheet, x));
    }
}

function createExhaustiveHeaders(ws: Worksheet, data: GroupExport): void {
    let row = ws.addRow(Object.keys(data.sessions[0]).map(key => exhaustiveHeaderMappings[key as keyof ExportedSession])
        .filter(x => x !== undefined));
    ws.getColumn(1).numFmt = "dd/mm/yy hh:mm";
    ws.getColumn(1).width = 20;
    ws.getColumn(2).numFmt = "dd/mm/yy hh:mm";
    ws.getColumn(2).width = 20;
}

const exhaustiveHeaderMappings: { [key in keyof ExportedSession]: string } = {
    start: "Comienzo",
    end: "Final",
    duration: "Duracion",
    note: "Nota"
};

function createExhaustiveRow(ws: Worksheet, session: ExportedSession) {
    let startDate = dayjs(session.start)?.toDate();
    let endDate = session.end ? dayjs(session.end)?.toDate() : "";
    let duracion = formatDurationFromH(session.duration);
    ws?.addRow([startDate, endDate, duracion, session.note]);
}

function fillYearlyModeSheet(groupSheet: any, groupExport: GroupExport) {
    createYearlyHeaders(groupSheet, groupExport);
    if (!groupExport.yearlySummary)
        return
    Object.entries(groupExport.yearlySummary?.hoursByMonth).forEach(x => createYearlyRow(groupSheet, x));
}

function createYearlyHeaders(ws: Worksheet, data: GroupExport): void {
    let year = data.yearlySummary!.year;
    ws.addRow([`Resumen del año:`, year]);
    ws.addRow(["Mes", "Horas"]);
}

function createYearlyRow(groupSheet: any, monthHours: [string, number]) {
    let [monthStr, hours] = monthHours;
    let month = dayjs().locale('es').month(parseInt(monthStr) - 1).format("MMMM");
    groupSheet.addRow([month, hours]);
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
