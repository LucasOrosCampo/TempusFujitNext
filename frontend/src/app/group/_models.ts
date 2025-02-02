import {ExportedSession, Session} from '../sessions/_models';

export type GroupRequest = {
    name: string;
    description: string | null;
};

export type Group = { id: number } & GroupRequest;

export type GroupsExport = {
    groupExports: GroupExport[];
};

export type GroupExport = {
    groupName: string;
    sessions: ExportedSession[];
    yearlySummary: YearlySummary | null;
};

export type YearlySummary = {
    year: number;
    hoursByMonth: { [key: number]: number };
};
