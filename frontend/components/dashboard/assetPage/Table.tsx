import React, { isValidElement, useEffect, useState } from "react";

import {
  createTable,
  Column,
  TableInstance,
  ColumnDef,
  useTableInstance,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { makeData, Person } from "./makeData";
import { Button, DropDown, Flex, Icon, Text, Input } from "@findnlink/neuro-ui";
import scss from "./Table.module.scss";
import {
  FiArrowLeft,
  FiArrowRight,
  FiSkipBack,
  FiSkipForward,
} from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";
import { updateTable } from "lib/api";
import { useDispatch, useSelector } from "react-redux";
import { selectedAssetSelector } from "lib/slices/assetSlice";
import { ASSET_PICK_DROP } from "lib/models/assetEnum";
import { dispatch } from "react-hot-toast/dist/core/store";

let table = createTable()
  .setRowType<Person>()
  // In addition to our row type, we can also tell our table about a custom "updateData" method we will provide it
  .setTableMetaType<{
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }>();

// Get our table generics
type MyTableGenerics = typeof table.generics;

// Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<MyTableGenerics>> = {
  cell: ({ getValue, row: { index }, column: { id }, instance }) => {
    const initialValue = getValue();
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      instance.options.meta?.updateData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <input
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
      />
    );
  },
};

function useSkipper() {
  const shouldSkipRef = React.useRef(true);
  const shouldSkip = shouldSkipRef.current;

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = React.useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  React.useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip] as const;
}

export default function Table({ _data }: { _data: any }) {
  //const rerender = React.useReducer(() => ({}), {})[1];

  useEffect(() => {
    instance.setPageSize(Number(20));
  }, []);

  const selectedAsset = useSelector(selectedAssetSelector);
  const [data, setData] = useState(selectedAsset?.table);
  //const data = useSelector();

  const [showSaveButton, setShowSaveButton] = useState(false);
  const [showSaveButtonToggle, setShowSaveButtonToggle] = useState(false);

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const columns = React.useMemo(
    () => [
      table.createDataColumn((row) => row.date, {
        id: "date",
        header: () => <span>Date</span>,
        footer: (props) => props.column.id,
        cell: ({ cell }) => (
          <Input
            onChange={(e) =>
              instance.options.meta?.updateData(
                cell.row.index,
                "date",
                e.target.value
              )
            }
            value={cell.getValue()}
            type={"datetime-local"}
            id={"input"}
          />
        ),
      }),
      table.createDataColumn((row) => row.status, {
        id: "status",
        header: () => <span>Status</span>,
        cell: ({ cell }) => (
          <select
            onChange={(e) =>
              instance.options.meta?.updateData(
                cell.row.index,
                "status",
                e.target.value
              )
            }
            value={cell.getValue() === "" ? "Select" : cell.getValue()}
          >
            <option value={"Select"}>Select</option>
            <option value={ASSET_PICK_DROP.PICKUP}>
              {ASSET_PICK_DROP.PICKUP}
            </option>
            <option value={ASSET_PICK_DROP.DROP_OFF}>
              {ASSET_PICK_DROP.DROP_OFF}
            </option>
            <option value={ASSET_PICK_DROP.ASSET_CREATED}>
              {ASSET_PICK_DROP.ASSET_CREATED}
            </option>
          </select>
        ),
        footer: (props) => props.column.id,
        size: 10,
      }),
      table.createDataColumn((row) => row.destination, {
        id: "destination",
        header: () => <span>Destination</span>,
        footer: (props) => props.column.id,
      }),
    ],
    []
  );

  const instance = useTableInstance(table, {
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex,
    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowIndex, columnId, value) => {
        // Skip age index reset until after next rerender
        skipAutoResetPageIndex();
        setData((old: any) =>
          old.map((row: any, index: number) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
    debugTable: true,
  });

  useEffect(() => {
    setData(selectedAsset?.table);
  }, [selectedAsset]);

  const addNewRow = () => {
    setData((prev: any) => [
      { date: "", status: "", destination: "", confirmed: false },
      ...prev,
    ]);
  };

  const save = () => {
    updateTable(_data.id, data);
    setShowSaveButton(false);
  };

  useEffect(() => {
    if (data) {
      setShowSaveButtonToggle(true);
    }
    if (showSaveButtonToggle) {
      setShowSaveButton(true);
    }
  }, [data]);

  return (
    <div className={scss.table}>
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        padding="0 0 m 0"
      >
        <Text weight="bold" scale="xl" margin="m 0 xl 0">
          Delivery Schedule
        </Text>
        <div>
          <Button onClick={addNewRow}>Add</Button>
          {showSaveButton && (
            <Button primary onClick={save} margin="0">
              Save
            </Button>
          )}
        </div>
      </Flex>
      <div style={{ overflow: "auto" }}>
        <table>
          <thead>
            {instance.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div>
                          {header.renderHeader()}
                          {header.column.getCanFilter() ? (
                            <div>
                              <Filter
                                column={header.column}
                                instance={instance}
                              />
                            </div>
                          ) : null}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {instance.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return <td key={cell.id}>{cell.renderCell()}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Flex flexDirection="row" justifyContent="space-between" margin="xl 0">
        <Button
          onClick={() => instance.setPageIndex(0)}
          disabled={!instance.getCanPreviousPage()}
        >
          <FiSkipBack />
        </Button>
        <Button
          onClick={() => instance.previousPage()}
          disabled={!instance.getCanPreviousPage()}
        >
          <FiArrowLeft />
        </Button>
        <Text align="center">
          <div>Page</div>
          <strong>
            {instance.getState().pagination.pageIndex + 1} of{" "}
            {instance.getPageCount()}
          </strong>
        </Text>
        <Button
          onClick={() => instance.nextPage()}
          disabled={!instance.getCanNextPage()}
        >
          <FiArrowRight />
        </Button>
        <Button
          onClick={() => instance.setPageIndex(instance.getPageCount() - 1)}
          disabled={!instance.getCanNextPage()}
        >
          <FiSkipForward />
        </Button>
      </Flex>
    </div>
  );
}
function Filter({
  column,
  instance,
}: {
  column: Column<any>;
  instance: TableInstance<any>;
}) {
  const firstValue = instance
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return column.id === "date" ? (
    <Input
      type="date"
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
    />
  ) : (
    <input
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="w-36 border shadow rounded"
    />
  );
}
