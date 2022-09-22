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
import {
  Button,
  DropDown,
  Flex,
  Icon,
  Text,
  Input,
  Tag,
} from "@findnlink/neuro-ui";
import scss from "./Table.module.scss";
import {
  FiArrowLeft,
  FiArrowRight,
  FiSkipBack,
  FiSkipForward,
  FiExternalLink,
} from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";
import { updateTable } from "lib/api";
import { useDispatch, useSelector } from "react-redux";
import {
  replaceSelectedAssetTable,
  selectedAssetSelector,
  updateSelectedAssetTable,
} from "lib/slices/assetSlice";
import { ASSET_PICK_DROP } from "lib/models/assetEnum";
import { randomUUID } from "crypto";
import { v4 } from "uuid";
import { AssetTableObject } from "types/global";
import RowModal from "./RowModal";
import CellInformationModal from "./CellInformationModal";

let table = createTable()
  .setRowType<AssetTableObject>()
  // In addition to our row type, we can also tell our table about a custom "updateData" method we will provide it
  .setTableMetaType<{
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }>();

// Get our table generics
type MyTableGenerics = typeof table.generics;

// Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<MyTableGenerics>> = {
  cell: function Cell({ getValue, row: { index }, column: { id }, instance }) {
    const initialValue = getValue();
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);

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
  const dispatch = useDispatch();

  const selectedAsset = useSelector(selectedAssetSelector);
  const [data, setData] = useState(selectedAsset?.table);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [showSaveButtonToggle, setShowSaveButtonToggle] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openCellInformationModal, setOpenCellInformationModal] =
    useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedCellData, setSelectedCellData] = useState<AssetTableObject>();
  const [selectedCellIndex, setSelectedCellIndex] = useState<Number>();
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  useEffect(() => {
    instance.setPageSize(Number(20));
  }, []);

  if (data === undefined) {
    return <></>;
  }

  // eslint-disable-next-line
  const columns = React.useMemo(
    () => [
      table.createDataColumn((row) => row.date, {
        id: "date",
        header: () => <span>Date</span>,
        footer: (props) => props.column.id,
        cell: function Cell({ cell }) {
          return (
            <Flex>
              <input
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
            </Flex>
          );
        },
      }),
      table.createDataColumn((row) => row.status, {
        id: "status",
        header: () => <span>Status</span>,
        cell: function Cell({ cell }) {
          return (
            <Flex
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              {!cell.row.original?.confirmed &&
              cell.getValue() !== ASSET_PICK_DROP.PICKEDUP &&
              cell.getValue() !== ASSET_PICK_DROP.DROPEDOFF ? (
                <>
                  <Text>{cell.getValue()}</Text>
                  <svg
                    onClick={() => {
                      console.log(cell.row.index);
                      setSelectedCellIndex(cell.row.index);
                      setSelectedCellData(cell.row.original);
                      setOpenEditModal(true);
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="11.756"
                    height="11.756"
                    viewBox="0 0 11.756 11.756"
                  >
                    <path
                      id="Icon_material-edit"
                      data-name="Icon material-edit"
                      d="M4.5,13.8v2.449H6.949L14.171,9.03,11.722,6.581ZM16.065,7.136a.65.65,0,0,0,0-.921L14.537,4.687a.65.65,0,0,0-.921,0l-1.2,1.2L14.87,8.331Z"
                      transform="translate(-4.5 -4.496)"
                      fill="var(--text200)"
                    />
                  </svg>
                </>
              ) : (
                <>
                  <Text
                    _class={
                      cell.getValue() === ASSET_PICK_DROP.PICKEDUP ||
                      cell.getValue() === ASSET_PICK_DROP.AWAITING_PAYMENT
                        ? scss.pickedUpCell
                        : scss.dropedOffCell
                    }
                  >
                    {cell.getValue()}
                  </Text>
                  <FiExternalLink
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedCellData(cell.row.original);
                      setOpenCellInformationModal(true);
                    }}
                  />
                </>
              )}
            </Flex>
          );
        },
        footer: (props) => props.column.id,
        size: 10,
      }),
      table.createDataColumn((row) => row?.destination, {
        id: "destination",
        header: () => <span>Destination</span>,
        footer: (props) => props.column.id,
      }),
    ],
    []
  );

  // eslint-disable-next-line
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

  // eslint-disable-next-line
  useEffect(() => {
    setData(selectedAsset?.table);
  }, [selectedAsset]);

  const addNewRow = ({
    date,
    status,
    destination,
    confirmed,
    officeNotes,
  }: any) => {
    setData((prev: any) => [
      {
        id: v4(),
        date,
        status,
        destination,
        confirmed,
        officeNotes,
      },
      ...prev,
    ]);
  };

  const editRow = (data: AssetTableObject) => {
    setData((old: any) =>
      old.map((item: AssetTableObject, index: number) => {
        if (index === selectedCellIndex) {
          return data;
        }
        return item;
      })
    );
  };

  const save = async () => {
    await updateTable(_data.id, data);
    dispatch(replaceSelectedAssetTable({ table: data }));
    setShowSaveButton(false);
  };

  // eslint-disable-next-line
  useEffect(() => {
    if (data) {
      setShowSaveButtonToggle(true);
    }
    if (showSaveButtonToggle) {
      setShowSaveButton(true);
    }
  }, [data]);

  return (
    <>
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
            <Button onClick={() => setOpenAddModal(true)}>Add</Button>
            {showSaveButton && (
              <Button primary onClick={save} margin="0">
                Save
              </Button>
            )}
          </div>
        </Flex>
        <div style={{ overflow: "auto" }}>
          <table style={{ width: "100%" }}>
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
      <RowModal
        title="Add new row"
        open={openAddModal}
        setOpen={setOpenAddModal}
        onSubmit={({
          date,
          status,
          destination,
          confirmed,
          officeNotes,
        }: any) => {
          addNewRow({ date, status, destination, confirmed, officeNotes });
        }}
        save={() => save()}
      ></RowModal>
      <RowModal
        title="Edit row"
        open={openEditModal}
        setOpen={setOpenEditModal}
        onSubmit={(newData: AssetTableObject) => {
          editRow(newData);
        }}
        save={() => save()}
        selectedCellData={selectedCellData}
      ></RowModal>
      {selectedCellData && (
        <CellInformationModal
          open={openCellInformationModal}
          setOpen={setOpenCellInformationModal}
          cellData={selectedCellData}
        ></CellInformationModal>
      )}
    </>
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
    <input
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
