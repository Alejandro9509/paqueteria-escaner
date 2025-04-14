import {Divider, Grid, IconButton} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import React from "react";

export default function ListadoProductosValidar({productosListado, handleEliminarProducto, verificarProducto}) {
    var idVigente = 0

    return (
        <Grid container item xs={12}>
            <Grid item xs={3}>
                <h6>Folio Guia</h6>
            </Grid>
            <Grid item xs={3}>
                <h6>Tipo entrega</h6>
            </Grid>
            <Grid item xs={3}>
                    <h6>Descripción</h6>
            </Grid>
            <Grid item xs={3}>
                <h6>Numeración</h6>
            </Grid>
            {

                productosListado.sort((a, b) => {
                    return a.m_nIdGuia - b.m_nIdGuia
                }).map((producto, index) => {
                    const agregarDivision = () => {
                        if (idVigente !== producto.m_nIdGuia) {
                            idVigente = producto.m_nIdGuia
                            return true
                        } else {
                            return false
                        }
                    }
                    return (
                        <Grid container item xs={12}>
                            {
                                agregarDivision() &&
                                <Grid container item xs={12}>
                                    <Divider style={{width:"100%", backgroundColor:"black"}} />
                                </Grid>

                            }
                            <Grid item xs={3}>
                                <p>{producto.m_nFolioGuia}</p>
                            </Grid>
                            <Grid item xs={3}>
                                <p>{producto.m_bEntregaEnSucursal ? "Sucursal" : "Última Milla"}</p>
                            </Grid>
                            <Grid item xs={3}>
                                    <p>{producto.m_arrClsDetalle[producto.paqueteIndex].m_sDescripcion}</p>
                            </Grid>
                            <Grid item xs={2}>
                                <p>{producto.numeracion}</p>
                            </Grid>


                            {producto.verificado  &&
                            <Grid item xs={1} justifyContent="center">
                                    <CancelIcon style={{fill: "red", fontSize: "small"}}/>

                            </Grid>
                            }
                           {/*  <Grid item xs={1} justifyContent="center">
                                    <IconButton onClick={(e) => handleEliminarProducto(e, producto)}
                                                style={{padding: '0px', alignItems: "center"}}>
                                        <CancelIcon style={{fill: "red", fontSize: "small"}}/>
                                    </IconButton>
                            </Grid> */}
                            {!producto.verificado &&
                            <Grid item xs={1} justifyContent="center">
                                <CheckCircleIcon style={{fill: "green", fontSize: "small"}}/>
                            </Grid>
                            }
                        </Grid>
                    )
                })
            }
        </Grid>
    )
}