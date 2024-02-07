type Workspace = {
  id: string;
  name: string;
  plan: "free" | "pro";
  team_id?: string;
};

export default Workspace;
