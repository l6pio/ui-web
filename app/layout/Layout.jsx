import React, {Fragment} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import clsx from "clsx";
import withWidth from "@material-ui/core/withWidth";
import {isWidthUp} from "@material-ui/core";
import {createMuiTheme, makeStyles, ThemeProvider} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import {SaveLeftMenuOpen} from "../reducer/menu";
import LeftMenu, {LeftMenuBtn, LeftMenuWidth} from "../component/layout/LeftMenu";
import SearchBar from "../component/layout/SearchBar";
import SysFont from "../fonts/TT Norms Pro Regular.woff";
import SysFontBold from "../fonts/TT Norms Pro Bold.woff";
import SysFontItalic from "../fonts/TT Norms Pro Italic.woff";
import SysFontBoldItalic from "../fonts/TT Norms Pro Bold Italic.woff";
import LogoPic from "../pics/logo.png";
import {Copyright} from "./Copyright";

const theme = createMuiTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 680,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
    palette: {
        primary: {
            main: "#272C34",
        },
        secondary: {
            main: "#d81b60",
        },
        success: {
            main: "#4caf50",
        },
        info: {
            main: "#2196f3",
        },
        warning: {
            main: "#ff9800",
        },
        error: {
            main: "#f44336",
        },
        contrastText: "#fff",
    },
    props: {
        MuiTextField: {
            margin: "dense"
        },
        MuiFormControl: {
            margin: "dense"
        }
    },
    overrides: {
        MuiTextField: {
            root: {
                margin: 0
            }
        },
        MuiFormControl: {
            root: {
                margin: 0
            },
            fullWidth: {
                margin: 0
            }
        },
        MuiListItemIcon: {
            root: {
                minWidth: "48px"
            },
        },
        MuiLink: {
            root: {
                cursor: "pointer",
            }
        },
    },
    typography: {
        fontSize: 14,
        fontFamily: "TT Norms Pro",
    },
    status: {
        danger: "orange",
    },
});

const useStyles = makeStyles(theme => ({
    title: {
        [theme.breakpoints.down("xs")]: {
            width: "0",
            backgroundSize: "0 0"
        },
        height: "38px",
        backgroundImage: `url(${LogoPic})`,
        backgroundSize: "120px 38px",
        backgroundRepeat: "no-repeat",
    },
    appBar: {
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${LeftMenuWidth}px)`,
        marginLeft: LeftMenuWidth,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    main: {
        flexGrow: 1,
        marginLeft: 0,
        padding: theme.spacing(0),
        overflow: "hidden",
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    mainShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: LeftMenuWidth,
    },
    content: {
        minWidth: 430,
        maxWidth: 1180,
        marginLeft: "auto",
        marginRight: "auto",
    },
}));

const Layout = ({history, dispatch, width, location, children, leftMenuOpen}) => {
    const classes = useStyles();

    const setLeftMenuOpen = open => {
        dispatch({
            type: SaveLeftMenuOpen,
            value: open,
        });
    };

    return (
        <Fragment>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                    @font-face {
                      font-family: 'TT Norms Pro';
                      src: url(${SysFont}) format('woff');
                    }
                    @font-face {
                      font-family: 'TT Norms Pro';
                      font-weight: bold;
                      src: url(${SysFontBold}) format('woff');
                    }
                    @font-face {
                      font-family: 'TT Norms Pro';
                      font-style: italic;
                      src: url(${SysFontItalic}) format('woff');
                    }
                    @font-face {
                      font-family: 'TT Norms Pro';
                      font-weight: bold;
                      font-style: italic;
                      src: url(${SysFontBoldItalic}) format('woff');
                    }
                  `
                }}
            />
            <CssBaseline/>
            <ThemeProvider theme={theme}>
                <AppBar
                    position="sticky"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: isWidthUp("md", width) && leftMenuOpen,
                    })}
                >
                    <Toolbar>
                        <LeftMenuBtn
                            open={leftMenuOpen}
                            setOpen={setLeftMenuOpen}
                        />
                        <Box style={{flexGrow: 1}} className={classes.title}/>
                        <SearchBar/>
                    </Toolbar>
                </AppBar>

                <LeftMenu
                    history={history}
                    location={location}
                    open={leftMenuOpen}
                    close={() => setLeftMenuOpen(false)}
                />

                <main
                    className={clsx(classes.main, {
                        [classes.mainShift]: isWidthUp("md", width) && leftMenuOpen,
                    })}>
                    <Box m={2} className={classes.content}>
                        {children}
                        <Copyright/>
                    </Box>
                </main>
            </ThemeProvider>
        </Fragment>
    );
};

const stateToProps = (state) => ({
    leftMenuOpen: state.leftMenuOpen,
});

export default connect(stateToProps)(withWidth()(withRouter(Layout)));
