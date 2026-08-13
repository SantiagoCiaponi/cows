"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/shared/session";

export default function Root() {
  const router = useRouter();
  const { isAuthenticated } = useSession();

  useEffect(() => {
    router.replace(isAuthenticated ? "/home" : "/login");
  }, [isAuthenticated, router]);

  return null;
}
