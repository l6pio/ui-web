import Typography from "@material-ui/core/Typography";
import React from "react";

export const Copyright = () =>
    <Typography
        variant="body2"
        color="textSecondary"
        align="center"
        style={{marginTop: "20px", marginBottom: "20px"}}
    >
        {`Copyright © l6p.io ${new Date().getFullYear()}.`}
    </Typography>;
