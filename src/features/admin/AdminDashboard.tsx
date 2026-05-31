import React, { useEffect, useState } from 'react';
import { HiperFlowApi } from '../support/services/HiperFlowApi';
import { useAuth } from '../../core/auth/AuthContext';

import MetricCard from './components/MetricCard';
import FrequentQuestionsTable from './components/FrequentQuestionsTable';
import RecentActivityTable from './components/RecentActivityTable';
import AiInteractionsTable from './components/AiInteractionsTable';
import UserActivityTable from './components/UserActivityTable';
import {
  mockDashboardSummary,
  mockFrequentQuestions,
  mockRecentActivity,
  mockAiInteractions,
  mockUsersActivity,
} from './data/mockAdminDashboard';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<any>(mockDashboardSummary);
  const [frequentQuestions, setFrequentQuestions] = useState<any[]>(mockFrequentQuestions);
  const [recentActivity, setRecentActivity] = useState<any[]>(mockRecentActivity);
  const [aiInteractions, setAiInteractions] = useState<any[]>(mockAiInteractions);
  const [userActivity, setUserActivity] = useState<any[]>(mockUsersActivity);

  const dailyInteractions = [
    { day: 'Dom', value: 28 },
    { day: 'Lun', value: 42 },
    { day: 'Mar', value: 37 },
    { day: 'Mié', value: 48 },
    { day: 'Jue', value: 33 },
    { day: 'Vie', value: 51 },
    { day: 'Sáb', value: 27 },
  ];

  const modulesUsage = [
    { module: 'Facturas', value: 38 },
    { module: 'Productos', value: 32 },
    { module: 'IA', value: 26 },
    { module: 'Proveedor', value: 18 },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const s = await HiperFlowApi.getDashboardSummary();
        setSummary(s || mockDashboardSummary);
      } catch {
        setSummary(mockDashboardSummary);
      }

      try {
        const questions = await HiperFlowApi.getFrequentQuestions();
        setFrequentQuestions(questions?.length ? questions : mockFrequentQuestions);
      } catch {
        setFrequentQuestions(mockFrequentQuestions);
      }

      try {
        const recent = await HiperFlowApi.getRecentActivity();
        setRecentActivity(recent?.length ? recent : mockRecentActivity);
      } catch {
        setRecentActivity(mockRecentActivity);
      }

      try {
        const ai = await HiperFlowApi.getAiInteractions();
        setAiInteractions(ai?.length ? ai : mockAiInteractions);
      } catch {
        setAiInteractions(mockAiInteractions);
      }

      try {
        const users = await HiperFlowApi.getUsersActivity();
        setUserActivity(users?.length ? users : mockUsersActivity);
      } catch {
        setUserActivity(mockUsersActivity);
      }
    };

    void load();
  }, []);

  if (!user || user.role !== 'admin') {
    return <div style={{ padding: 24 }}>No autorizado.</div>;
  }

  return (
    <div className="container" style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 8 }}>Dashboard de Trazabilidad</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: 0 }}>Resumen de actividad y uso del portal</p>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginTop: 18 }}>
        <MetricCard title="Usuarios activos" value={summary?.totalUsers ?? '-'} />
        <MetricCard title="Interacciones IA" value={summary?.totalAiInteractions ?? '-'} />
        <MetricCard title="Preguntas frecuentes" value={summary?.totalFaqs ?? '-'} />
        <MetricCard title="Form. iniciados" value={summary?.formsStarted ?? '-'} />
        <MetricCard title="Form. completados" value={summary?.formsCompleted ?? '-'} />
        <MetricCard title="Errores detectados" value={summary?.errorsDetected ?? '-'} />
        <MetricCard title="Facturas consultadas" value={summary?.invoicesViewed ?? '-'} />
        <MetricCard title="Guías visuales" value={summary?.visualGuidesStarted ?? '-'} />
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '2fr 1fr', marginTop: 18 }}>
        <div>
          <section className="card" style={{ padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>Preguntas frecuentes</h3>
            <FrequentQuestionsTable items={frequentQuestions} />
          </section>

          <section className="card" style={{ padding: 16, marginTop: 12 }}>
            <h3 style={{ marginTop: 0 }}>Interacciones de usuarios</h3>
            <RecentActivityTable items={recentActivity} />
          </section>

          <section className="card" style={{ padding: 16, marginTop: 12 }}>
            <h3 style={{ marginTop: 0 }}>Uso del asistente IA</h3>
            <AiInteractionsTable items={aiInteractions} />
          </section>
        </div>

        <div>
          <section className="card" style={{ padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>Interacciones por día</h3>
            <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
              {dailyInteractions.map((item) => (
                <div key={item.day} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.day}</span>
                  <div style={{ background: '#f1f5f9', borderRadius: 6, height: 12, width: '100%' }}>
                    <div style={{ width: `${item.value}%`, background: '#f66014', height: '100%', borderRadius: 6 }} />
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="card" style={{ padding: 16, marginTop: 12 }}>
            <h3 style={{ marginTop: 0 }}>Módulos más usados</h3>
            <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
              {modulesUsage.map((item) => (
                <div key={item.module} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.module}</div>
                    <div style={{ height: 10, background: '#f1f5f9', borderRadius: 6, marginTop: 6 }}>
                      <div style={{ width: `${item.value}%`, height: '100%', background: '#0f766e', borderRadius: 6 }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </section>

          <section className="card" style={{ padding: 16, marginTop: 12 }}>
            <h3 style={{ marginTop: 0 }}>Actividad reciente</h3>
            <UserActivityTable items={userActivity} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
