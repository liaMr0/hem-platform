import { StatsCards } from "../users/_components/StatsCards";

// Componente para el dashboard del admin
export const AdminDashboard = ({ stats }: { stats: any }) => {
  return (
    <div>
      <StatsCards stats={stats} />
    </div>
  );
};