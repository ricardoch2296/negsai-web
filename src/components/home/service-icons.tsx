import {
  BarChart3,
  Brain,
  Cloud,
  Code2,
  Database,
  Headphones,
  Plug,
  Rocket,
  Workflow,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  code: Code2,
  workflow: Workflow,
  plug: Plug,
  brain: Brain,
  chart: BarChart3,
  cloud: Cloud,
  rocket: Rocket,
  headphones: Headphones,
  database: Database,
};

export function ServiceIcon({ name }: { name: string }) {
  const Icon = map[name] ?? Code2;
  return <Icon className="h-7 w-7 text-teal-light" aria-hidden />;
}
