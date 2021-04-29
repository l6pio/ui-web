import React, {useEffect} from "react";
import {connect} from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";
import withWidth from "@material-ui/core/withWidth";
import {isWidthUp} from "@material-ui/core";
import {Label, LocalEvent} from "../../Const";
import Popper from "@material-ui/core/Popper";
import Grow from "@material-ui/core/Grow";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles(() => ({
    search: {
        padding: "0 4px",
        margin: "0 11px 0 0",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#616161",
    },
    searchTextField: {
        flex: 1,
        color: "#FFFFFF",
        transition: "width 0.25s ease-out",
    },
    searchIconBtn: {
        padding: 5,
        color: "#FFFFFF",
    },
    clearBtn: {
        padding: 5,
        color: "#FFFFFF",
    },
}));

const SearchBar = ({width}) => {
    const classes = useStyles();
    const [text, setText] = React.useState("");
    const [queryTimer, setQueryTimer] = React.useState(0);
    const [menuItems, setMenuItems] = React.useState([]);
    const anchorRef = React.useRef(null);
    const upMd = isWidthUp("md", width);

    useEffect(() => {
        const onClearQuery = () => setText("");
        const onSetQueryText = v => {
            setText(v);
        };
        const onSearchMenuItems = data => setMenuItems(data);

        LocalEvent.on("clear query", onClearQuery);
        LocalEvent.on("set query text", onSetQueryText);
        LocalEvent.on("search menu items", onSearchMenuItems);

        // 通知其它组件 Search Bar 已经准备好接收消息了。
        LocalEvent.emit("search bar mounted");
        return () => {
            LocalEvent.removeListener("clear query", onClearQuery);
            LocalEvent.removeListener("set query text", onSetQueryText);
            LocalEvent.removeListener("search menu items", onSearchMenuItems);
        };
    }, []);

    const setQueryText = v => {
        if (queryTimer) {
            clearTimeout(queryTimer);
        }

        setText(v);
        setQueryTimer(setTimeout(() => {
            LocalEvent.emit("search query", v);
        }, 1000));
    };

    return (
        <Paper className={classes.search}>
            <InputBase
                ref={anchorRef}
                className={classes.searchTextField}
                style={{width: upMd ? 250 : 190}}
                placeholder={Label.Search}
                value={text}
                onChange={e => setQueryText(e.target.value)}
                startAdornment={
                    <SearchIcon style={{marginRight: "5px"}}/>
                }
                endAdornment={
                    <IconButton
                        size="small"
                        className={classes.clearBtn}
                        onClick={() => setQueryText("")}
                    >
                        <ClearIcon style={{fontSize: "16px"}}/>
                    </IconButton>
                }
            />
            <Popper open={menuItems.length > 0} anchorEl={anchorRef.current} placement={"bottom-start"} role={undefined} transition disablePortal>
                {({TransitionProps}) => (
                    <Grow
                        {...TransitionProps}
                        style={{transformOrigin: "center top", zIndex: 300}}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={() => setMenuItems([])}>
                                <MenuList autoFocusItem={menuItems.length > 0} id="menu-list">
                                    {menuItems.map(v =>
                                        <MenuItem key={v.id} onClick={() => {
                                            LocalEvent.emit("search menu selected", v);
                                            setText(v.name);
                                            setMenuItems([]);
                                        }}>{v.name}</MenuItem>
                                    )}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </Paper>
    );
};

export default connect()(withWidth()(SearchBar));
