import React from "react";
import {connect} from "react-redux";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import withWidth from "@material-ui/core/withWidth";
import {isWidthUp} from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MenuIcon from "@material-ui/icons/Menu";
import {SaveLeftMenuId} from "../../reducer/menu";
import Typography from "@material-ui/core/Typography";
import ScheduleIcon from "@material-ui/icons/Schedule";
import DashboardIcon from "@material-ui/icons/Dashboard";
import NotesIcon from "@material-ui/icons/Notes";
import {useHistory} from "react-router-dom";

const LeftMenuWidth = 230;

const useLeftMenuBtnStyles = makeStyles(theme => ({
    button: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: "none",
    },
}));

const useLeftMenuStyles = makeStyles(theme => ({
    menuPaper: {
        width: LeftMenuWidth,
        backgroundColor: "#f8f9fa",
    },
    menuHeader: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1, 0, 2.5),
        ...theme.mixins.toolbar,
        justifyContent: "flex-end",
    },
}));

const menuItems = {
    10: {
        label: <Typography variant="body1">{"Job"}</Typography>,
        path: "/",
        icon: <ScheduleIcon/>
    },
    20: {
        label: <Typography variant="body1">{"Overview"}</Typography>,
        path: "/overview",
        icon: <DashboardIcon/>
    },
    30: {
        label: <Typography variant="body1">{"URL"}</Typography>,
        path: "/url",
        icon: <NotesIcon/>
    }
};

export function gotoPage(history, dispatch, leftMenuId) {
    dispatch({
        type: SaveLeftMenuId,
        value: leftMenuId,
    });
    history.push(menuItems[leftMenuId].path);
}

const LeftMenuBtn = ({open, setOpen}) => {
    const classes = useLeftMenuBtnStyles();
    return (
        <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(true)}
            edge="start"
            className={clsx(classes.button, open && classes.hide)}>
            <MenuIcon/>
        </IconButton>
    );
};

const LeftMenuItem = ({history, dispatch, id, leftMenuId}) => {
    return (
        <ListItem
            button
            selected={id === leftMenuId}
            onClick={() => gotoPage(history, dispatch, id)}
        >
            <ListItemIcon>{menuItems[id].icon}</ListItemIcon>
            <ListItemText primary={menuItems[id].label}/>
        </ListItem>
    );
};

const LeftMenu = ({dispatch, width, open, close, leftMenuId}) => {
    const history = useHistory();
    const classes = useLeftMenuStyles();

    return (
        <Drawer
            variant={isWidthUp("md", width) ? "persistent" : "temporary"}
            anchor="left"
            open={open}
            onClose={close}
            classes={{
                paper: classes.menuPaper,
            }}
        >
            <div className={classes.menuHeader}>
                <IconButton onClick={close}>
                    <ChevronLeftIcon/>
                </IconButton>
            </div>
            <Divider/>
            <List>
                <div>
                    <LeftMenuItem history={history} dispatch={dispatch} id={10} leftMenuId={leftMenuId}/>
                    <LeftMenuItem history={history} dispatch={dispatch} id={20} leftMenuId={leftMenuId}/>
                    <LeftMenuItem history={history} dispatch={dispatch} id={30} leftMenuId={leftMenuId}/>
                </div>
            </List>
        </Drawer>
    );
};

const stateToProps = (state) => ({
    leftMenuId: state.leftMenuId,
});

export default connect(stateToProps)(withWidth()(LeftMenu));
export {LeftMenuBtn, LeftMenuWidth};
