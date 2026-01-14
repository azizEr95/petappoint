import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { DashboardPerson } from "@/components/dashboard/personDashboard/DashboardPerson";
import { useLoginContext } from "@/LoginContext";
import { DashboardPractice } from "@/components/dashboard/practiceDashboard/DashboardPractice";
import { isLoggedInAndVerified } from "@/utils/Authentication";
import { useTitle } from "@/utils/useTitle";


export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  useTitle('Dashboard');
  const { login } = useLoginContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedInAndVerified(login)) {
      navigate({
        to: '/login',
        search: {
          redirect: '/dashboard',
        },
      })
    }
  }, [login])

  if (login) {
    switch (login.role) {
      case 'person':
        return <DashboardPerson />;
      case 'company':
        return <DashboardPractice />;
      default:
        return <DashboardPerson />;
    }
  }
}
