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

interface TableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  onRowClick?: (e: React.MouseEvent<HTMLTableRowElement>) => void;
}

const Table = <T,>(props: TableProps<T>): React.ReactElement => {
  const {
    data,
    columns,
    onRowClick,
  } = props;

  const refTableContainer = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => refTableContainer.current,
    estimateSize: () => 45,
    overscan: 2,
  });

  return (
    <PDScrollArea
      ref={refTableContainer}
      className="h-full"
      verticalScrollClassNames="pt-8"
    >
      <div className="relative grid">
        <thead className="sticky top-0 z-10">
          {
            table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="pd-table-head flex w-full justify-between"
              >
                {
                  headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="flex"
                      style={{ width: header.getSize() }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))
                }
              </tr>
            ))
          }
        </thead>
        <tbody
          className="relative grid"
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {
            rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = table.getRowModel().rows[virtualRow.index];
              return (
                <tr
                  key={row.id}
                  data-index={virtualRow.index}
                  onClick={onRowClick}
                  style={{ transform: `translateY(${virtualRow.start}px)` }}
                  className={cn(
                    'pd-table-row',
                    'absolute',
                    'flex justify-between',
                    'w-full',
                    {
                      ['opacity-0 animate-fade-in animation-duration-500 animation-delay-500']: virtualRow.index === 0,
                    },
                  )}
                >
                  {
                    row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="flex"
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))
                  }
                </tr>
              );
            })
          }
        </tbody>
      </div>
    </PDScrollArea>
  );
};

export default Table;
