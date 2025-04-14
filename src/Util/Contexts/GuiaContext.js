import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import {API_HEADERS} from "../../Constants";

const headers = API_HEADERS

function modificarGuia(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/Guia/Modificar/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function entregaOcurreGuia(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/Guia/EntregaOcurre/` + id;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
    );
    return result
}

function agregarGuia(params) {
    const url = `${process.env.REACT_APP_API_URL}/Guia/Agregar`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarGuia(id, idEliminadoPor) {
    const url = `${process.env.REACT_APP_API_URL}/Guia/Eliminar/` + id + `/${idEliminadoPor}`;
    let result;
    trackPromise(
        result =  axios.delete(url, { headers })
        );
    return result
}
function cancelarGuia(id, params) {
    const url = `${process.env.REACT_APP_API_URL}/Guia/Cancelar/${id}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
        );
    return result
}

function cambiarEstatusGuia(id, informe) {
    const url = `${process.env.REACT_APP_API_URL}/Guias/CambiarEstatusEscaner/${id}/${informe}`;
    let result;
    var params = {}
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
    );
    return result
}

function obtenerGuia() {
    const url = `${process.env.REACT_APP_API_URL}/Guia/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}
function obtenerGuiaUltimaMilla(zonasIds, tipoServicio) {
    const url = `${process.env.REACT_APP_API_URL}/GetGuiasUltimaMilla`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}, {zonas: zonasIds.join(","), tipoServicio: tipoServicio}), { headers })
    );
    return result
}

function reasignarGuia(idParadaDestino, idParadaFuente, idGuia) {
    const url = `${process.env.REACT_APP_API_URL}/ReasignarGuia/${idParadaDestino}/${idParadaFuente}/${idGuia}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, {}), { headers })
    );
    return result
}

function obtenerGuiaPendientes(idOrigen, idDestino) {
    const url = `${process.env.REACT_APP_API_URL}/Guia/GetListadoPendientes/` +
        idOrigen +
        "/" +
        idDestino
        ;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}
function obtenerGuiaReporte(id) {
    const url = `http://190.9.53.4:8081/reportes/api/GenerarReporte/Guia/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}
function ultimoFolioGuia() {
    const url = `${process.env.REACT_APP_API_URL}/Guia/GetUltimoFolio`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerGuiaId(id) {
    const url = `${window.RUNTIME_CONFIG.BACKEND_URL_REPORTES ?? process.env.REACT_APP_REPORT_URL}/api/Guia/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function imprimirGuia(id) {
    const url = `${process.env.REACT_APP_API_URL}/Guia/GetImpresion/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerGuiasFiltro(fechaInicial, fechaFinal, sucursalListado, estatusListado,folioGuia) {
    if (folioGuia === ''){
        folioGuia = 0
    }
    const url =
        `${process.env.REACT_APP_API_URL}/Guia/GetByFiltro/` +
        fechaInicial +
        "/" +
        fechaFinal +
        "/" +
        sucursalListado +
        "/" +
        estatusListado +
        "/" +
        folioGuia;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerGuiasFiltroCorteCaja(fecha, destino, idMoneda, idTipoPago) {

    const url =
        `${process.env.REACT_APP_API_URL}/Guias/GetListadoFiltrosCorteCaja/` +
        fecha +
        "/" +
        destino +
        "/" +
        idMoneda +
        "/" +
        idTipoPago
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

export { obtenerGuiasFiltroCorteCaja, entregaOcurreGuia, modificarGuia, agregarGuia, eliminarGuia, obtenerGuiaId, obtenerGuia, ultimoFolioGuia, cancelarGuia, obtenerGuiasFiltro, obtenerGuiaPendientes, imprimirGuia, obtenerGuiaUltimaMilla, reasignarGuia, obtenerGuiaReporte, cambiarEstatusGuia }