import {Dayjs} from "dayjs";

export type Session = {
    id: number;
    groupId: number;
    start: Dayjs | null;
    end: Dayjs | null;
    note: string;
};

export type ExportedSession = {
    start: Dayjs | null;
    end: Dayjs | null;
    duration: number;
    note: string;
};
