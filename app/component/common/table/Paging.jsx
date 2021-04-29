import React, {useEffect} from "react";

const Paging = (defaultOrderBy, defaultOrder) => {
    const [data, setData] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [pageCount, setPageCount] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(0);
    const [orderBy, setOrderBy] = React.useState(defaultOrderBy);
    const [order, setOrder] = React.useState(defaultOrder);
    const [trigger, setTrigger] = React.useState(false);

    useEffect(() => setTrigger(!trigger), [page, orderBy, order]);

    return {
        data, setData,
        page, setPage,
        pageCount, setPageCount,
        rowsPerPage, setRowsPerPage,
        orderBy, setOrderBy,
        order, setOrder,
        trigger, setTrigger,
    };
};

export default Paging;
