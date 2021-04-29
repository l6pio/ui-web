import withStyles from "@material-ui/core/styles/withStyles";
import TableCell from "@material-ui/core/TableCell";

const LCell = withStyles(() => ({
    head: props => ({
        backgroundColor: "#424242",
        padding: props.p || "8px 16px",
        color: props.c || "#FFFFFF",
        width: props.width || "auto",
        minWidth: props.minwidth || "auto",
        borderBottom: props.bb || "inherit",
    }),
    body: props => ({
        fontSize: 14,
        padding: props.p || "10px 16px",
        color: props.c || "#000000",
        backgroundColor: props.bc || "#FFFFFF",
        borderBottom: props.bb || "1px solid #D0D0D0",
        wordBreak: props.wb || "normal",
        cursor: props.cursor,
    }),
}))(TableCell);

const LLabelCell = withStyles(() => ({
    body: props => ({
        backgroundColor: "#E0E0E0",
        borderBottom: props.bb || "1px solid #D0D0D0",
    }),
}))(LCell);

const LLabel2Cell = withStyles(() => ({
    body: props => ({
        backgroundColor: "#E6E6E6",
        borderBottom: props.bb || "1px solid #D0D0D0",
    }),
}))(LCell);

const LValueCell = withStyles(() => ({
    body: props => ({
        backgroundColor: "#F6F6F6",
        borderBottom: props.bb || "1px solid #D0D0D0",
    }),
}))(LCell);

export {LCell, LLabelCell, LLabel2Cell, LValueCell};
