import React, { useEffect, useState } from 'react';
import AiInteractionsTable from '../../features/admin/components/AiInteractionsTable';
import AiUsageChart from '../../features/admin/components/AiUsageChart';
import ChartCard from '../../features/admin/components/ChartCard';
import DashboardFilters from '../../features/admin/components/DashboardFilters';
import FrequentQuestionsChart from '../../features/admin/components/FrequentQuestionsChart';
import MetricCard from '../../features/admin/components/MetricCard';
import {
  adminDashboardService,
  DEFAULT_ADMIN_FILTERS,
  downloadCsvReport,
} from '../../services/adminDashboardService';
import type {
  AdminFilters,
  AdminUserOption,
  AiInteractionRecord,
  CountByLabel,
  FrequentQuestionItem,
  MetricDefinition,
} from '../../features/admin/types';

const AdminAiInteractionsPage: React.FC = () => {
  const [draftFilters, setDraftFilters] = useState<AdminFilters>(DEFAULT_ADMIN_FILTERS);
  const [filters, setFilters] = useState<AdminFilters>(DEFAULT_ADMIN_FILTERS);
  const [users, setUsers] = useState<AdminUserOption[]>([]);
  const [rows, setRows] = useState<AiInteractionRecord[]>([]);
  const [aiUsage, setAiUsage] = useState<CountByLabel[]>([]);
  const [frequentQuestions, setFrequentQuestions] = useState<FrequentQuestionItem[]>([]);
  const [metrics, setMetrics] = useState<MetricDefinition[]>([]);

  useEffect(() => {
    void adminDashboardService.getAvailableUsers().then(setUsers);
  }, []);

  useEffect(() => {
    const load = async () => {
      const [nextRows, nextAiUsage, nextFrequentQuestions, nextMetrics] = await Promise.all([
        adminDashboardService.getAiInteractions(filters),
        adminDashboardService.getAiUsageStats(filters),
        adminDashboardService.getFrequentQuestions(filters),
        adminDashboardService.getDashboardSummary(filters),
      ]);

      setRows(nextRows);
      setAiUsage(nextAiUsage);
      setFrequentQuestions(nextFrequentQuestions);
      setMetrics(nextMetrics.filter((metric) => ['ai-interactions', 'chat-errors', 'whatsapp-clicks', 'email-clicks'].includes(metric.id)));
    };

    void load();
  }, [filters]);

  const handleExport = () => {
    downloadCsvReport(
      'admin-interacciones-ia.csv',
      rows.map((row) => ({
        fecha: new Date(row.createdAt).toLocaleString('es-BO'),
        usuario: row.userName,
        correo: row.userEmail,
        pregunta: row.question,
        resumen: row.responseSummary,
        modulo: row.module,
        estado: row.status,
      })),
    );
  };

  return (
    <div className="admin-page">
      <section className="admin-page__hero">
        <h2>Interacciones IA</h2>
        <p>
          Seguimiento del comportamiento del asistente: preguntas respondidas, errores,
          fallback a soporte y concentración temática por módulo.
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
          title="Uso del asistente"
          subtitle="Volumen de respuestas, errores y derivaciones por soporte."
        >
          <AiUsageChart data={aiUsage} />
        </ChartCard>

        <ChartCard
          title="Temas más consultados"
          subtitle="Preguntas repetidas para identificar oportunidades de automatización."
        >
          <FrequentQuestionsChart data={frequentQuestions} />
        </ChartCard>
      </section>

      <article className="admin-table-card">
        <div className="admin-table-card__header">
          <h3>Tabla de interacciones IA</h3>
          <p>Ordena por fecha, usuario o estado para auditar la conversación y su respuesta.</p>
        </div>
        <AiInteractionsTable rows={rows} />
      </article>
    </div>
  );
};

export default AdminAiInteractionsPage;
