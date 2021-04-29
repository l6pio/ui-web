import withStyles from "@material-ui/core/styles/withStyles";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";

export const LExpansionPanelSummary = withStyles({
    root: {
        minHeight: 48,
        "&$expanded": {
            minHeight: 48
        }
    },
    content: {
        margin: "0",
        "&$expanded": {
            margin: "0"
        }
    },
    expandIcon: {
        padding: 6,
        zIndex: 200,
    },
    expanded: {}
})(
    ExpansionPanelSummary
);
LExpansionPanelSummary.muiName = "ExpansionPanelSummary";
