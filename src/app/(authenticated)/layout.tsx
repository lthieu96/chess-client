"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useEffect } from "react";
import FullPageLoading from "../_components/fullpage-loading";
import { useRouter } from "next/navigation";

export default function AuthenticatedLayout(props: React.PropsWithChildren) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <FullPageLoading />;
  }

  return <>{props.children}</>;
}
