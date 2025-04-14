import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import {API_HEADERS} from "../../Constants";

const headers = API_HEADERS

function ValidarQR(id){
    const url = `${process.env.REACT_APP_API_URL_LOCAL}/api/Informes/ValidarQR/${id}`;
    let result;
    trackPromise(
        result =  axios.post(url, Object.assign({}),{ headers })
    );
    return result
}

function modificarInformes(id, params){
    const url = `${window.RUNTIME_CONFIG.BACKEND_URL_REPORTES ?? process.env.REACT_APP_REPORT_URL}/api/Informes/ModificarEscaner`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
    );
    return result
}

function marcarLlegadaInforme(id, params){
    const url = `${window.RUNTIME_CONFIG.BACKEND_URL_REPORTES ?? process.env.REACT_APP_REPORT_URL}/api/Informes/AgregarLlegada/${id}`;
    let result;
    trackPromise(
        result =  axios.put(url, Object.assign({}, params), { headers })
    );
    return result
}

function obtenerInformes(){
    const url = `${window.RUNTIME_CONFIG.BACKEND_URL_REPORTES ?? process.env.REACT_APP_REPORT_URL}/api/Informes/GetListadoEscaner`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}
function obtenerInformesPorOperador(id){
    const url = `${window.RUNTIME_CONFIG.BACKEND_URL_REPORTES ?? process.env.REACT_APP_REPORT_URL}/api/Informes/GetListadoEscaner/ByOperador/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerInformesPorRangoFechas(fechaInicial , fechaFinal){
    const url = `${window.RUNTIME_CONFIG.BACKEND_URL_REPORTES ?? process.env.REACT_APP_REPORT_URL}/api/Informes/GetListadoEscaner/ByFecha/${fechaInicial}/${fechaFinal}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerInformesIdEscaner(id){
    const url = `${window.RUNTIME_CONFIG.BACKEND_URL_REPORTES ?? process.env.REACT_APP_REPORT_URL}/api/Informes/GetById/Escaner/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerInformesIdEscanerValidar(id){
    const url = `${process.env.REACT_APP_API_URL_LOCAL}/api/Informes/GetById/EscanerValidar/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function obtenerInformesId(id){
    const url = `${window.RUNTIME_CONFIG.BACKEND_URL_REPORTES ?? process.env.REACT_APP_REPORT_URL}/api/Informes/GetById/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

function cargaAgregarListadoBorrador(id, params){
    const url = `${window.RUNTIME_CONFIG.BACKEND_URL_REPORTES ?? process.env.REACT_APP_REPORT_URL}/api/Informes/cargaAgregarListadoBorrador/${id}`;
    let result;
    trackPromise(
        result = axios.post(url, params, { headers })
    );
    return result
}

function cargaObtenerListadoBorrador(id){
    const url = `${window.RUNTIME_CONFIG.BACKEND_URL_REPORTES ?? process.env.REACT_APP_REPORT_URL}/api/Informes/cargaObtenerListadoBorrador/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}
function descargaAgregarListadoBorrador(id, params){
    const url = `${window.RUNTIME_CONFIG.BACKEND_URL_REPORTES ?? process.env.REACT_APP_REPORT_URL}/api/Informes/descargaAgregarListadoBorrador/${id}`;
    let result;
    trackPromise(
        result = axios.post(url, params, { headers })
    );
    return result
}
function descargaObtenerListadoBorrador(id){
    const url = `${window.RUNTIME_CONFIG.BACKEND_URL_REPORTES ?? process.env.REACT_APP_REPORT_URL}/api/Informes/descargaObtenerListadoBorrador/${id}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
    );
    return result
}

export {ValidarQR, modificarInformes, obtenerInformesIdEscaner, obtenerInformesIdEscanerValidar, obtenerInformes, obtenerInformesId, marcarLlegadaInforme, obtenerInformesPorOperador, obtenerInformesPorRangoFechas, cargaAgregarListadoBorrador, cargaObtenerListadoBorrador, descargaAgregarListadoBorrador, descargaObtenerListadoBorrador}