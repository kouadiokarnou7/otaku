import type { ReactNode } from "react";
import AppLayout from "@/components/main/AppLayout";
 
export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <AppLayout notifCount={3}>
      {children}
    </AppLayout>
  );
}
 