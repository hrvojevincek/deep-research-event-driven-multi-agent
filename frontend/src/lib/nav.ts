import {
  Home,
  PlusCircle,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const mainNav: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/queries/new", label: "New query", icon: PlusCircle },
];

export const secondaryNav: NavItem[] = [
  { href: "/queries/demo", label: "Sample job", icon: Workflow },
];
