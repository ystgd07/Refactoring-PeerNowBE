export interface ProjectWithMembers {
  no: number;
  title?: string;
  detail?: string;
  start_date?: Date | null;
  end_date?: Date | null;
  reg_date: Date;
  mod_date: Date;
  user_id: string | null;
  role: string | null;
  members: {
    user_id: string;
    name: string;
    mail: string;
    team: string;
    grade: string;
    role: string;
  }[];
}
