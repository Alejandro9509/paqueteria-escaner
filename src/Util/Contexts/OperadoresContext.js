import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}

function modificarOperadores(id, params) {
    const url =
        `${process.env.REACT_APP_API_URL}/Operador/Modificar/` +
        id;
    let result;
    trackPromise(
        result =  axios
        .put(url, Object.assign({}, params), { headers })
        );
    return result
}

function validarLoginOperador(usuario, rfc) {
    const url = `${window.RUNTIME_CONFIG.BACKEND_URL_REPORTES ?? process.env.REACT_APP_REPORT_URL}/api/Operador/ValidarLoginPaqueteria` ;
    let result;
    trackPromise(
        result =  axios
            .post(url,Object.assign({}, {username: usuario}), { headers : {...headers, RFC: rfc} })
    );
    return result
}

function agregarOperadores(params) {
    const url = `${process.env.REACT_APP_API_URL}/Operador/Agregar`;
    let result;
    trackPromise(
        result =  axios
        .post(url, Object.assign({}, params), { headers })
        );
    return result
}

function eliminarOperadores(id, idEliminadoPor) {
    const url = `${process.env.REACT_APP_API_URL}/Operador/Eliminar/` + id +`/${idEliminadoPor}`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerOperadores() {
    const url = `${process.env.REACT_APP_API_URL}/Operadores/GetListado`;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function validarNumeroOperadores(id) {
    const url = `${process.env.REACT_APP_API_URL}/Operadores/ValidaNumeroOperador/` + id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

function obtenerOperadoresId(id) {
    const url =
            `${process.env.REACT_APP_API_URL}/Operador/GetById/` +
            id;
    let result;
    trackPromise(
        result =  axios.get(url, { headers })
        );
    return result
}

export { modificarOperadores, agregarOperadores, eliminarOperadores, obtenerOperadoresId, obtenerOperadores, validarNumeroOperadores, validarLoginOperador }