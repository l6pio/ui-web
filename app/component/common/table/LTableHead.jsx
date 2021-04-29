import React from "react";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Checkbox from "@material-ui/core/Checkbox";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

const LTableHead = ({
    columns,
    actions,
    selected,
    order, orderBy,
    rowCount,
    onSelectAll,
    onSort,
    multiSelect,
}) => {
    const totalSelected = selected.length;
    return (
        <TableHead>
            <TableRow>
                {multiSelect ?
                    <TableCell id="checkbox" style={{width: "48px", padding: "0 5px 0 9px"}}>
                        <Checkbox
                            indeterminate={totalSelected > 0 && totalSelected < rowCount}
                            checked={totalSelected > 0 && totalSelected === rowCount}
                            onChange={e => onSelectAll(e.target.checked)}/>
                    </TableCell>
                    :
                    <TableCell id="checkbox" style={{width: "20px", padding: 0}}/>
                }
                {columns.map((col, idx) => (
                    <TableCell
                        key={col.id}
                        width={col.width}
                        align={col.align || "left"}
                        style={{minWidth: col.width, padding: idx === 0 ? "14px 0" : "14px 16px"}}
                        sortDirection={orderBy === col.id && (order === "" ? "asc" : "desc")}>
                        <TableSortLabel
                            active={orderBy === col.id}
                            direction={order === "" ? "asc" : "desc"}
                            IconComponent={KeyboardArrowDownIcon}
                            onClick={() => onSort(col.id)}>
                            {col.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
                {actions && actions.length > 0 ? <TableCell id="actions" padding="checkbox"/> : null}
            </TableRow>
        </TableHead>
    );
};

export default LTableHead;
