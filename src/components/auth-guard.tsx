import { use, Suspense } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";
import { authApi } from "@/api/auth.api";
import type { User } from "@/types/auth";
import { LoadingSpinner } from "./loading-spinner";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

function createUserFetchPromise() {
  const stored = JSON.parse(localStorage.getItem("auth-storage") || "{}");
  if (!stored?.state?.token) return null;

  return authApi.getCurrentUser().then((res) => {
    useAuthStore.getState().updateUser(res.data);
  });
}

const userFetchPromise = createUserFetchPromise();

function AuthGuardInner({ children, requireAuth = true }: AuthGuardProps) {
  const { isAuthenticated, token, updateUser } = useAuthStore();
  const location = useLocation();

  if (userFetchPromise) use(userFetchPromise);

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AuthGuardInner requireAuth={requireAuth}>{children}</AuthGuardInner>
    </Suspense>
  );
}
