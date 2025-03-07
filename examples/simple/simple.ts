export interface User {
  id: number;
  name: string;
  status?: Status;
}
export type Status = "active" | "inactive";

export type UserList = {
  users: User[];
};
