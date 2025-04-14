import React, { Component } from 'react';
import {
  Button,
  Grid,
  Paper,
  Typography,
  Box,
  Container,
  Divider,
  createMuiTheme,
  ThemeProvider,
  CssBaseline
} from "@material-ui/core";
import ListadoProductos from "../../Components/Scanner/ListadoGuias";
import Noty from "noty";
import {
  marcarLlegadaInforme,
  obtenerInformesIdEscaner,
  descargaAgregarListadoBorrador,
  descargaObtenerListadoBorrador,
} from "../../Util/Contexts/InformesContext";
import ConfirmDialog from "./ConfirmDialog";
import AppBarCustom from "../AppBarCustom";
import ErrorAudio from "../../Assets/sounds/Error.wav";
import SuccesAudio from "../../Assets/sounds/Success.wav";

// Configuración del tema personalizado
const theme = createMuiTheme({
  palette: {
    primary: {
        main: '#FF9933',
      },
      secondary: {
        main: '#ff9100',
      },
      third: {
        main: '#0099DD',
      },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 500,
      fontSize: '1.2rem',
    },
    h4: {
      fontWeight: 400,
      fontSize: '1rem',
    },
  },
  overrides: {
    MuiPaper: {
      rounded: {
        borderRadius: 12,
      },
    },
    MuiButton: {
      root: {
        textTransform: 'none',
        padding: '10px 20px',
      },
    },
  },
});

// Estilos personalizados
const styles = {
  container: {
    paddingTop: 24,
    paddingBottom: 24,
  },
  paper: {
    padding: 24,
    marginBottom: 16,
  },
  headerInfo: {
    backgroundColor: '#f5f5f5',
    padding: '16px 24px',
  },
  buttonGroup: {
    display: 'flex',
    gap: 16,
    marginBottom: 16,
  },
  productList: {
    marginTop: 16,
  },
};

// Helpers
const showSuccess = (mensaje) => {
  new Noty({
    type: "success",
    layout: "topCenter",
    text: mensaje,
    timeout: 3000,
  }).show();
};

const showError = (mensaje) => {
  new Noty({
    type: "error",
    layout: "topCenter",
    text: mensaje,
    timeout: 8000,
  }).show();
};

const playAudio = (audioFile) => new Audio(audioFile).play();
const vibrateDevice = () => window.navigator?.vibrate?.(300);

let scannerInput = "";
let lastClear = 0;

class Descarga extends Component {
  state = {
    idQR: "",
    productosListadoDescarga: [],
    dataInformes: [],
    informe: null,
    openConfirmDialog: false,
  };

  componentDidMount() {
    document.addEventListener("keypress", this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener("keypress", this.handleKeyPress);
  }

  esEnteroValido = (string) => {
    return /^\d+$/.test(string);
  };

  handleKeyPress = (e) => {
    clearTimeout(lastClear);
    lastClear = window.setTimeout(() => { scannerInput = ""; }, 500);
    scannerInput += e.key;
    
    if (scannerInput.includes("s")) {
      this.onChangeQR(scannerInput.replace("s", ""));
      scannerInput = "";
    }
    e.preventDefault();
  };

  escanearQRProducto = (qr, isFromBorrador) => {
    const array = [...this.state.productosListadoDescarga];
    const informacionQR = qr.split("-");
    
    if (informacionQR.length === 0) {
      showError("Etiqueta no válida");
      vibrateDevice();
      playAudio(ErrorAudio);
      return;
    }

    const indexGuiaSeleccionada = array.findIndex(p => 
      p.m_nIdEmbarqueDetalle === parseInt(informacionQR[1]) && 
      p.index === parseInt(informacionQR[2])
    );

    if (indexGuiaSeleccionada >= 0) {
      array[indexGuiaSeleccionada].verificado = true;
      this.setState({
        idQR: "",
        productosListadoDescarga: array
      }, () => {
        if (!isFromBorrador) this.generarBorrador();
        playAudio(SuccesAudio);
      });
    } else {
      vibrateDevice();
      playAudio(ErrorAudio);
      showError("Verifique que la guía se encuentre asignada al informe");
    }
  };

  generarBorrador = () => {
    const datosVerificados = this.state.productosListadoDescarga.filter(
      objeto => objeto.verificado === true
    );
    
    descargaAgregarListadoBorrador(
      this.state.informe.m_nIdInforme, 
      datosVerificados
    ).then(({data}) => {
      showSuccess(data);
    }).catch(error => {
      showError("Error al generar borrador");
    });
  };

  handleEliminarProducto = (e, producto) => {
    e.preventDefault();
    const nuevosProductos = this.state.productosListadoDescarga.filter(
      i => i !== producto
    );
    this.setState({ productosListadoDescarga: nuevosProductos });
  };

  onChangeQR = (idEscaner) => {
    if (!idEscaner) return;

    if (!this.state.informe) {
      if (!this.esEnteroValido(idEscaner)) {
        showError('El código escaneado no es válido');
        vibrateDevice();
        playAudio(ErrorAudio);
        return;
      }

      if (localStorage.getItem(`informe${idEscaner}`)) {
        const state = JSON.parse(localStorage.getItem(`informe${idEscaner}`));
        this.setState(state);
        return;
      }

      obtenerInformesIdEscaner(idEscaner).then(({data}) => {
        const arrayGuias = [];
        data.m_arrClsProGuia.forEach(d => {
          d.m_arrClsDetalle.forEach((p, pindex) => {
            for (let i = 0; i < p.ctd; i++) {
              const item = JSON.parse(JSON.stringify(d));
              item.numeracion = `${i + 1} - ${p.ctd}`;
              item.verificado = d.m_nIdEstatusGuia !== 6;
              item.index = i;
              item.paqueteIndex = pindex;
              item.m_nIdEmbarqueDetalle = p.m_nIdEmbarqueDetalle;
              arrayGuias.push(item);
            }
          });
        });

        this.setState({
          idQR: "",
          informe: data,
          productosListadoDescarga: arrayGuias
        }, () => {
          descargaObtenerListadoBorrador(idEscaner).then(({data}) => {
            data.forEach((objeto) => {
              this.escanearQRProducto(objeto.qr, true);
            });
          });
        });
      }).catch(error => {
        showError('El código de informe escaneado es inválido');
        vibrateDevice();
        playAudio(ErrorAudio);
      });
    } else {
      if (this.state.productosListadoDescarga.length > 0) {
        this.escanearQRProducto(idEscaner, false);
      }
    }
  };

  handleUserResponse = (response) => {
    this.setState({ openConfirmDialog: false });
    
    if (response) {
      const now = new Date();
      const params = {
        m_dFechaLlegada: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
        m_tHoraLlegada: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      };

      marcarLlegadaInforme(this.state.informe.m_nIdInforme, params)
        .then(({data}) => {
          showSuccess(data);
          this.setState({
            idQR: "",
            productosListadoDescarga: [],
            dataInformes: [],
            informe: null
          });
        })
        .catch(error => {
          showError("Error al marcar llegada del informe");
        });
    }
  };

  handleDialogClose = () => {
    this.setState({ openConfirmDialog: false });
  };

  onCerrarInformeClick = (event) => {
    event.preventDefault();
    this.setState({ openConfirmDialog: true });
  };

  handleGuardarInformacion = (event) => {
    event.preventDefault();
    localStorage.setItem(`informe${this.state.informe.m_nIdInforme}`, JSON.stringify(this.state));
    showSuccess("Información Guardada");
    window.location.reload();
  };

  verificarProducto = (index) => {
    const array = [...this.state.productosListadoDescarga];
    array[index].verificado = true;
    this.setState({
      productosListadoDescarga: array
    });
  };

  render() {
    const { 
      informe, 
      productosListadoDescarga, 
      openConfirmDialog 
    } = this.state;

    const productosVerificados = productosListadoDescarga.filter(
      p => p.verificado
    ).length;
    const totalProductos = productosListadoDescarga.length;

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ConfirmDialog
          open={openConfirmDialog}
          onClose={this.handleDialogClose}
          message="¿Está seguro de validar la llegada de paquetes? Verifique que todos los paquetes se encuentren en bodega."
          onUserResponse={this.handleUserResponse}
        />
        
        <AppBarCustom />
        
        <Container maxWidth="md" style={styles.container}>
          {informe && (
            <Paper elevation={3} style={styles.headerInfo}>
              <Typography variant="h5" gutterBottom>
                Informe: {informe.m_sFolioInforme}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>Origen:</strong> {informe.m_sCiudadOrigen}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>Destino:</strong> {informe.m_sCiudadDestino}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          )}

          {informe && (
            <Box style={styles.buttonGroup}>
              <Button 
                variant="contained" 
                color="secondary"
                fullWidth
                onClick={this.generarBorrador}
              >
                Generar Borrador
              </Button>
              <Button 
                type="submit"
                variant="contained" 
                color="primary"
                fullWidth
                onClick={this.onCerrarInformeClick}
              >
                Validar Todos los Paquetes
              </Button>
            </Box>
          )}

          <Paper elevation={3} style={styles.paper}>
            <Typography variant="h5" gutterBottom>
              Productos ({productosVerificados}/{totalProductos} verificados)
            </Typography>
            <Divider style={{ marginBottom: 16 }} />
            
            <div style={styles.productList}>
              <ListadoProductos
                productosListado={productosListadoDescarga}
                handleEliminarProducto={this.handleEliminarProducto}
                verificarProducto={this.verificarProducto}
                carga={false}
              />
            </div>
          </Paper>
        </Container>
      </ThemeProvider>
    );
  }
}

Descarga.propTypes = {
  // Definir PropTypes si es necesario
};

export default Descarga;