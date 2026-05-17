import { useEffect, useState } from "react";
import {
  Briefcase,
  CircleUserRound,
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
import {
  AUTH_TOKEN_CHANGED_EVENT,
  clearAccessToken,
  getAccessToken,
} from "../lib/auth-token";
import { cn } from "../lib/utils";
import { authService, type AuthUser } from "../services/auth.service";

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
          "navbar-text leading-6 align-top",
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
  const [isSignedIn, setIsSignedIn] = useState(() => Boolean(getAccessToken()));
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const syncAuthState = () => {
      const hasToken = Boolean(getAccessToken());

      setIsSignedIn(hasToken);

      if (!hasToken) {
        setCurrentUser(null);
      }
    };

    window.addEventListener(AUTH_TOKEN_CHANGED_EVENT, syncAuthState);
    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener(AUTH_TOKEN_CHANGED_EVENT, syncAuthState);
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

  useEffect(() => {
    if (!isSignedIn) {
      setCurrentUser(null);
      return;
    }

    let ignore = false;

    authService
      .me()
      .then((user) => {
        if (!ignore) {
          setCurrentUser(user);
        }
      })
      .catch(() => {
        if (!ignore) {
          clearAccessToken();
          setIsSignedIn(false);
          setCurrentUser(null);
        }
      });

    return () => {
      ignore = true;
    };
  }, [isSignedIn]);

  const handleLogout = () => {
    clearAccessToken();
    setCurrentUser(null);
  };

  const userDisplayName = currentUser?.name?.trim() || currentUser?.email;

  return (
    <aside className="fixed inset-y-0 left-0 z-100 hidden w-17 flex-col items-center bg-soft-background py-4 md:flex">
      <nav className="flex w-full flex-1 flex-col items-center overflow-y-auto overflow-x-hidden">
        {primaryItems.map((item) => (
          <SidebarNavItem
            key={item.label}
            {...item}
            active={item.label === "Home"}
          />
        ))}
      </nav>

      <div className="flex w-full flex-col items-center gap-2">
        {isSignedIn ? (
          <div className="flex w-full flex-col items-center gap-1.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-background">
              <CircleUserRound
                aria-hidden="true"
                className="size-5"
                strokeWidth={1.8}
              />
            </span>
            {userDisplayName && (
              <span className="max-w-16 truncate text-center text-tiny font-medium text-foreground">
                {userDisplayName}
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="max-w-16 truncate text-center text-tiny text-foreground transition-colors hover:text-primary"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <SidebarNavItem label="Sign in" icon={LogIn} onClick={onSignInClick} />
        )}
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
