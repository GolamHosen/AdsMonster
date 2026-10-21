import {
  Search,
  Camera,
  Clapperboard,
  Music2,
  Users,
  LayoutTemplate,
  Briefcase,
  Smile,
  Award,
  TrendingUp,
  Megaphone,
  Target,
  BarChart3,
  Rocket,
  Globe,
  Sparkles,
  MailCheck,
  LineChart,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Search,
  Instagram: Camera,
  Youtube: Clapperboard,
  Music2,
  Linkedin: Users,
  LayoutTemplate,
  Briefcase,
  Smile,
  Award,
  TrendingUp,
  Megaphone,
  Target,
  BarChart3,
  Rocket,
  Globe,
  Sparkles,
  MailCheck,
  LineChart,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Sparkles;
}

export const availableIconNames = Object.keys(iconMap);
