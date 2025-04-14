import React, {Component} from 'react';
import {AppBar, Button, Grid, Paper, Typography} from "@material-ui/core";
import ListadoProductosValidar from "../../Components/Scanner/ListadoGuiasValidar";
import Noty from "noty";
import TextField from "@material-ui/core/TextField";
import {ValidarQR, obtenerInformesIdEscanerValidar} from "../../Util/Contexts/InformesContext";
import $ from 'jquery';
import {confirmAlert} from 'react-confirm-alert';

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

class ValidarInforme extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idQR: "",
            productosListadoValidar: [],
            dataInformes: [],
            informe: null
        }
        this.onCerrarInformeClick = this.onCerrarInformeClick.bind(this)
        this.handleEliminarProducto = this.handleEliminarProducto.bind(this)
        this.onChangeQR = this.onChangeQR.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.handleGuardarInformacion = this.handleGuardarInformacion.bind(this)
        this.verificarProducto = this.verificarProducto.bind(this)


    }

    componentWillMount() {
        this.setState({informe: null})
    }

    componentDidMount() {
        document.addEventListener("keypress", this.handleKeyPress)
    }
    handleKeyPress(e) {
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

    handleEliminarProducto(e, p) {
        let newData = []
        newData = this.state.productosListadoValidar.filter((i) => i !== p)
        this.setState({productosListadoValidar: newData})
      
    }

    handleGuardarInformacion(event){
        event.preventDefault()
        localStorage.setItem(`informe${this.state.informe.m_nIdInforme}`, JSON.stringify(this.state))
        showSuccess("Información Guardada")
        window.location.reload();
    }

    onCerrarInformeClick(event) {
        event.preventDefault()
        confirmAlert({
            title: 'Confirmar',
            message: '¿Está seguro de cargar Informe en Remolque?. Verifique que todos lo paquetes se encuentren en el remolque.',
            buttons: [
                {
                    label: 'Si',
                    onClick: () => {
                        console.log("INFORME: "+this.state.informe.m_nIdInforme)
                        ValidarQR(this.state.informe.m_nIdInforme).then(({data}) => {
                            showSuccess(data)
                            this.setState({
                                idQR: "",
                                productosListadoValidar: [],
                                dataInformes: [],
                                informe: null
                            })
                        }).catch(error => {
                            if (error.response){
                                showError(error.response.data)
                            }
                        })
                    }
                },
                {
                    label: 'No',
                }
            ]
        })

    }

    verificarProducto(index){
        const array = this.state.productosListadoValidar
        array[index].verificado = true
        this.setState({
            productosListadoValidar: array
        })
    }

    onChangeQR(idEscaner) {
        if (idEscaner.length !== 0) {
            if (!this.state.informe) {
                if (localStorage.getItem(`informe${idEscaner}`)) {
                   var state =  JSON.parse(localStorage.getItem(`informe${idEscaner}`))
                    this.setState(state)
                    return
                }
                obtenerInformesIdEscanerValidar(idEscaner).then(({data}) => {
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
                        productosListadoValidar: arrayGuias
                    })
                }).catch(error => {
                    if (error.response){
                        showError(error.response.data)
                    }
                })
            } else {
                if (this.state.productosListadoValidar.length > 0) {
                    const array = this.state.productosListadoValidar
                    const informacionQR =  idEscaner.split("-")
                    if (informacionQR.length === 0){
                        showSuccess("Etiqueta no valida")
                        return
                    }
                    const indexGuiaSeleccionada = array.findIndex(p => { return (p.m_nIdEmbarqueDetalle === parseInt(informacionQR[1]) && p.index === parseInt(informacionQR[2]))})
                    if (indexGuiaSeleccionada >= 0) {
                        array[indexGuiaSeleccionada].verificado = false
                        this.setState({
                            idQR: "",
                            productosListadoValidar: array
                        })
                    } else {
                        showSuccess("Este paquete no corresponde al informe escaneado, no debe ser cargado en el remolque. ")
                    }
                }
            }

        }
    }

    render() {
        return (
            <div>
                <AppBar elevation={0} position="static">
                    <Typography variant={"h5"} style={{padding:"20px"}}>
                        Operador: {localStorage.getItem("Nombre")}
                    </Typography>
                </AppBar>
                <form onSubmit={this.onCerrarInformeClick}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Paper elevation={0} className={'paper-content-top'} style={{marginBottom:'8px'}}>
                                <TextField id={"idGuiInput"} InputProps={{inputMode: "none"}} autoFocus
                                           variant={"outlined"} fullWidth value={this.state.idGuia}
                                           onChange={(event) => this.onChangeQR(event.target.value)}/>
                            </Paper>
                        </Grid>
                        {
                            this.state.informe &&
                            <Grid item xs={12}>
                                <Paper elevation={0} className={'paper-content-middle'} style={{marginTop:'0px',marginBottom:'8px'}}>
                                    <Typography variant={"h3"}>Informe: {this.state.informe.m_sFolioInforme}</Typography>
                                    <Typography variant={"h3"}>Origen: {this.state.informe.m_sCiudadOrigen}</Typography>
                                    <Typography variant={"h3"}>Destino: {this.state.informe.m_sCiudadDestino}</Typography>
                                    <Typography variant={"h3"}>Remolque: {this.state.informe.m_sRemolque1}</Typography>
                                </Paper>
                            </Grid>
                        }
                        {
                            this.state.informe &&
                            <Grid item xs={12}>
                                <Paper elevation={0} className={'button-container'} style={{marginTop:'0px'}}>
                                    <Button type="submit" color={"primary"} fullWidth variant={"contained"} size={"large"} style={{boxShadow:'none'}}>
                                        Validar todos los paquetes
                                    </Button>
                                </Paper>

                            </Grid>
                        }
                        <Grid item xs={12}>
                            <Paper elevation={0} className={'paper-content-middle'} style={{marginTop:'0px'}}>
                                <Typography variant={"h2"}>Productos</Typography>
                                <br/>
                                <ListadoProductosValidar
                                    productosListado={this.state.productosListadoValidar}
                                    handleEliminarProducto={this.handleEliminarProducto} verificarProducto={this.verificarProducto}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </form>
            </div>
        );
    }


}
ValidarInforme.propTypes = {};

export default ValidarInforme;
