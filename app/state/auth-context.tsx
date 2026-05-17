import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import {
  AUTH_TOKEN_CHANGED_EVENT,
  clearAccessToken,
  getAccessToken,
} from "~/lib/auth-token";
import { authService, type AuthUser } from "~/services/auth.service";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

type AuthState = {
  currentUser: AuthUser | null;
  status: AuthStatus;
  error: string | null;
};

type AuthAction =
  | { type: "AUTH_LOADING" }
  | { type: "AUTH_SUCCESS"; user: AuthUser }
  | { type: "AUTH_LOGOUT" }
  | { type: "AUTH_ERROR"; error: string };

const initialState: AuthState = {
  currentUser: null,
  status: "idle",
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_LOADING":
      return {
        ...state,
        status: "loading",
        error: null,
      };
    case "AUTH_SUCCESS":
      return {
        currentUser: action.user,
        status: "authenticated",
        error: null,
      };
    case "AUTH_LOGOUT":
      return {
        currentUser: null,
        status: "unauthenticated",
        error: null,
      };
    case "AUTH_ERROR":
      return {
        currentUser: null,
        status: "unauthenticated",
        error: action.error,
      };
    default:
      return state;
  }
}

type AuthContextValue = {
  state: AuthState;
  refreshCurrentUser: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const refreshCurrentUser = async () => {
    if (!getAccessToken()) {
      dispatch({ type: "AUTH_LOGOUT" });
      return;
    }

    try {
      dispatch({ type: "AUTH_LOADING" });
      const user = await authService.me();
      dispatch({ type: "AUTH_SUCCESS", user });
    } catch (error) {
      clearAccessToken();
      dispatch({
        type: "AUTH_ERROR",
        error:
          error instanceof Error ? error.message : "Authentication failed",
      });
    }
  };

  const logout = () => {
    clearAccessToken();
    dispatch({ type: "AUTH_LOGOUT" });
  };

  useEffect(() => {
    void refreshCurrentUser();

    const handleTokenChange = () => {
      void refreshCurrentUser();
    };

    window.addEventListener(AUTH_TOKEN_CHANGED_EVENT, handleTokenChange);
    window.addEventListener("storage", handleTokenChange);

    return () => {
      window.removeEventListener(AUTH_TOKEN_CHANGED_EVENT, handleTokenChange);
      window.removeEventListener("storage", handleTokenChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ state, refreshCurrentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
