import React, { Component } from 'react';
import {
  Button,
  Grid,
  MenuItem,
  Paper,
  Typography,
  TextField,
  Box,
  Container,
  Divider,
  createMuiTheme,
  ThemeProvider,
  CssBaseline
} from "@material-ui/core";
import { obtenerGuiaId } from "../../Util/Contexts/GuiaContext";
import Noty from "noty";
import ListadoProductos from "../../Components/Scanner/ListadoGuias";
import { getUniqueListBy } from "../../Util/Util";
import ErrorAudio from "../../Assets/sounds/Error.wav";
import SuccesAudio from "../../Assets/sounds/Success.wav";
import {
  modificarInformes,
  obtenerInformesIdEscaner,
  obtenerInformesPorOperador,
  obtenerInformesPorRangoFechas, 
  cargaAgregarListadoBorrador,
  cargaObtenerListadoBorrador
} from "../../Util/Contexts/InformesContext";
import TableDialog from "./TableDialog";
import AppBarCustom from "../AppBarCustom";
import 'date-fns';  
import { format } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns'; 
import { MuiPickersUtilsProvider } from '@material-ui/pickers';  
import { DatePicker } from '@material-ui/pickers'; 
import { es } from 'date-fns/locale';  

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
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h5: {
        fontWeight: 500,
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
})
// Estilos personalizados
const styles = {
    container: {
      paddingTop: 15,
      paddingBottom: 15,
    },
    paper: {
      padding: 15,
      marginBottom: 15,
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 15,
      gap: 16,
    },
    headerInfo: {
      backgroundColor: '#FF9933',
      padding: '12px 15px',
    },
    resumeLoader: {
        backgroundColor: '#F3F3F3',
        padding: '12px 15px',
    },
    divider: {
      margin: '14px 0',
    },
  };

// Helpers
const showSuccess = (mensaje) => {
  new Noty({
    type: "success",
    layout: "topCenter",
    text: mensaje,
    timeout: 3000,
    theme: 'metroui',
  }).show();
};

// Helpers
const showError = (mensaje) => {
    new Noty({
      type: "error",
      layout: "topCenter",
      text: mensaje,
      timeout: 3000,
      theme: 'metroui',
    }).show();
  };

const playAudio = (audioFile) => new Audio(audioFile).play();
const vibrateDevice = () => window.navigator?.vibrate?.(300);

const today = new Date();

let scannerInput = "";
let lastClear = 0;

class Carga extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      informeSeleccionado: null,
      idGuia: "",
      productosListadoCarga: [],
      dataInformes: [],
      totalPaquetes: [],
      productosFaltantes: [],
      openTableDialog: false,
      fechaInicial: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7), 
      fechaFinal: today
    };
    
    this.bindMethods();
  }

  bindMethods() {
    this.onChangeGuia = this.onChangeGuia.bind(this);
    this.getAllInformes = this.getAllInformes.bind(this);
    this.handleEliminarProducto = this.handleEliminarProducto.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.obtenerTotalPaquetes = this.obtenerTotalPaquetes.bind(this);
    this.obtenerFaltantes = this.obtenerFaltantes.bind(this);
    this.generarBorrador = this.generarBorrador.bind(this);
    this.handleInformeChange = this.handleInformeChange.bind(this);
  }

  componentDidMount() {
    this.getAllInformes();
    document.addEventListener("keypress", this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener("keypress", this.handleKeyPress);
  }

  handleKeyPress(e) {
    clearTimeout(lastClear);
    lastClear = window.setTimeout(() => { scannerInput = ""; }, 500);
    
    scannerInput += e.key;
    
    if (scannerInput.includes("s")) {
      this.onChangeGuia(scannerInput.replace("s", ""), false);
      scannerInput = "";
    }
  }



  handleInformeChange(event) {
    const informeId = event.target.value;
    obtenerInformesIdEscaner(informeId).then(({ data }) => {
      this.setState({
        informeSeleccionado: data,
        productosListadoCarga: [],
      }, () => {
        cargaObtenerListadoBorrador(data.m_nIdInforme).then(({ data }) => {
          data.forEach((item) => this.onChangeGuia(item.qr, true));
        });
      });
    });
  }

  getAllInformes() {
    const { fechaInicial, fechaFinal } = this.state;
    
    const fechaInicialFormateado = format(new Date(fechaInicial.getFullYear(), fechaInicial.getMonth(), fechaInicial.getDate()) , 'yyyy-MM-dd' )
    const fechaFinalFormateado   = format(new Date(fechaFinal.getFullYear(), fechaFinal.getMonth(), fechaFinal.getDate()) , 'yyyy-MM-dd' )
    if (!fechaInicialFormateado || !fechaFinalFormateado) return;

    obtenerInformesPorRangoFechas(fechaInicialFormateado, fechaFinalFormateado)
    .then(({ data }) => this.setState({ dataInformes: data }))
    .catch(error => {
      console.error("Error al obtener informes:", error)
        obtenerInformesPorOperador(1) .then(({ data }) => this.setState({ dataInformes: data }))
        .catch(error => console.error("Error al obtener informes del operador:", error))
    });
  }

  obtenerTotalPaquetes() {
    const { productosListadoCarga } = this.state;
    const paquetesUnicos = productosListadoCarga.reduce((mapa, producto) => {
      producto.m_arrClsDetalle.forEach(detalle => {
        mapa[detalle.m_nIdEmbarqueDetalle] = detalle;
      });
      return mapa;
    }, {});

    this.setState({ totalPaquetes: Object.values(paquetesUnicos) });
  }

  async onChangeGuia(idGuia, isFromBorrador) {
    const informacionQR = idGuia.split("-");
    if (informacionQR.length !== 3) return;

    const [idGuiaNum, idEmbarqueDetalle, index] = informacionQR.map(Number);
    const { productosListadoCarga, informeSeleccionado } = this.state;

    try {
      const { data } = await obtenerGuiaId(idGuiaNum);
      
      // Validar guía
      if (typeof data === 'string' || data.m_nIdCiudadDestino !== informeSeleccionado.m_nIdCiudadDestino) {
        vibrateDevice();
        playAudio(ErrorAudio);
        showSuccess("Guía no encontrada o el destino del informe no corresponde al destino de la guía");
        return;
      }

      // Verificar si el paquete ya fue registrado
      if (productosListadoCarga.some(m => 
        m.idEmbarqueDetalle === idEmbarqueDetalle && m.index === index
      )) {
        showSuccess("El paquete ya fue registrado");
        vibrateDevice();
        playAudio(ErrorAudio);
        return;
      }

      const ctdPaquetesDeGuiaTotales = data.m_arrClsDetalle.reduce((total, arg) => total + +arg.ctd, 0);
      const ctdPaquetesDeGuiaEscaneados = productosListadoCarga.filter(a => a.m_nIdGuia === idGuiaNum).length;

      if (ctdPaquetesDeGuiaEscaneados >= ctdPaquetesDeGuiaTotales) return;

      const detalle = data.m_arrClsDetalle.find(r => r.m_nIdEmbarqueDetalle === idEmbarqueDetalle);
      const numeracion = `${index + 1} - ${detalle.ctd}`;

      const nuevoProducto = {
        ...data,
        numeracion,
        idEmbarqueDetalle,
        index,
        m_xPeso: detalle.m_xPeso,
        cantidadSola: detalle.ctd
      };

      const nuevosProductos = [...productosListadoCarga, nuevoProducto];
      
      this.setState({
        idGuia: "",
        productosListadoCarga: nuevosProductos
      }, () => {
        this.obtenerTotalPaquetes();
        if (!isFromBorrador) this.generarBorrador();
        playAudio(SuccesAudio);
      });

    } catch (error) {
      console.error("Error al procesar guía:", error);
    }
  }

  handleEliminarProducto(e, producto) {
    e.preventDefault();
    const nuevosProductos = this.state.productosListadoCarga.filter(i => i !== producto);
    this.setState({ productosListadoCarga: nuevosProductos }, this.obtenerTotalPaquetes);
  }

  async onSubmit(event) {
    event.preventDefault();
    const { productosListadoCarga, informeSeleccionado } = this.state;
    
    const paquetesFaltantes = this.obtenerFaltantes();
    if (paquetesFaltantes.length > 0) {
      this.setState({ openTableDialog: true, productosFaltantes: paquetesFaltantes });
      return;
    }

    try {
      const params = {
        ...informeSeleccionado,
        m_arrClsProInformeGuia: getUniqueListBy([
          ...informeSeleccionado.m_arrClsProGuia,
          ...getUniqueListBy(productosListadoCarga, "m_nIdGuia")
        ], "m_nIdGuia")
      };

      const { data } = await modificarInformes(informeSeleccionado.m_nIdInforme, params);
      showSuccess(data);
      
      this.setState({
        informeSeleccionado: null,
        idGuia: "",
        productosListadoCarga: [],
        dataInformes: []
      }, this.getAllInformes);

    } catch (error) {
      console.error("Error al enviar informe:", error);
      showSuccess("Error al guardar el informe");
    }
  }

  obtenerFaltantes() {
    const { productosListadoCarga } = this.state;
    const embarques = {};

    productosListadoCarga.forEach(producto => {
      const { idEmbarqueDetalle, numeracion, m_nFolioGuia } = producto;
      const descripcion = producto.m_arrClsDetalle[0]?.m_sDescripcion || "";
      const [numeracionExistente, numeracionTotal] = numeracion.split(' - ').map(Number);

      if (!embarques[idEmbarqueDetalle]) {
        embarques[idEmbarqueDetalle] = { 
          existentes: [], 
          total: numeracionTotal, 
          folio: m_nFolioGuia, 
          descripcion 
        };
      }
      embarques[idEmbarqueDetalle].existentes.push(numeracionExistente);
    });

    return Object.entries(embarques).reduce((result, [idEmbarqueDetalle, datos]) => {
      const { existentes, total, folio, descripcion } = datos;
      const todasNumeraciones = Array.from({ length: total }, (_, i) => i + 1);
      const faltantes = todasNumeraciones.filter(n => !existentes.includes(n));

      if (faltantes.length > 0) {
        result.push({
          idEmbarqueDetalle,
          faltantes: faltantes.map(f => `${f} - ${total}`),
          descripcion,
          folio
        });
      }
      
      return result;
    }, []);
  }

  handleDialogClose() {
    this.setState({ openTableDialog: false });
  }

  async generarBorrador() {
    const { productosListadoCarga, informeSeleccionado } = this.state;
    
    if (!productosListadoCarga?.length) {
      showSuccess("No hay productos para generar borrador");
      return;
    }

    const listaIgr = productosListadoCarga.map(producto => {
      const numeracion = parseInt(producto.numeracion.split(" - ")[0]) - 1;
      return `${producto.m_nIdGuia}-${producto.idEmbarqueDetalle}-${numeracion}`;
    });

    try {
      const { data } = await cargaAgregarListadoBorrador(informeSeleccionado.m_nIdInforme, listaIgr);
      showSuccess(data);
    } catch (error) {
      console.error("Error al generar borrador:", error);
      showSuccess("Error al generar borrador");
    }
  }

  render() {
    const {
      informeSeleccionado,
      productosListadoCarga,
      dataInformes,

      openTableDialog,
      productosFaltantes
    } = this.state;

    const pesoTotal = productosListadoCarga.reduce((sum, item) => sum + parseFloat(item.m_xPeso || 0), 0);
    const totalPaquetes = productosListadoCarga.length + (informeSeleccionado?.m_arrClsProGuia.length || 0);
    const isSubmitDisabled = !productosListadoCarga?.length;

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBarCustom />
        
        <Container maxWidth="lg" style={styles.container}>
          <TableDialog
            open={openTableDialog}
            onClose={this.handleDialogClose}
            data={productosFaltantes}
          />

          <form onSubmit={this.onSubmit}>
            <Grid container spacing={3}>
              {/* Filtros */}
              <Grid item xs={12}>
                <Paper elevation={3} style={styles.paper}>
                  <Typography variant="h5" gutterBottom>
                    Filtros de Búsqueda
                  </Typography>
                  <Divider style={styles.divider} />
                  
                  <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={6}>
                        <DatePicker
                            label="Fecha Inicial"
                            value={this.state.fechaInicial}
                            format='dd-MM-yyyy'
                            onChange={(newValue) => {
                                if (newValue) {
                               

                                // Guarda como objeto Date, no como string
                                this.setState({ fechaInicial: newValue }, this.getAllInformes);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth margin="dense" variant="outlined" />
                            )}
                            />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <DatePicker
                            label="Fecha Final"
                            value={this.state.fechaFinal}
                            format='dd-MM-yyyy'
                            onChange={(newValue) => {
                                if (newValue) {
                                  
                                  this.setState({ fechaFinal: newValue }, this.getAllInformes);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth margin="dense" variant="outlined" />
                            )}
                            />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          select
                          onChange={this.handleInformeChange}
                          fullWidth
                          variant="outlined"
                          margin="normal"
                          label="Seleccionar Informe"
                          value={informeSeleccionado?.m_nIdInforme || ""}
                          id="informeSeleccionado"
                        >
                          {dataInformes
                            .slice()
                            .sort((a, b) => a.m_sFolioInforme.localeCompare(b.m_sFolioInforme))
                            .map(option => (
                              <MenuItem 
                                key={option.m_nIdInforme} 
                                value={option.m_nIdInforme}
                                style={{ minHeight: 'auto' }}
                              >
                                <Box>
                                  <Typography variant="body1">{option.m_sFolioInforme}</Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    {option.m_sCiudadDestino} - {option.m_dFecha}
                                  </Typography>
                                </Box>
                              </MenuItem>
                            ))}
                        </TextField>
                      </Grid>
                    </Grid>
                  </MuiPickersUtilsProvider>
                </Paper>
              </Grid>

              {/* Información del Informe */}
              {informeSeleccionado && (
                <Grid item xs={12}>
                  <Paper elevation={3} style={{ ...styles.paper}}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="h6">
                          <Box fontWeight="fontWeightBold">Folio:</Box>
                          {informeSeleccionado.m_sFolioInforme}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography variant="h6">
                          <Box fontWeight="fontWeightBold">Origen:</Box>
                          {informeSeleccionado.m_sCiudadOrigen}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography variant="h6">
                          <Box fontWeight="fontWeightBold">Destino:</Box>
                          {informeSeleccionado.m_sCiudadDestino}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              )}

              {/* Resumen */}
              <Grid item xs={12}>
                <Paper elevation={3} style={styles.paper}>
                  <Typography variant="h5" gutterBottom>
                    Resumen de Carga
                  </Typography>
                  <Divider style={styles.divider} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper elevation={0} style={{ padding: 16, backgroundColor: '#F3F3F3' }}>
                        <Typography variant="subtitle1" color="textSecondary">
                          Total Paquetes
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {totalPaquetes}
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper elevation={0} style={{ padding: 16, backgroundColor: '#F3F3F3' }}>
                        <Typography variant="subtitle1" color="textSecondary">
                          Peso Total
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {pesoTotal.toFixed(4)} kg
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper elevation={0} style={{ padding: 16, backgroundColor: '#F3F3F3' }}>
                        <Typography variant="subtitle1" color="textSecondary">
                          Guías Escaneadas
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {getUniqueListBy(productosListadoCarga, "m_nIdGuia").length}
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper elevation={0} style={{ padding: 16, backgroundColor: '#F3F3F3' }}>
                        <Typography variant="subtitle1" color="textSecondary">
                          Paquetes Escaneados
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {productosListadoCarga.length}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Listado de Productos */}
              <Grid item xs={12}>
                <Paper elevation={3} style={styles.paper}>
                  <Typography variant="h5" gutterBottom>
                    Detalle de Productos Escaneados
                  </Typography>
                  <Divider style={styles.divider} />
                  
                  <ListadoProductos
                    productosListado={productosListadoCarga}
                    handleEliminarProducto={this.handleEliminarProducto}
                    carga={true}
                  />
                </Paper>
              </Grid>

              {/* Acciones */}
              <Grid item xs={12}>
                <Box style={styles.buttonGroup}>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    disabled={isSubmitDisabled}
                    onClick={this.generarBorrador}
                    style={{ flex: 1 }}
                  >
                    <Box display="flex" alignItems="center">
                      <Box mr={1}>💾</Box>
                      Generar Borrador
                    </Box>
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                   
                    size="large"
                    disabled={isSubmitDisabled}
                    style={{ flex: 1 }}
                  >
                    <Box display="flex" alignItems="center">
                      <Box mr={1}>✅</Box>
                      Finalizar Carga
                    </Box>
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Container>
      </ThemeProvider>
    );
  }
}

Carga.propTypes = {
  // Definir PropTypes si es necesario
};

export default Carga;