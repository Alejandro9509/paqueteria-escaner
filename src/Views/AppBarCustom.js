import {AppBar, Typography} from "@material-ui/core";
import React from "react";

export default function AppBarCustom() {
    return (
        <AppBar elevation={0} position="static" style={{padding: "20px", color: "white"}}>
            <Typography variant={"h5"}>
                Operador: {localStorage.getItem("Nombre")}
            </Typography>
            version  0.0.40
        </AppBar>
    )

}