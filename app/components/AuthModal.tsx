import { useEffect, useState, type SubmitEvent } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail, UserRound, X } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";
import { setAccessToken } from "~/lib/auth-token";
import { authService } from "~/services";
import { useAuth } from "~/state/auth-context";

type AuthMode = "signin" | "signup";

type AuthModalProps = {
  open: boolean;
  initialMode?: AuthMode;
  onClose: () => void;
};

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const defaultForm: FormState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function AuthModal({
  open,
  initialMode = "signin",
  onClose,
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshCurrentUser } = useAuth();

  useHotkeys(
    "escape",
    () => {
      onClose();
    },
    {
      enabled: open,
    },
    [onClose, open],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    setMode(initialMode);
    setForm(
      initialMode === "signin"
        ? { ...defaultForm, email: "user2@gmail.com", password: "phatdinh" }
        : defaultForm,
    );
    setError(null);
    setLoading(false);
    setShowPassword(false);
  }, [initialMode, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleFieldChange = (field: keyof FormState, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setError(null);
  };

  const isSignUp = mode === "signup";
  const title = isSignUp ? "Create your free account" : "Sign in for free";
  const submitLabel = isSignUp ? "Create account" : "Continue with email";

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = form.email.trim();
    const trimmedName = form.name.trim();

    if (isSignUp && !trimmedName) {
      setError("Please enter your name.");
      return;
    }

    if (!trimmedEmail || !form.password) {
      setError("Email and password are required.");
      return;
    }

    if (isSignUp && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const authResponse = isSignUp
        ? await authService.register({
            name: trimmedName,
            email: trimmedEmail,
            password: form.password,
          })
        : await authService.login({
            email: trimmedEmail,
            password: form.password,
          });

      setAccessToken(authResponse.accessToken);
      await refreshCurrentUser();

      onClose();
    } catch (authError) {
      setError(
        authError instanceof Error
          ? authError.message
          : "Authentication failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-foreground/55 fixed inset-0 z-999 flex items-center justify-center px-4 py-6 backdrop-blur-[2px]"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="border-border-light bg-background text-foreground relative w-full max-w-md rounded-3xl border px-5 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)] sm:px-7"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close authentication modal"
          onClick={onClose}
          className="text-muted hover:bg-muted-surface hover:text-foreground absolute top-4 right-4 inline-flex size-9 items-center justify-center rounded-full transition-colors"
        >
          <X className="size-5" />
        </button>

        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-12 items-center justify-center">
            <img src="/favicon.svg" className="size-full" />
          </div>

          <div className="space-y-1">
            <h2
              id="auth-modal-title"
              className="text-foreground text-2xl font-semibold tracking-tight"
            >
              {title}
            </h2>
          </div>
        </div>

        <form className="mt-6 space-y-4 text-left" onSubmit={handleSubmit}>
          {isSignUp && (
            <label className="block space-y-2">
              <span className="text-foreground flex items-center gap-2 text-sm font-medium">
                <UserRound className="text-primary size-4" />
                Name <span className="text-error">*</span>
              </span>
              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  handleFieldChange("name", event.target.value)
                }
                placeholder="Your name"
                className="border-border bg-background text-foreground placeholder:text-muted focus:border-primary focus:ring-primary/10 h-12 w-full rounded-xl border px-4 text-sm transition-colors outline-none focus:ring-2"
              />
            </label>
          )}

          <label className="block space-y-2">
            <span className="text-foreground flex items-center gap-2 text-sm font-medium">
              <Mail className="text-primary size-4" />
              Email <span className="text-error">*</span>
            </span>
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                handleFieldChange("email", event.target.value)
              }
              placeholder="Enter your email"
              className="border-border bg-background text-foreground placeholder:text-muted focus:border-primary focus:ring-primary/10 h-12 w-full rounded-xl border px-4 text-sm transition-colors outline-none focus:ring-2"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-foreground flex items-center gap-2 text-sm font-medium">
              <Lock className="text-primary size-4" />
              Password <span className="text-error">*</span>
            </span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(event) =>
                  handleFieldChange("password", event.target.value)
                }
                placeholder="Your password"
                className="border-border bg-background text-foreground placeholder:text-muted focus:border-primary focus:ring-primary/10 h-12 w-full rounded-xl border px-4 pr-12 text-sm transition-colors outline-none focus:ring-2"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((value) => !value)}
                className="text-muted hover:text-foreground absolute inset-y-0 right-2 inline-flex items-center justify-center rounded-full px-2 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </label>

          {isSignUp && (
            <label className="block space-y-2">
              <span className="text-foreground flex items-center gap-2 text-sm font-medium">
                <Lock className="text-primary size-4" />
                Confirm password <span className="text-error">*</span>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(event) =>
                  handleFieldChange("confirmPassword", event.target.value)
                }
                placeholder="Confirm your password"
                className="border-border bg-background text-foreground placeholder:text-muted focus:border-primary focus:ring-primary/10 h-12 w-full rounded-xl border px-4 text-sm transition-colors outline-none focus:ring-2"
              />
            </label>
          )}

          {!isSignUp && (
            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="text-muted flex items-center gap-2">
                <input
                  type="checkbox"
                  className="border-border text-primary focus:ring-primary size-4 rounded"
                />
                Remember for 30 days
              </label>
            </div>
          )}

          {error && (
            <p className="border-error-border bg-error-surface text-error rounded-xl border px-4 py-3 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-background hover:bg-primary-hover active:bg-primary-active disabled:bg-accent disabled:text-muted flex h-12 w-full items-center justify-center rounded-xl px-6 text-sm font-semibold transition-all disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              submitLabel
            )}
          </button>

          {isSignUp ? (
            <>
              <p className="text-muted text-center text-xs leading-5">
                By signing up, you agree to Template.net&apos;s Terms of Service
                & Privacy Policy.
              </p>
              <p className="text-muted text-center text-xs leading-5">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-primary hover:text-primary-hover cursor-pointer font-medium transition-colors hover:underline hover:underline-offset-2"
                >
                  Sign In
                </button>
              </p>
            </>
          ) : (
            <>
              <p className="text-muted text-center text-xs leading-5">
                By continuing, you agree to Template.net&apos;s Terms of use and
                Privacy Policy.
              </p>
              <p className="text-muted text-center text-xs leading-5">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-primary hover:text-primary-hover cursor-pointer font-medium transition-colors hover:underline hover:underline-offset-2"
                >
                  Sign Up
                </button>
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
