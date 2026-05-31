import React, { useState } from 'react';

type SortDirection = 'asc' | 'desc';

export interface AdminDataColumn<T> {
  id: string;
  label: string;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  render: (row: T) => React.ReactNode;
}

interface AdminDataTableProps<T> {
  rows: T[];
  columns: AdminDataColumn<T>[];
  rowKey: (row: T, index: number) => string;
  emptyMessage: string;
  pageSize?: number;
  defaultSort?: {
    columnId: string;
    direction: SortDirection;
  };
}

export function AdminDataTable<T>({
  rows,
  columns,
  rowKey,
  emptyMessage,
  pageSize = 8,
  defaultSort,
}: AdminDataTableProps<T>) {
  const [sortColumnId, setSortColumnId] = useState(defaultSort?.columnId ?? '');
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSort?.direction ?? 'desc');
  const [page, setPage] = useState(1);

  const sortColumn = columns.find((column) => column.id === sortColumnId);
  const sortedRows = rows.slice().sort((left, right) => {
    if (!sortColumn?.sortValue) return 0;

    const leftValue = sortColumn.sortValue(left);
    const rightValue = sortColumn.sortValue(right);

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return sortDirection === 'asc' ? leftValue - rightValue : rightValue - leftValue;
    }

    const result = String(leftValue).localeCompare(String(rightValue), 'es', { numeric: true });
    return sortDirection === 'asc' ? result : -result;
  });

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (columnId: string) => {
    setPage(1);

    if (sortColumnId === columnId) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortColumnId(columnId);
    setSortDirection('desc');
  };

  const getSortIndicator = (columnId: string) => {
    if (sortColumnId !== columnId) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="admin-table-shell">
      <div className="admin-table-shell__meta">
        <span>{rows.length} registros</span>
        <span>Página {currentPage} de {totalPages}</span>
      </div>

      <div className="admin-table-shell__scroller">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.id}>
                  {column.sortable ? (
                    <button
                      type="button"
                      className="admin-table__sort"
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                      <span aria-hidden="true">{getSortIndicator(column.id)}</span>
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="admin-table__empty">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              visibleRows.map((row, index) => (
                <tr key={rowKey(row, index)}>
                  {columns.map((column) => (
                    <td key={column.id}>{column.render(row)}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="admin-table-shell__pagination">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default AdminDataTable;
