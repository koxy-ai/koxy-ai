interface Deployment {
  name: string;
  id: string;
  projectId: string;
  description?: string | null;
  status: "failed" | "pending" | "success";
  domains: Array<string>;
  databases: any;
  createdAt: string;
  updatedAt: string;
}

export default Deployment;
