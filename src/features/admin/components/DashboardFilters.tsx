import React from 'react';
import type { AdminFilters, AdminUserOption } from '../types';
import {
  ADMIN_DATE_PRESET_OPTIONS,
  ADMIN_EVENT_TYPE_OPTIONS,
  ADMIN_MODULE_OPTIONS,
} from '../types';

interface DashboardFiltersProps {
  filters: AdminFilters;
  users: AdminUserOption[];
  onChange: (patch: Partial<AdminFilters>) => void;
  onApply: () => void;
  onClear: () => void;
  onExport: () => void;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  filters,
  users,
  onChange,
  onApply,
  onClear,
  onExport,
}) => {
  return (
    <section className="admin-filters">
      <div className="admin-filters__preset-row">
        {ADMIN_DATE_PRESET_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`admin-filter-pill ${filters.datePreset === option.value ? 'is-active' : ''}`}
            onClick={() => onChange({ datePreset: option.value })}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="admin-filters__grid">
        {filters.datePreset === 'custom' ? (
          <>
            <label className="admin-field">
              <span>Desde</span>
              <input
                type="date"
                value={filters.startDate}
                onChange={(event) => onChange({ startDate: event.target.value })}
              />
            </label>

            <label className="admin-field">
              <span>Hasta</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={(event) => onChange({ endDate: event.target.value })}
              />
            </label>
          </>
        ) : null}

        <label className="admin-field">
          <span>Módulo</span>
          <select
            value={filters.module}
            onChange={(event) => onChange({ module: event.target.value as AdminFilters['module'] })}
          >
            <option value="Todos">Todos</option>
            {ADMIN_MODULE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-field">
          <span>Tipo de evento</span>
          <select
            value={filters.eventType}
            onChange={(event) => onChange({ eventType: event.target.value as AdminFilters['eventType'] })}
          >
            <option value="Todos">Todos</option>
            {ADMIN_EVENT_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-field admin-field--wide">
          <span>Usuario</span>
          <input
            type="text"
            list="admin-users-list"
            placeholder="Buscar por correo o nombre"
            value={filters.userQuery}
            onChange={(event) => onChange({ userQuery: event.target.value })}
          />
          <datalist id="admin-users-list">
            {users.map((user) => (
              <option key={user.id} value={user.email}>
                {user.label}
              </option>
            ))}
          </datalist>
        </label>
      </div>

      <div className="admin-filters__actions">
        <button type="button" className="btn btn-primary" onClick={onApply}>
          Aplicar filtros
        </button>
        <button type="button" className="btn btn-secondary" onClick={onClear}>
          Limpiar filtros
        </button>
        <button type="button" className="btn btn-secondary" onClick={onExport}>
          Exportar reporte
        </button>
      </div>
    </section>
  );
};

export default DashboardFilters;
