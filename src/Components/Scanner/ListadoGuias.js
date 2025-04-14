import React, { useMemo, useState } from "react";
import {
  Divider,
  Grid,
  IconButton,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

export default function ListadoProductos({
  productosListado,
  handleEliminarProducto,
  verificarProducto,
  carga = true
}) {
  const productosOrdenados = useMemo(
    () => [...productosListado].sort((a, b) => a.m_nIdGuia - b.m_nIdGuia),
    [productosListado]
  );

  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const abrirDialogoEliminar = (producto) => {
    setProductoAEliminar(producto);
    setDialogOpen(true);
  };

  const confirmarEliminacion = (e) => {
    handleEliminarProducto(e, productoAEliminar);
    cerrarDialogo();
  };

  const cerrarDialogo = () => {
    setDialogOpen(false);
    setProductoAEliminar(null);
  };

  let idVigente = 0;

  // Columnas según `carga`
  const columns = carga ? [4, 4, 4] : [3, 3, 3, 2, 1];
  const numeracionXs = carga ? columns[2] - 1 : columns[3];
  return (
    <Grid container item xs={12}>
      {/* Encabezado */}
      <Grid item xs={columns[0]}>
        <Typography>Folio Guia</Typography>
      </Grid>
      <Grid item xs={columns[1]}>
        <Typography>Tipo entrega</Typography>
      </Grid>
      {!carga && (
        <Grid item xs={columns[2]}>
          <Typography>Descripción</Typography>
        </Grid>
      )}
      <Grid item xs={carga ? columns[2] : columns[3]}>
        <Typography>Numeración</Typography>
      </Grid>

      {productosOrdenados.map((producto, index) => {
        const mostrarDivision = producto.m_nIdGuia !== idVigente;
        idVigente = producto.m_nIdGuia;

        return (
          <React.Fragment key={`${producto.m_nIdGuia}-${index}`}>
            {mostrarDivision && (
              <Grid container item xs={12}>
                <Divider style={{ width: "100%", backgroundColor: "black" }} />
              </Grid>
            )}

            <Grid container item xs={12} alignItems="center" style={{ margin: "8px 0" }}>
              <Grid item xs={columns[0]}>
                <Typography>{producto.m_nFolioGuia}</Typography>
              </Grid>
              <Grid item xs={columns[1]}>
                <Typography>
                  {producto.m_bEntregaEnSucursal ? "Sucursal" : "Última Milla"}
                </Typography>
              </Grid>
              {!carga && (
                <Grid item xs={columns[2]}>
                  <Typography>
                    {producto.m_arrClsDetalle?.[producto.paqueteIndex]?.m_sDescripcion ?? "-"}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={numeracionXs}>
                <Typography>{producto.numeracion}</Typography>
              </Grid>

              {carga ? (
                <Grid item xs={1} container justify="center">
                  <IconButton
                    onClick={() => abrirDialogoEliminar(producto)}
                    style={{ padding: 0 }}
                  >
                    <CancelIcon style={{ fill: "red", fontSize: "small" }} />
                  </IconButton>
                </Grid>
              ) : (
                <Grid item xs={1} container justify="center">
                  {producto.verificado ? (
                    <CheckCircleIcon style={{ fill: "green", fontSize: "small" }} />
                  ) : (
                    <CancelIcon style={{ fill: "red", fontSize: "small" }} />
                  )}
                </Grid>
              )}
            </Grid>
          </React.Fragment>
        );
      })}

      {/* Modal de confirmación */}
      <Dialog
        open={dialogOpen}
        onClose={cerrarDialogo}
        aria-labelledby="confirmar-eliminacion-titulo"
      >
        <DialogTitle id="confirmar-eliminacion-titulo">
          Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que deseas eliminar el producto escaneado con folio{" "}
            <strong>{productoAEliminar?.m_nFolioGuia}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarDialogo} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmarEliminacion} color="secondary" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}