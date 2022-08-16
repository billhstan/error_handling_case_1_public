import { React } from "react";
import { useTable, useFilters, useGlobalFilter } from "react-table";
import { GlobalFilter, DefaultFilterForColumn } from "./BrandTableFilter";

export default function BrandTable({ columns, data, getRowProps = () => ({})  }) {
    //Had runtime errors when trying to work on this Table functional component.
    //As a result, I had to console.log here to check .
    //console.log(columns);
    //console.log(data);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    state,
    visibleColumns,
    prepareRow,
    setGlobalFilter,
    preGlobalFilteredRows,
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultFilterForColumn }
    },
    useFilters,
    useGlobalFilter
  );

  return (
    <table className="table table-responsive w-75 border table-borderless" {...getTableProps()}>
      <thead>
        <tr>
          <th
            colSpan={visibleColumns.length}
            style={{
              textAlign: 'center',
            }}
          >
            {/* rendering global filter */}
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </th>
        </tr>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} >
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>
                {column.render("Header")}
                {/* rendering column filter */}
                <div>{column.canFilter ? column.render('Filter') : null}</div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr  {...row.getRowProps(getRowProps(row))}>
              {row.cells.map((cell) => {
                /*https://codesandbox.io/s/tannerlinsleyreact-table-basic-evgp3?file=/src/App.js:1565-1643  */
                return <td className="text-start"  {...cell.getCellProps({
                  className: cell.column.className
                })} >{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}