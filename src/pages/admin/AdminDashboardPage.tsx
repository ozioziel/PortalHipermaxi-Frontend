import React, { useEffect, useState } from 'react';
import ChartCard from '../../features/admin/components/ChartCard';
import DashboardFilters from '../../features/admin/components/DashboardFilters';
import EventsByTypeChart from '../../features/admin/components/EventsByTypeChart';
import FormsCompletionChart from '../../features/admin/components/FormsCompletionChart';
import FrequentQuestionsChart from '../../features/admin/components/FrequentQuestionsChart';
import FrequentQuestionsTable from '../../features/admin/components/FrequentQuestionsTable';
import InteractionsByDateChart from '../../features/admin/components/InteractionsByDateChart';
import AiInteractionsTable from '../../features/admin/components/AiInteractionsTable';
import AiUsageChart from '../../features/admin/components/AiUsageChart';
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
  AiInteractionRecord,
  CountByLabel,
  CountByModule,
  FormStats,
  FrequentQuestionItem,
  InteractionsByDatePoint,
  MetricDefinition,
  TraceabilityEvent,
} from '../../features/admin/types';

const AdminDashboardPage: React.FC = () => {
  const [draftFilters, setDraftFilters] = useState<AdminFilters>(DEFAULT_ADMIN_FILTERS);
  const [filters, setFilters] = useState<AdminFilters>(DEFAULT_ADMIN_FILTERS);
  const [users, setUsers] = useState<AdminUserOption[]>([]);
  const [metrics, setMetrics] = useState<MetricDefinition[]>([]);
  const [interactionsByDate, setInteractionsByDate] = useState<InteractionsByDatePoint[]>([]);
  const [mostUsedModules, setMostUsedModules] = useState<CountByModule[]>([]);
  const [frequentQuestions, setFrequentQuestions] = useState<FrequentQuestionItem[]>([]);
  const [aiUsage, setAiUsage] = useState<CountByLabel[]>([]);
  const [formsCompletion, setFormsCompletion] = useState<FormStats[]>([]);
  const [eventsByType, setEventsByType] = useState<CountByLabel[]>([]);
  const [traceability, setTraceability] = useState<TraceabilityEvent[]>([]);
  const [aiInteractions, setAiInteractions] = useState<AiInteractionRecord[]>([]);

  useEffect(() => {
    void adminDashboardService.getAvailableUsers().then(setUsers);
  }, []);

  useEffect(() => {
    const load = async () => {
      const [
        nextMetrics,
        nextInteractionsByDate,
        nextMostUsedModules,
        nextFrequentQuestions,
        nextAiUsage,
        nextFormsCompletion,
        nextEventsByType,
        nextTraceability,
        nextAiInteractions,
      ] = await Promise.all([
        adminDashboardService.getDashboardSummary(filters),
        adminDashboardService.getInteractionsByDate(filters),
        adminDashboardService.getMostUsedModules(filters),
        adminDashboardService.getFrequentQuestions(filters),
        adminDashboardService.getAiUsageStats(filters),
        adminDashboardService.getFormsCompletion(filters),
        adminDashboardService.getEventsByType(filters),
        adminDashboardService.getTraceability(filters),
        adminDashboardService.getAiInteractions(filters),
      ]);

      setMetrics(nextMetrics);
      setInteractionsByDate(nextInteractionsByDate);
      setMostUsedModules(nextMostUsedModules);
      setFrequentQuestions(nextFrequentQuestions);
      setAiUsage(nextAiUsage);
      setFormsCompletion(nextFormsCompletion);
      setEventsByType(nextEventsByType);
      setTraceability(nextTraceability);
      setAiInteractions(nextAiInteractions);
    };

    void load();
  }, [filters]);

  const handleExport = () => {
    downloadCsvReport(
      'admin-dashboard-trazabilidad.csv',
      traceability.map((row) => ({
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
        <h2>Dashboard de Trazabilidad</h2>
        <p>
          Monitoreo de uso del portal, soporte e interacciones con IA. Todo el módulo
          admin está separado del flujo cliente y preparado para crecer con backend real.
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
          subtitle="Evolución diaria del uso del portal según los filtros aplicados."
        >
          <InteractionsByDateChart data={interactionsByDate} />
        </ChartCard>

        <ChartCard
          title="Módulos más usados"
          subtitle="Comparación de volumen operativo entre módulos principales."
        >
          <MostUsedModulesChart data={mostUsedModules} />
        </ChartCard>

        <ChartCard
          title="Preguntas frecuentes más realizadas"
          subtitle="Consultas repetidas ordenadas de mayor a menor recurrencia."
        >
          <FrequentQuestionsChart data={frequentQuestions} />
        </ChartCard>

        <ChartCard
          title="Uso del asistente IA"
          subtitle="Preguntas respondidas, errores y derivaciones a soporte."
        >
          <AiUsageChart data={aiUsage} />
        </ChartCard>

        <ChartCard
          title="Formularios iniciados vs completados"
          subtitle="Seguimiento del avance del flujo de alta de proveedores."
        >
          <FormsCompletionChart data={formsCompletion} />
        </ChartCard>

        <ChartCard
          title="Eventos por tipo"
          subtitle="Distribución del comportamiento del portal por categoría."
        >
          <EventsByTypeChart data={eventsByType} />
        </ChartCard>
      </section>

      <section className="admin-two-column">
        <article className="admin-table-card">
          <div className="admin-table-card__header">
            <h3>Actividad reciente</h3>
            <p>Eventos de trazabilidad con orden por fecha, usuario, módulo y estado.</p>
          </div>
          <TraceabilityTable rows={traceability} />
        </article>

        <article className="admin-table-card">
          <div className="admin-table-card__header">
            <h3>Preguntas frecuentes</h3>
            <p>Resumen de las dudas más repetidas detectadas en el asistente.</p>
          </div>
          <FrequentQuestionsTable rows={frequentQuestions} />
        </article>
      </section>

      <article className="admin-table-card">
        <div className="admin-table-card__header">
          <h3>Interacciones IA</h3>
          <p>Detalle operacional de preguntas, respuestas y estados del asistente.</p>
        </div>
        <AiInteractionsTable rows={aiInteractions} />
      </article>
    </div>
  );
};

export default AdminDashboardPage;
