import React, {Component} from 'react';
import {
    Button,
    Grid,
    Paper,
    Typography
} from "@material-ui/core";
import ListadoProductos from "../../Components/Scanner/ListadoGuias";
import Noty from "noty";
import {
    marcarLlegadaInforme,
    obtenerInformesIdEscaner,
    descargaAgregarListadoBorrador,
    descargaObtenerListadoBorrador,

} from "../../Util/Contexts/InformesContext";
import $ from 'jquery';
import ConfirmDialog from "./ConfirmDialog";
import AppBarCustom from "../AppBarCustom"; // Import
import ErrorAudio from "../../Assets/sounds/Error.wav";
import SuccesAudio from "../../Assets/sounds/Success.wav";
function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}
function showError(mensaje) {
    new Noty({
        type: "warning",
        layout: "topCenter",
        text: mensaje,
        timeout: "8000"
    }).show()
}
window.jQuery = window.$ = $;
var scannerInput ="";
var lastClear=0;
class Descarga extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idQR: "",
            productosListadoDescarga: [],
            dataInformes: [],
            informe: null,
            openConfirmDialog: false,
        };
        this.handleUserResponse = this.handleUserResponse.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.onCerrarInformeClick = this.onCerrarInformeClick.bind(this)
        this.handleEliminarProducto = this.handleEliminarProducto.bind(this)
        this.onChangeQR = this.onChangeQR.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.handleGuardarInformacion = this.handleGuardarInformacion.bind(this)
        this.verificarProducto = this.verificarProducto.bind(this)
        this.generarBorrador = this.generarBorrador.bind(this)
        this.escanearQRProducto = this.escanearQRProducto.bind(this)


    }

    componentWillMount() {
        this.setState({informe: null})
    }

    componentDidMount() {


        document.addEventListener("keypress", this.handleKeyPress)
        console.log('DESCARGA MONTADO')
    }
    componentWillUnmount() {
        document.removeEventListener("keypress", this.handleKeyPress);
        console.log('DESCARGA DESMONTADO')
    }

    // ESTA FUNCION SE LLAMA CUANDO SE ESCANEA UN CODIGO QR DE PAQUETE
    // Y CUANDO SE RECUPERA EL BORRADOR PARA AGREGAR EL PRODUCTO GUARDADO AL LISTADO
    // LA VARIABLE isFromBorrador SERVIRA PARA QUE SE GUARDE UN BORRADOR CADA QUE SE AGREGA UN PAQUETE MIENTRAS
    // NO SE HAYA LLAMADO LA FUNCION DESDE EL BORRADOR
    escanearQRProducto(qr, isFromBorrador){
        const array = this.state.productosListadoDescarga
        const informacionQR =  qr.split("-")
        if (informacionQR.length === 0){
            showSuccess("Etiqueta no valida")
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(300);
            }
            new Audio(ErrorAudio).play()
            return
        }
        const indexGuiaSeleccionada = array.findIndex(p => { return (p.m_nIdEmbarqueDetalle === parseInt(informacionQR[1]) && p.index === parseInt(informacionQR[2]))})
        if (indexGuiaSeleccionada >= 0) {
           
            array[indexGuiaSeleccionada].verificado = true
            this.setState({
                idQR: "",
                productosListadoDescarga: array
            })
            if (!isFromBorrador){
                this.generarBorrador()
            }
            new Audio(SuccesAudio).play()
           
        } else {
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(300);
            }
            new Audio(ErrorAudio).play()
            showSuccess("Verifiqué que la guía se encuentre asignada al informe")
        }
    }
    handleKeyPress(e) {
        console.log(e)
        clearTimeout(lastClear);
        lastClear=window.setTimeout(function(){
            scannerInput="";
        },500);
        scannerInput+=e.key;
        if (scannerInput) {
            if (scannerInput.includes("s")) {
                this.onChangeQR(scannerInput.replace("s", ""))
                scannerInput = ""
            }
        }
        e.preventDefault();
    }

    generarBorrador(){
        let datosVerificados = this.state.productosListadoDescarga.filter(objeto => objeto.verificado === true);
        descargaAgregarListadoBorrador(this.state.informe.m_nIdInforme, datosVerificados).then(({data}) =>{
            showSuccess(data);
        })
    }


    handleEliminarProducto(e, p) {
        let newData = []
        newData = this.state.productosListadoDescarga.filter((i) => i !== p)
        this.setState({productosListadoDescarga: newData})
     
    }

    handleGuardarInformacion(event){
        event.preventDefault()
        localStorage.setItem(`informe${this.state.informe.m_nIdInforme}`, JSON.stringify(this.state))
        showSuccess("Información Guardada")
        window.location.reload();
    }

    onCerrarInformeClick(event) {
        event.preventDefault()
      
        try {
            this.setState({ openConfirmDialog: true });
        }catch (e){
            console.log(e)
        }
    }

    verificarProducto(index){
        const array = this.state.productosListadoDescarga
        array[index].verificado = true
        this.setState({
            productosListadoDescarga: array
        })
    }

    esEnteroValido(string) {
        return /^\d+$/.test(string);
    }

    // ESTA FUNCION SE LLAMA CUANDO SE ESCANEA UN CODIGO QR DE INFORME
    // Y CUANDO SE ESCANEA UN CODIGO QR DE PAQUETE
    // Y CUANDO SE RECUPERA EL BORRADOR PARA AGREGAR EL PRODUCTO GUARDADO AL LISTADO
    onChangeQR(idEscaner) {
        if (idEscaner.length !== 0) {
            if (!this.state.informe) {
                if (!this.esEnteroValido(idEscaner)) {
                    showError('El código escaneado no es válido')
                    if (window.navigator && window.navigator.vibrate) {
                        window.navigator.vibrate(300);
                    }
                    new Audio(ErrorAudio).play()
                    return
                }
                if (localStorage.getItem(`informe${idEscaner}`)) {
                   var state =  JSON.parse(localStorage.getItem(`informe${idEscaner}`))
                    this.setState(state)
                    return
                }
                obtenerInformesIdEscaner(idEscaner).then(({data}) => {
                    var arrayGuias = []
                    data.m_arrClsProGuia.forEach(d => {
                        d.m_arrClsDetalle.forEach((p, pindex) => {

                            for (let i = 0; i < p.ctd; i++) {
                                var item = JSON.parse(JSON.stringify(d));
                                item.numeracion = `${i + 1} - ${p.ctd}`
                                item.verificado = d.m_nIdEstatusGuia !== 6
                                item.index = i
                                item.paqueteIndex = pindex
                                item.m_nIdEmbarqueDetalle = p.m_nIdEmbarqueDetalle
                                arrayGuias.push(item)
                            }
                        })

                    })
                    this.setState({
                        idQR: "",
                        informe: data,
                        productosListadoDescarga: arrayGuias
                    })
                    descargaObtenerListadoBorrador(idEscaner).then(({data}) => {
                        data.forEach((objeto) => {
                                this.escanearQRProducto(objeto.qr, true);
                        });
                    })
                }).catch(error => {
                    showError('El código de informe escaneado es inválido')
                    if (window.navigator && window.navigator.vibrate) {
                        window.navigator.vibrate(300);
                    }
                    new Audio(ErrorAudio).play()
                })
            } else {
                if (this.state.productosListadoDescarga.length > 0) {
                    this.escanearQRProducto(idEscaner ,false)
                }
            }

        }
    }

    handleUserResponse(response) {
        try {
            this.setState({ openConfirmDialog: true });
            if (response) {
                let params = {
                    m_dFechaLlegada: `${new Date().getFullYear()}-${`${new Date().getMonth()}`.padStart(2, 0)}-${`${new Date().getDate()}`.padStart(2, 0)}`,
                    m_tHoraLlegada: `${`${new Date().getHours()}`.padStart(2, 0)}:${`${new Date().getMinutes()}`.padStart(2, 0)}`
                }
                marcarLlegadaInforme(this.state.informe.m_nIdInforme, params).then(({data}) => {
                    showSuccess(data)
                    this.setState({
                        idQR: "",
                        productosListadoDescarga: [],
                        dataInformes: [],
                        informe: null
                    })
                })
            } else {
                console.log("User clicked 'No'");
            }
        }catch (e){
            console.log(e)
        }
    }

    handleDialogClose() {
        this.setState({ openConfirmDialog: false });
    }
    render() {
        return (
            <div>
                <ConfirmDialog
                    open={this.state.openConfirmDialog}
                    onClose={this.handleDialogClose}
                    message="¿Está seguro de validar la llegada de paquetes? Verifique que todos los paquetes se encuentren en bodega."
                    onUserResponse={this.handleUserResponse}
                />
                <AppBarCustom/>
                <form onSubmit={this.onCerrarInformeClick}>
                    <Grid container>
                        
                        {
                            this.state.informe &&
                            <Grid item xs={12}>
                                <Paper elevation={0} className={'paper-content-top'} style={{marginBottom:'8px'}}>
                                    <Typography variant={"h3"}>Informe: {this.state.informe.m_sFolioInforme}</Typography>
                                    <Typography variant={"h3"}>Origen: {this.state.informe.m_sCiudadOrigen}</Typography>
                                    <Typography variant={"h3"}>Destino: {this.state.informe.m_sCiudadDestino}</Typography>
                                </Paper>
                            </Grid>
                        }
                        
                        {
                            this.state.informe &&
                            <Grid item xs={12} style={{ marginBottom: '20px' }}>
                                <Paper elevation={0} className={'button-container'} style={{marginTop:'0px',marginBottom:'0px'}}>
                                    <Button onClick={this.generarBorrador} color={"primary"} fullWidth variant={"contained"} size={"large"} style={{boxShadow:'none'}}>
                                        Generar borrador
                                    </Button>
                                </Paper>
                            </Grid>
                        }
                        {
                            this.state.informe &&
                            <Grid item xs={12}>
                                <Paper elevation={0} className={'button-container'} style={{marginTop:'0px',marginBottom:'0px'}}>
                                    <Button type="submit" color={"primary"} fullWidth variant={"contained"} size={"large"} style={{boxShadow:'none'}}>
                                        Validar todos los paquetes
                                    </Button>
                                </Paper>

                            </Grid>
                        }
                      
                        <Grid item xs={12}>
                            <Paper elevation={0} className={'paper-content-middle'}>
                                <Typography variant={"h2"}>Productos</Typography>
                                <br/>
                                <ListadoProductos
                                    productosListado={this.state.productosListadoDescarga}
                                    handleEliminarProducto={this.handleEliminarProducto} verificarProducto={this.verificarProducto}
                                    carga={false}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </form>
            </div>
        );
    }
}

Descarga.propTypes = {};

export default Descarga;
