import {
  Briefcase,
  CircleUserRound,
  Crown,
  DoorOpen,
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
import { useAuth } from "~/state/auth-context";

type SidebarItem = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  onClick?: () => void;
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

function SidebarNavItem({
  label,
  icon: Icon,
  active = false,
  onClick,
}: SidebarItem) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="group flex w-full flex-col items-center justify-center leading-2.5 transition-colors"
    >
      <span
        className={cn(
          "rounded-full px-4 py-1",
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
          "max-w-15 truncate leading-4 font-normal",
          active ? "text-primary" : "text-foreground",
          "navbar-text align-top leading-6",
        )}
      >
        {label}
      </span>
    </button>
  );
}

type SidebarProps = {
  onSignInClick?: () => void;
};

export function Sidebar({ onSignInClick }: SidebarProps) {
  const {
    state: { currentUser },
    logout,
  } = useAuth();
  const userDisplayName = currentUser?.name?.trim() || currentUser?.email;

  return (
    <aside className="bg-soft-background fixed inset-y-0 left-0 z-100 hidden w-17 flex-col items-center py-4 md:flex">
      <nav className="flex w-full flex-1 flex-col items-center overflow-x-hidden overflow-y-auto">
        {primaryItems.map((item) => (
          <SidebarNavItem
            key={item.label}
            {...item}
            active={item.label === "Home"}
          />
        ))}
      </nav>

      <div className="flex w-full flex-col items-center gap-2">
        {currentUser ? (
          <div className="flex w-full flex-col items-center gap-0.5">
            <span className="bg-primary text-background flex size-9 items-center justify-center rounded-full">
              <CircleUserRound
                aria-hidden="true"
                className="size-5"
                strokeWidth={1.8}
              />
            </span>
            {userDisplayName && (
              <span className="text-tiny text-foreground max-w-16 truncate text-center font-medium">
                {userDisplayName}
              </span>
            )}
            <button
              type="button"
              onClick={logout}
              className="text-tiny text-foreground hover:text-primary max-w-16 cursor-pointer truncate text-center transition-colors"
            >
              <span className="flex size-9 items-center justify-center rounded-full">
                <DoorOpen />
              </span>
              <span>Sign out</span>
            </button>
          </div>
        ) : (
          <SidebarNavItem
            label="Sign in"
            icon={LogIn}
            onClick={onSignInClick}
          />
        )}
        <button
          type="button"
          className="hover:bg-muted-surface flex w-full flex-col items-center justify-center gap-0.5 leading-3 transition-colors"
        >
          <span className="bg-primary flex size-9 items-center justify-center rounded-full">
            <Crown
              aria-hidden="true"
              className="text-background size-4.5"
              strokeWidth={2}
            />
          </span>
          <span className="text-tiny">Upgrade</span>
        </button>
      </div>
    </aside>
  );
}
