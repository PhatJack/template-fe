import {
  Briefcase,
  Crown,
  FileText,
  Home,
  Image,
  LayoutTemplate,
  LogIn,
  MoreHorizontal,
  Palette,
  Presentation,
  Sparkles,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";

type SidebarItem = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
};

const primaryItems: SidebarItem[] = [
  { label: "Home", icon: Home },
  { label: "Document", icon: FileText },
  { label: "Design", icon: Palette },
  { label: "Presentation", icon: Presentation },
  { label: "Image", icon: Image },
  { label: "Video", icon: Video },
  { label: "More", icon: MoreHorizontal },
  { label: "Templates", icon: LayoutTemplate },
  { label: "Brand", icon: Sparkles },
  { label: "Projects", icon: Briefcase },
];

function SidebarNavItem({ label, icon: Icon, active = false }: SidebarItem) {
  return (
    <button
      type="button"
      aria-label={label}
      className={
        "group flex w-full flex-col items-center justify-center leading-2.5 transition-colors"
      }
    >
      <span
        className={cn(
          "py-1 px-4 rounded-full",
          active
            ? "bg-btn-primary-hover"
            : "group-hover:bg-btn-primary-hover cursor-pointer",
        )}
      >
        <Icon
          aria-hidden="true"
          strokeWidth={1.8}
          className={cn(
            "size-4.5 transition-colors",
            active
              ? "text-primary"
              : "text-foreground group-hover:text-foreground",
          )}
        />
      </span>
      <span
        className={cn(
          "max-w-15 font-normal truncate leading-4",
          active ? "text-primary" : "text-foreground",
          "navbar-text",
        )}
      >
        {label}
      </span>
    </button>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-17 flex-col items-center bg-soft-background py-4 md:flex">
      <nav className="flex w-full flex-1 flex-col items-center gap-2 overflow-y-auto overflow-x-hidden">
        {primaryItems.map((item) => (
          <SidebarNavItem
            key={item.label}
            {...item}
            active={item.label === "Home"}
          />
        ))}
      </nav>

      <div className="flex w-full flex-col items-center gap-2">
        <SidebarNavItem label="Sign in" icon={LogIn} />
        <button
          type="button"
          className="flex w-full flex-col items-center justify-center gap-0.5 leading-3 text-primary transition-colors hover:bg-muted-surface"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-primary">
            <Crown
              aria-hidden="true"
              className="size-4.5 text-background"
              strokeWidth={2}
            />
          </span>
          <span className="text-tiny">Upgrade</span>
        </button>
      </div>
    </aside>
  );
}
