import React from "react";
import clsx from "clsx";
import {lighten, makeStyles} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const useToolbarStyles = makeStyles(theme => ({
    root: {
        padding: "0 15px 0 20px",
        borderBottom: "2px solid #272C34",
    },
    highlight: {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
    },
    title: {
        flex: "1 1 100%",
    }
}));

const LTableToolbar = ({title, selected, toolbar}) => {
    const classes = useToolbarStyles();
    const totalSelected = selected.length;

    return (
        <Toolbar className={clsx(classes.root, {
            [classes.highlight]: totalSelected > 0,
        })}>
            {totalSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1">
                    {totalSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle">
                    {title}
                </Typography>
            )}
            {toolbar && toolbar(selected)}
        </Toolbar>
    );
};

export default LTableToolbar;
