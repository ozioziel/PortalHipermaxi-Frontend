import React, { useEffect, useState } from 'react';
import ChartCard from '../../features/admin/components/ChartCard';
import DashboardFilters from '../../features/admin/components/DashboardFilters';
import InteractionsByDateChart from '../../features/admin/components/InteractionsByDateChart';
import MetricCard from '../../features/admin/components/MetricCard';
import MostUsedModulesChart from '../../features/admin/components/MostUsedModulesChart';
import UserActivityTable from '../../features/admin/components/UserActivityTable';
import {
  adminDashboardService,
  DEFAULT_ADMIN_FILTERS,
  downloadCsvReport,
} from '../../services/adminDashboardService';
import type {
  AdminFilters,
  AdminUserOption,
  CountByModule,
  InteractionsByDatePoint,
  MetricDefinition,
  UserActivityRecord,
} from '../../features/admin/types';

const AdminUserActivityPage: React.FC = () => {
  const [draftFilters, setDraftFilters] = useState<AdminFilters>(DEFAULT_ADMIN_FILTERS);
  const [filters, setFilters] = useState<AdminFilters>(DEFAULT_ADMIN_FILTERS);
  const [users, setUsers] = useState<AdminUserOption[]>([]);
  const [rows, setRows] = useState<UserActivityRecord[]>([]);
  const [interactionsByDate, setInteractionsByDate] = useState<InteractionsByDatePoint[]>([]);
  const [mostUsedModules, setMostUsedModules] = useState<CountByModule[]>([]);
  const [metrics, setMetrics] = useState<MetricDefinition[]>([]);

  useEffect(() => {
    void adminDashboardService.getAvailableUsers().then(setUsers);
  }, []);

  useEffect(() => {
    const load = async () => {
      const [nextRows, nextInteractionsByDate, nextMostUsedModules, nextMetrics] = await Promise.all([
        adminDashboardService.getUserActivity(filters),
        adminDashboardService.getInteractionsByDate(filters),
        adminDashboardService.getMostUsedModules(filters),
        adminDashboardService.getDashboardSummary(filters),
      ]);

      setRows(nextRows);
      setInteractionsByDate(nextInteractionsByDate);
      setMostUsedModules(nextMostUsedModules);
      setMetrics(nextMetrics.filter((metric) => ['active-users', 'forms-started', 'forms-completed', 'products-filtered'].includes(metric.id)));
    };

    void load();
  }, [filters]);

  const handleExport = () => {
    downloadCsvReport(
      'admin-actividad-usuarios.csv',
      rows.map((row) => ({
        usuario: row.userName,
        correo: row.userEmail,
        rol: row.role,
        ultima_actividad: row.lastActivity,
        modulo_visitado: row.moduleVisited,
        accion_realizada: row.actionTaken,
        fecha_hora: new Date(row.createdAt).toLocaleString('es-BO'),
      })),
    );
  };

  return (
    <div className="admin-page">
      <section className="admin-page__hero">
        <h2>Actividad de usuarios</h2>
        <p>
          Vista operativa por usuario para revisar última actividad, módulo visitado,
          acción realizada y comportamiento por fecha.
        </p>
      </section>

      <DashboardFilters
        filters={draftFilters}
        users={users}
        onChange={(patch) => setDraftFilters((current) => ({ ...current, ...patch }))}
        onApply={() => setFilters(draftFilters)}
        onClear={() => {
          setDraftFilters(DEFAULT_ADMIN_FILTERS);
          setFilters(DEFAULT_ADMIN_FILTERS);
        }}
        onExport={handleExport}
      />

      <section className="admin-metrics-grid">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} {...metric} />
        ))}
      </section>

      <section className="admin-two-column">
        <ChartCard
          title="Actividad por fecha"
          subtitle="Ritmo de uso por día dentro del período seleccionado."
        >
          <InteractionsByDateChart data={interactionsByDate} />
        </ChartCard>

        <ChartCard
          title="Módulos visitados"
          subtitle="Comparación del volumen de actividad por módulo."
        >
          <MostUsedModulesChart data={mostUsedModules} />
        </ChartCard>
      </section>

      <article className="admin-table-card">
        <div className="admin-table-card__header">
          <h3>Tabla de actividad de usuarios</h3>
          <p>Ordena por correo, módulo o fecha para detectar recorridos y bloqueos.</p>
        </div>
        <UserActivityTable rows={rows} />
      </article>
    </div>
  );
};

export default AdminUserActivityPage;
