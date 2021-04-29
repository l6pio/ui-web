import React, {useEffect} from "react";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import LTableToolbar from "./LTableToolbar";
import LTableHead from "./LTableHead";
import resizable from "./Resizer";
import Pagination from "@material-ui/lab/Pagination";
import Typography from "@material-ui/core/Typography";
import {isEmpty} from "../../../util/Lang";
import Box from "@material-ui/core/Box";
import TableContainer from "@material-ui/core/TableContainer";

const useStyles = makeStyles(() => ({
    speedDialCommon: {
        position: "absolute",
        top: "-1px",
        right: "3px",
        "& .MuiSpeedDial-fab": {
            boxShadow: "none",
            cursor: "inherit",
        },
        "& .MuiFab-primary": {
            color: "rgba(0, 0, 0, 0.54)",
            backgroundColor: "inherit",
        },
        "& .MuiSpeedDial-actions": {
            marginTop: -1,
            paddingRight: 28,
        },
    },
    speedDialUp: {
        top: "-116px",
    },
    speedDialDown: {
        top: "6px",
    },
}));

const LTable = ({
    id, title, columns, rows, toolbar, showHeader,
    actions, onRowClick, onColClick,
    rowStyle, multiSelect,
    emptyHint, paging, flat,
}) => {
    const classes = useStyles();
    const [selected, setSelected] = React.useState([]);
    const [actionsOpen, setActionsOpen] = React.useState("");

    const emptyRows = paging.rowsPerPage > 0 ? paging.rowsPerPage - rows.length : 0;

    const onSelectAll = checked => {
        setSelected(checked ? rows.map(r => r.id) : []);
    };

    const onSort = columnId => {
        let order = paging.orderBy === columnId && paging.order === "-" ? "" : "-";
        paging.setOrder(order);
        paging.setOrderBy(columnId);
        onColClick && onColClick(columnId, order);
    };

    const onSelectClick = (id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    if (showHeader) {
        useEffect(() => resizable(document.getElementById(id)), [columns]);
    }

    return (
        <Paper elevation={flat ? 0 : 1}>
            {title ? <LTableToolbar title={title} selected={selected} toolbar={toolbar}/> : null}
            <TableContainer component={Box}>
                <Table size="medium" id={id}>
                    {showHeader ?
                        <LTableHead
                            columns={columns}
                            actions={actions}
                            selected={selected}
                            order={paging.order}
                            orderBy={paging.orderBy}
                            rowCount={rows.length}
                            onSelectAll={onSelectAll}
                            onSort={onSort}
                            multiSelect={multiSelect}
                        /> : null}
                    <TableBody>
                        {rows.map(row => {
                            const isRowSelected = selected.includes(row.id);
                            return (
                                <TableRow
                                    hover
                                    key={row.id}
                                    selected={isRowSelected}
                                >
                                    {multiSelect ?
                                        <TableCell id="checkbox" style={{width: "48px", padding: "0 5px 0 9px"}}>
                                            <Checkbox checked={isRowSelected} onClick={() => onSelectClick(row.id)}/>
                                        </TableCell>
                                        :
                                        <TableCell id="checkbox" style={{width: "20px", padding: 0}}/>
                                    }
                                    {columns.map((col, colIdx) => {
                                        const defaultStyle = {wordBreak: "break-all"};
                                        const padding = colIdx === 0 ? {padding: "16px 0"} : {padding: "16px"};
                                        const content = col.display ? col.display(row[col.id]) : row[col.id];
                                        return (
                                            <TableCell
                                                key={col.id}
                                                align={col.align || "left"}
                                                style={rowStyle ? {...defaultStyle, ...padding, ...rowStyle(row)} : {...defaultStyle, ...padding}}
                                                onClick={() => onRowClick ? onRowClick(row) : null}
                                            >
                                                {content}
                                            </TableCell>
                                        );
                                    })}
                                    {actions && actions.length > 0 ?
                                        <TableCell id="actions" padding="checkbox" style={{position: "relative"}}>
                                            {actions.length > 1 ?
                                                <SpeedDial
                                                    key={row.id}
                                                    ariaLabel="SpeedDial"
                                                    className={clsx(classes.speedDialCommon)}
                                                    icon={<MoreVertIcon/>}
                                                    open={actionsOpen === row.id}
                                                    direction={"left"}
                                                    FabProps={{size: "small"}}
                                                    onOpen={(event, reason) => (reason === "mouseEnter") && setActionsOpen(row.id)}
                                                    onClose={() => (actionsOpen === row.id) && setActionsOpen("")}
                                                >
                                                    {actions.map(fn => {
                                                        let action = fn(row);
                                                        return action ?
                                                            <SpeedDialAction
                                                                key={action.name}
                                                                icon={action.icon}
                                                                tooltipTitle={action.name}
                                                                tooltipPlacement="top"
                                                                title={action.name}
                                                                onClick={action.onClick}
                                                            /> : null;
                                                    }).filter(v => v != null)}
                                                </SpeedDial>
                                                :
                                                (() => {
                                                    let action = actions[0](row);
                                                    return (
                                                        <IconButton
                                                            style={{padding: "10px"}}
                                                            onClick={action.onClick}
                                                        >
                                                            {action.icon}
                                                        </IconButton>
                                                    );
                                                })()
                                            }
                                        </TableCell> : null
                                    }
                                </TableRow>
                            );
                        })}
                        {emptyRows > 0 && (
                            <TableRow style={{height: 53 * emptyRows}}>
                                <TableCell colSpan={columns.length + 2} align="center">
                                    {isEmpty(rows) ?
                                        <Typography variant="body2">
                                            {emptyHint}
                                        </Typography>
                                        : ""
                                    }
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {paging.page > 0 ?
                <Pagination
                    count={paging.pageCount}
                    color="primary"
                    showFirstButton
                    showLastButton
                    style={{padding: "10px", display: "flex", justifyContent: "flex-end"}}
                    onChange={(event, value) => paging.setPage(value)}
                /> : null
            }
        </Paper>
    );
};

export default LTable;
