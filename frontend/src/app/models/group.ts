import { ExportedSession, Session } from "./session";

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
};
