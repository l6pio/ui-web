const createDiv = (height) => {
    let div = document.createElement("div");
    div.style.top = "0";
    div.style.right = "0";
    div.style.width = "5px";
    div.style.position = "absolute";
    div.style.cursor = "col-resize";
    div.style.userSelect = "none";
    div.style.height = height + "px";
    return div;
};

const paddingDiff = (col) => {
    if (getStyleVal(col, "box-sizing") === "border-box") {
        return 0;
    }
    let padLeft = getStyleVal(col, "padding-left");
    let padRight = getStyleVal(col, "padding-right");
    return parseInt(padLeft) + parseInt(padRight);
};

const getStyleVal = (elm, css) => {
    return window.getComputedStyle(elm, null).getPropertyValue(css);
};

const setListeners = (div) => {
    let pageX, curCol, nxtCol, curColWidth, nxtColWidth;

    div.addEventListener("mousedown", e => {
        curCol = e.target.parentElement;
        nxtCol = curCol.nextElementSibling;
        pageX = e.pageX;

        let padding = paddingDiff(curCol);
        curColWidth = curCol.offsetWidth - padding;
        if (nxtCol) {
            nxtColWidth = nxtCol.offsetWidth - padding;
        }
    });

    div.addEventListener("mouseover", e => {
        e.target.style.borderRight = "2px solid #272c34";
    });

    div.addEventListener("mouseout", e => {
        e.target.style.borderRight = "";
    });

    document.addEventListener("mousemove", e => {
        if (curCol) {
            let diffX = e.pageX - pageX;
            if (nxtCol) {
                nxtCol.style.width = (nxtColWidth - (diffX)) + "px";
            }
            curCol.style.width = (curColWidth + diffX) + "px";
        }
    });

    document.addEventListener("mouseup", () => {
        curCol = undefined;
        nxtCol = undefined;
        pageX = undefined;
        nxtColWidth = undefined;
        curColWidth = undefined;
    });
};

const resizable = (table) => {
    let row = table.getElementsByTagName("tr")[0];
    let cols = row ? row.children : undefined;
    if (!cols) return;

    table.style.overflow = "hidden";
    let tableHeight = table.offsetHeight;

    for (let i = 0; i < cols.length - 1; i++) {
        if (cols[i].id === "checkbox" || cols[i].id === "actions") {
            continue;
        }
        let div = createDiv(tableHeight);
        cols[i].appendChild(div);
        cols[i].style.position = "relative";
        setListeners(div);
    }
};

export default resizable;
