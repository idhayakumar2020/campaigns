import * as React from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Delete as DeleteIcon, FilterList as FilterListIcon } from "@mui/icons-material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { visuallyHidden } from "@mui/utils";

type Order = "asc" | "desc";

export interface ColumnConfig<T> {
  id: keyof T | string;
  label: string;
  numeric?: boolean;
  disablePadding?: boolean;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
  width?: string | number;
}

export interface CommonTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  title?: string;
  rowKey: keyof T;
  selectable?: boolean;
  onDelete?: (selectedIds: string[]) => void;
  onRowClick?: (row: T) => void;
  defaultOrderBy?: keyof T;
  defaultOrder?: Order;
  rowsPerPageOptions?: number[];
  defaultDense?: boolean;
  showDenseToggle?: boolean;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  const aValue = a[orderBy];
  const bValue = b[orderBy];

  if (bValue < aValue) return -1;
  if (bValue > aValue) return 1;
  return 0;
}

function getComparator<T>(order: Order, orderBy: keyof T) {
  return order === "desc"
    ? (a: T, b: T) => descendingComparator(a, b, orderBy)
    : (a: T, b: T) => -descendingComparator(a, b, orderBy);
}

interface EnhancedTableHeadProps<T> {
  columns: ColumnConfig<T>[];
  numSelected: number;
  onRequestSort: (property: keyof T) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: keyof T;
  rowCount: number;
  selectable: boolean;
}

function EnhancedTableHead<T>(props: EnhancedTableHeadProps<T>) {
  const {
    columns,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    selectable,
  } = props;

  const createSortHandler = (property: keyof T) => () => {
    onRequestSort(property);
  };

  return (
    <TableHead>
      <TableRow>
        {selectable && (
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ "aria-label": "select all" }}
            />
          </TableCell>
        )}
        {columns.map((column) => (
          <TableCell
            key={String(column.id)}
            align={column.align || (column.numeric ? "right" : "left")}
            padding={column.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === column.id ? order : false}
            sx={{ width: column.width }}
          >
            {column.sortable !== false ? (
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : "asc"}
                onClick={createSortHandler(column.id as keyof T)}
              >
                {column.label}
                {orderBy === column.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              column.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  title: string;
  onDelete?: () => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, title, onDelete } = props;

  return (
    <Toolbar
      sx={[
        { pl: { sm: 2 }, pr: { xs: 1, sm: 1 } },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {title}
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

export default function CommonTable<T extends object>({
  data,
  columns,
  title = "Table",
  rowKey,
  selectable = true,
  onDelete,
  onRowClick,
  defaultOrderBy,
  defaultOrder = "asc",
  rowsPerPageOptions = [5, 10, 25],
  defaultDense = false,
  showDenseToggle = true,
}: CommonTableProps<T>) {
  const [order, setOrder] = React.useState<Order>(defaultOrder);
  const [orderBy, setOrderBy] = React.useState<keyof T>(
    defaultOrderBy || (columns[0]?.id as keyof T)
  );
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions[0]);
  const [dense, setDense] = React.useState(defaultDense);

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const handleRequestSort = (property: keyof T) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => String(n[rowKey]));
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_event: React.MouseEvent<unknown>, id: string) => {
    if (!selectable) return;

    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleRowClick = (row: T) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete([...selected]);
      setSelected([]);
    }
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...data]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [data, order, orderBy, page, rowsPerPage]
  );

  const getCellValue = (row: T, column: ColumnConfig<T>): React.ReactNode => {
    if (column.render) {
      return column.render(row);
    }
    const value = row[column.id as keyof T];
    return value as React.ReactNode;
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          title={title}
          onDelete={handleDelete}
        />
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table
            sx={{ minWidth: { xs: 500, sm: 750 } }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              columns={columns}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
              selectable={selectable}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const rowId = String(row[rowKey]);
                const isItemSelected = selected.includes(rowId);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => {
                      handleClick(event, rowId);
                      handleRowClick(row);
                    }}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={rowId}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                    )}
                    {columns.map((column, colIndex) => (
                      <TableCell
                        key={String(column.id)}
                        align={
                          column.align || (column.numeric ? "right" : "left")
                        }
                        padding={column.disablePadding ? "none" : "normal"}
                        component={colIndex === 0 ? "th" : undefined}
                        scope={colIndex === 0 ? "row" : undefined}
                        id={colIndex === 0 ? labelId : undefined}
                      >
                        {getCellValue(row, column)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={columns.length + (selectable ? 1 : 0)} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            px: 2,
            py: 1,
            gap: 1,
          }}
        >
          {showDenseToggle && (
            <FormControlLabel
              control={<Switch checked={dense} onChange={handleChangeDense} />}
              label="Dense"
              sx={{ ml: 0 }}
            />
          )}
          <TablePagination
            rowsPerPageOptions={[]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              ".MuiTablePagination-toolbar": {
                flexWrap: "wrap",
                justifyContent: { xs: "center", sm: "flex-end" },
              },
              ".MuiTablePagination-displayedRows": {
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}
