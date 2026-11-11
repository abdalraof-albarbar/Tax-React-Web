export type Inspector = { id: string; name: string; email: string; phone: string; region: string; active: boolean };
export type Company = {
  id: string;
  name: string;
  tax: string;
  region: string;
  address: string;
  activity: string;
  status: string;
  risk: string;
  lat: number;
  lng: number;
};
export type Task = { id: string; companyId: string; inspectorId: string; date: string; priority: string; status: string; notes: string };
export type Report = {
  id: string;
  taskId: string;
  violation: string;
  date: string;
  notes: string;
  status: string;
  feedback: string;
  evidence: string[];
  history: string[];
};
export type Store = { inspectors: Inspector[]; companies: Company[]; tasks: Task[]; reports: Report[] };
export type Page = "dashboard" | "inspectors" | "companies" | "tasks" | "reports" | "map" | "statistics";
