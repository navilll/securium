import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  Check,
  CircleHelp,
  Clock3,
  Globe,
  GraduationCap,
  Menu,
  Search,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

const icons = {
  search: Search,
  book: BookOpen,
  users: UsersRound,
  clock: Clock3,
  check: Check,
  arrow: ArrowRight,
  menu: Menu,
  close: X,
  level: ChartNoAxesColumnIncreasing,
  globe: Globe,
  user: UserRound,
  cal: CalendarDays,
  badge: BadgeCheck,
  cap: GraduationCap,
};

export function Icon({ name, size = 16 }) {
  const LucideIcon = icons[name] || CircleHelp;

  return <LucideIcon size={size} strokeWidth={1.8} aria-hidden="true" />;
}
