import React from 'react';
import AdminDataTable from './AdminDataTable';
import type { FrequentQuestionItem } from '../types';

interface FrequentQuestionsTableProps {
  rows: FrequentQuestionItem[];
}

const FrequentQuestionsTable: React.FC<FrequentQuestionsTableProps> = ({ rows }) => {
  return (
    <AdminDataTable
      rows={rows}
      rowKey={(row) => row.id}
      emptyMessage="No hay preguntas frecuentes para los filtros seleccionados."
      defaultSort={{ columnId: 'count', direction: 'desc' }}
      columns={[
        {
          id: 'question',
          label: 'Pregunta',
          sortable: true,
          sortValue: (row) => row.question,
          render: (row) => row.question,
        },
        {
          id: 'count',
          label: 'Cantidad',
          sortable: true,
          sortValue: (row) => row.count,
          render: (row) => row.count.toLocaleString('es-BO'),
        },
        {
          id: 'module',
          label: 'Módulo',
          sortable: true,
          sortValue: (row) => row.module,
          render: (row) => row.module,
        },
        {
          id: 'lastAsked',
          label: 'Última consulta',
          sortable: true,
          sortValue: (row) => row.lastAsked,
          render: (row) => row.lastAsked,
        },
        {
          id: 'category',
          label: 'Categoría',
          sortable: true,
          sortValue: (row) => row.category,
          render: (row) => row.category,
        },
      ]}
    />
  );
};

export default FrequentQuestionsTable;
