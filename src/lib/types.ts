export type Team = {
  id: string;
  designation: string;
  commanding_officer: string | null;
  status: string;
};

export type Personnel = {
  id: string;
  prefix: string | null;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  suffix: string | null;
  rank: string | null;
  role: string;
  team_id: string | null;
  teams: { designation: string } | null;
  personnel_type: string;
  status: string;
};