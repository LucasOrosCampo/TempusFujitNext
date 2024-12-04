import { GroupExport, GroupsExport } from "@/app/models/group";
import { ExportedSession } from "@/app/models/session";
import dayjs from "dayjs";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";

export function createExport(content: GroupsExport): Workbook {
  let exportWorkbook = new Workbook();
  content.groupExports.forEach((x) => createGroupSheet(x, exportWorkbook));
  return exportWorkbook;
}
function createGroupSheet(groupExport: GroupExport, workbook: Workbook): void {
  let groupSheet = workbook.addWorksheet(groupExport.groupName);
  if (groupExport.sessions.length > 0) {
    groupSheet.columns = Object.keys(groupExport.sessions[0]).flatMap((x) =>
      x === getTrad(x)
        ? []
        : [
            {
              header: getTrad(x),
              key: getTrad(x),
              width: 15,
            },
          ]
    );
    groupExport.sessions.forEach(createRow);
  }
  function createRow(x: ExportedSession) {
    let startStr = dayjs(x.start)?.format("DD/MM/YY HH:mm");
    let endStr = x.end ? dayjs(x.end)?.format("DD/MM/YY HH:mm") : "";
    let row = [startStr, endStr];
    groupSheet.addRow(row);
  }
}

function getTrad(value: string): string {
  switch (value) {
    case "start":
      return "Comienzo";
    case "end":
      return "Final";
    default:
      return value;
  }
}

export async function downloadWorkbook(workbook: Workbook) {
  let buffer = await workbook.xlsx.writeBuffer();
  let blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, "TempusFujitExport.xlsx");
}
