import React, { useEffect, useState } from 'react';
import ChartCard from '../../features/admin/components/ChartCard';
import DashboardFilters from '../../features/admin/components/DashboardFilters';
import InteractionsByDateChart from '../../features/admin/components/InteractionsByDateChart';
import MetricCard from '../../features/admin/components/MetricCard';
import MostUsedModulesChart from '../../features/admin/components/MostUsedModulesChart';
import TraceabilityTable from '../../features/admin/components/TraceabilityTable';
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
  TraceabilityEvent,
} from '../../features/admin/types';

const AdminTraceabilityPage: React.FC = () => {
  const [draftFilters, setDraftFilters] = useState<AdminFilters>(DEFAULT_ADMIN_FILTERS);
  const [filters, setFilters] = useState<AdminFilters>(DEFAULT_ADMIN_FILTERS);
  const [users, setUsers] = useState<AdminUserOption[]>([]);
  const [rows, setRows] = useState<TraceabilityEvent[]>([]);
  const [interactionsByDate, setInteractionsByDate] = useState<InteractionsByDatePoint[]>([]);
  const [mostUsedModules, setMostUsedModules] = useState<CountByModule[]>([]);
  const [metrics, setMetrics] = useState<MetricDefinition[]>([]);

  useEffect(() => {
    void adminDashboardService.getAvailableUsers().then(setUsers);
  }, []);

  useEffect(() => {
    const load = async () => {
      const [nextRows, nextInteractionsByDate, nextMostUsedModules, nextMetrics] = await Promise.all([
        adminDashboardService.getTraceability(filters),
        adminDashboardService.getInteractionsByDate(filters),
        adminDashboardService.getMostUsedModules(filters),
        adminDashboardService.getDashboardSummary(filters),
      ]);

      setRows(nextRows);
      setInteractionsByDate(nextInteractionsByDate);
      setMostUsedModules(nextMostUsedModules);
      setMetrics(nextMetrics.slice(0, 4));
    };

    void load();
  }, [filters]);

  const handleExport = () => {
    downloadCsvReport(
      'admin-trazabilidad.csv',
      rows.map((row) => ({
        fecha_hora: new Date(row.createdAt).toLocaleString('es-BO'),
        usuario: row.userName,
        correo: row.userEmail,
        rol: row.role,
        modulo: row.module,
        accion: row.action,
        descripcion: row.description,
        estado: row.status,
      })),
    );
  };

  return (
    <div className="admin-page">
      <section className="admin-page__hero">
        <h2>Trazabilidad del sistema</h2>
        <p>
          Registro detallado de fechas, usuarios, módulos y acciones. El ordenamiento de la
          tabla se mantiene por columna y la exportación respeta los filtros activos.
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
          title="Interacciones por fecha"
          subtitle="Comportamiento temporal de la actividad registrada."
        >
          <InteractionsByDateChart data={interactionsByDate} />
        </ChartCard>

        <ChartCard
          title="Módulos más usados"
          subtitle="Concentración de eventos según el origen funcional."
        >
          <MostUsedModulesChart data={mostUsedModules} />
        </ChartCard>
      </section>

      <article className="admin-table-card">
        <div className="admin-table-card__header">
          <h3>Tabla de trazabilidad</h3>
          <p>Ordena por fecha, correo, módulo o estado para revisar el historial operativo.</p>
        </div>
        <TraceabilityTable rows={rows} />
      </article>
    </div>
  );
};

export default AdminTraceabilityPage;
