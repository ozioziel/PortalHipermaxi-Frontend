import React, { useEffect, useState } from 'react';
import ChartCard from '../../features/admin/components/ChartCard';
import DashboardFilters from '../../features/admin/components/DashboardFilters';
import FrequentQuestionsChart from '../../features/admin/components/FrequentQuestionsChart';
import FrequentQuestionsTable from '../../features/admin/components/FrequentQuestionsTable';
import MetricCard from '../../features/admin/components/MetricCard';
import {
  adminDashboardService,
  DEFAULT_ADMIN_FILTERS,
  downloadCsvReport,
} from '../../services/adminDashboardService';
import type {
  AdminFilters,
  AdminUserOption,
  FrequentQuestionItem,
  MetricDefinition,
} from '../../features/admin/types';

const AdminFrequentQuestionsPage: React.FC = () => {
  const [draftFilters, setDraftFilters] = useState<AdminFilters>(DEFAULT_ADMIN_FILTERS);
  const [filters, setFilters] = useState<AdminFilters>(DEFAULT_ADMIN_FILTERS);
  const [users, setUsers] = useState<AdminUserOption[]>([]);
  const [rows, setRows] = useState<FrequentQuestionItem[]>([]);
  const [metrics, setMetrics] = useState<MetricDefinition[]>([]);

  useEffect(() => {
    void adminDashboardService.getAvailableUsers().then(setUsers);
  }, []);

  useEffect(() => {
    const load = async () => {
      const [nextRows, nextMetrics] = await Promise.all([
        adminDashboardService.getFrequentQuestions(filters),
        adminDashboardService.getDashboardSummary(filters),
      ]);

      setRows(nextRows);
      setMetrics(nextMetrics.slice(1, 3));
    };

    void load();
  }, [filters]);

  const handleExport = () => {
    downloadCsvReport(
      'admin-preguntas-frecuentes.csv',
      rows.map((row) => ({
        pregunta: row.question,
        cantidad: row.count,
        modulo: row.module,
        ultima_consulta: row.lastAsked,
        categoria: row.category,
      })),
    );
  };

  return (
    <div className="admin-page">
      <section className="admin-page__hero">
        <h2>Preguntas frecuentes</h2>
        <p>
          Detección de consultas repetidas para priorizar contenidos, guías y mejoras del
          asistente IA según fecha, módulo y usuario.
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
          title="Ranking de preguntas"
          subtitle="Las consultas más repetidas del período filtrado."
        >
          <FrequentQuestionsChart data={rows} />
        </ChartCard>

        <article className="admin-table-card">
          <div className="admin-table-card__header">
            <h3>Tabla de preguntas frecuentes</h3>
            <p>Ordena por cantidad, módulo o última consulta para encontrar patrones.</p>
          </div>
          <FrequentQuestionsTable rows={rows} />
        </article>
      </section>
    </div>
  );
};

export default AdminFrequentQuestionsPage;
