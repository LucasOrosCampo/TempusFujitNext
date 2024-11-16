
type GroupRequest = {
  name: string;
  description: string | null;
};

type Group = { id : number } & GroupRequest