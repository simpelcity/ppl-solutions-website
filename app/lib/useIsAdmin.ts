import { useEffect, useState } from "react";
import { useAuth } from "@/lib";

export function useIsAdmin() {
  const { session } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!session?.access_token) return;

    const payload = JSON.parse(atob(session.access_token.split(".")[1]));
    setIsAdmin(payload.is_admin === true);
  }, [session]);

  return isAdmin;
}
