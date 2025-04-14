import {Divider, Grid, IconButton, Typography} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import React from "react";


export default function ListadoProductos({productosListado, handleEliminarProducto, verificarProducto, carga = true}) {
    var idVigente = 0

    return (
        <Grid container item xs={12}>
            <Grid item xs={carga ? 4 : 3}>
                <Typography variant={"h6"}>
                    Folio Guia
                </Typography>
            </Grid>
            <Grid item xs={carga ? 4 : 3}>
                <Typography variant={"h6"}>
                    Tipo entrega
                </Typography>
            </Grid>
            {
                !carga &&
                <Grid item xs={carga ? 4 : 3}>
                    <Typography variant={"h6"}>
                        Descripción
                    </Typography>
                </Grid>
            }
            <Grid item xs={carga ? 4 : 3}>
                <Typography variant={"h6"}>
                    Numeración
                </Typography>
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
                            <Grid item xs={carga ? 4 : 3} alignContent={"center"} style={{marginTop:'8px',marginBottom:'8px'}}>
                                <Typography variant={"h5"}>{producto.m_nFolioGuia}</Typography>
                            </Grid>
                            <Grid item xs={carga ? 4 : 3} style={{marginTop:'8px',marginBottom:'8px'}}>
                                <Typography variant={"h5"}>{producto.m_bEntregaEnSucursal ? "Sucursal" : "Última Milla"}</Typography>
                            </Grid>
                            {
                                !carga &&
                                <Grid item xs={carga ? 4 : 3} style={{marginTop:'8px',marginBottom:'8px'}}>
                                    <Typography variant={"h5"}>{producto.m_arrClsDetalle[producto.paqueteIndex].m_sDescripcion}</Typography>
                                </Grid>
                            }
                            <Grid item xs={2}>
                                <Typography variant={"h5"} style={{marginTop:'8px',marginBottom:'8px'}}>{producto.numeracion}</Typography>
                            </Grid>


                            {!carga && !producto.verificado  &&
                            <Grid item xs={1} justifyContent="center" alignContent={"center"}>
                                    <CancelIcon style={{fill: "red", fontSize: "small"}}/>

                            </Grid>
                            }
                            {carga &&
                                <Grid item xs={1} justifyContent="center">
                                    <IconButton onClick={(e) => handleEliminarProducto(e, producto)}
                                                style={{padding: '0px', alignItems: "center"}}>
                                        <CancelIcon style={{fill: "red", fontSize: "small"}}/>
                                    </IconButton>
                                </Grid>
                            }
                            {!carga && producto.verificado &&
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