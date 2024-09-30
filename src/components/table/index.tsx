import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useRef } from 'react';

import { PDScrollArea } from '@components/pdScrollArea';
import { cn } from '@utils/helpers';

interface ReusableTableProps {
  data: Array<Record<string, any>>;
  columns: ColumnDef<unknown>[];
  onRowClick: (row: Record<string, unknown>) => void;
}

const Table: React.FC<ReusableTableProps> = ({ data, columns, onRowClick }) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 45,
    overscan: 2,
  });

  return (
    <PDScrollArea
      ref={tableContainerRef}
      className="h-full"
    >
      <div style={{ display: 'grid' }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="pd-table-head"
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    display: 'flex',
                    width: header.getSize(),
                  }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          style={{
            display: 'grid',
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = table.getRowModel().rows[virtualRow.index];
            return (
              <tr
                key={row.id}
                data-index={virtualRow.index}
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => onRowClick(row.original as Record<string, unknown>)}
                className={cn(
                  'pd-table-row',
                  {
                    ['opacity-0 animate-fade-in animation-duration-500 animation-delay-500']: virtualRow.index === 0,
                  },
                )}
                style={{
                  display: 'flex',
                  position: 'absolute',
                  transform: `translateY(${virtualRow.start}px)`,
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{
                      display: 'flex',
                      width: cell.column.getSize(),
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </div>
    </PDScrollArea>
  );
};

export default Table;
