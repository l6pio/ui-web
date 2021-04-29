import React, {Fragment} from "react";
import Popover from "@material-ui/core/Popover";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
    popover: {
        pointerEvents: "none",
    },
    paper: {
        padding: theme.spacing(1),
        maxWidth: "250px",
        color: "white",
        backgroundColor: "rgba(39, 44, 52, 0.8)",
    },
}));

export const LPopper = ({label, description}) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    return (
        <Fragment>
            <Typography
                aria-owns={open ? "mouse-over-popover" : undefined}
                aria-haspopup="true"
                onMouseEnter={(event) => setAnchorEl(event.currentTarget)}
                onMouseLeave={() => setAnchorEl(null)}
            >
                {label}
            </Typography>
            <Popover
                id="mouse-over-popover"
                className={classes.popover}
                classes={{
                    paper: classes.paper,
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                onClose={() => {
                    setAnchorEl(null);
                }}
                elevation={3}
                disableRestoreFocus
            >
                <Typography variant="caption">{description}</Typography>
            </Popover>
        </Fragment>
    );
};
