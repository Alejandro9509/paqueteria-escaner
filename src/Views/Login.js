import React from "react";
import {
  Avatar,
  Button,
 Paper, TextField, Typography
} from "@material-ui/core";
import $ from 'jquery';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Noty from 'noty';
import { makeStyles } from '@material-ui/core/styles';
import {validarLoginOperador} from "../Util/Contexts/OperadoresContext";

function showSuccess(mensaje) {
  new Noty({
    type: "information",
    layout: "topCenter",
    text: mensaje,
    timeout: "3000"
  }).show()
}


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  paperLogin: {
    margin: '16px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(1, 0, 0),
  },
}));

function Login() {
  const classes = useStyles();

  const login = (e) => {
    e.preventDefault();
    const user = $("#numeroOperador").val();
    const rfc = $("#rfc").val();

    validarLoginOperador(user, rfc).then(respuesta => {
      try {
        if (respuesta.data !== undefined && respuesta.data.m_sNombreCompleto !== undefined && respuesta.data.m_sNombreCompleto !==  "") {

          localStorage.setItem("accessToken", true);
          localStorage.setItem("RFC",rfc);
          localStorage.setItem("UsuarioId", respuesta.data.m_nIdOperador);
          localStorage.setItem("Email", respuesta.data.m_sCorreoOperador);
          localStorage.setItem("Usuario", respuesta.data.m_sNombreCompleto);
          localStorage.setItem("Nombre", respuesta.data.m_sNombreCompleto);
          window.location.reload();
        }
        else {
          showSuccess(respuesta.data);
        }
      } catch {
        showSuccess(respuesta.data);
      }
    });

  }

  return (

      <Paper className={classes.paperLogin} elevation={0}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Inicio Sesión
        </Typography>
        <br/>
        <form  noValidate onSubmit={login}>
          <TextField
              variant="outlined"
              required
              fullWidth
              margin={"dense"}
              id={"numeroOperador"}
              label="Número Operador"
              name="numeroOperador"
              autoComplete="numeroOperador"
              autoFocus
          />
          <br/>
          <br/>
          <TextField
              variant="outlined"
              required
              fullWidth
              margin={"dense"}
              id={"rfc"}
              label="RFC"
              name="rfc"
              autoComplete="rfc"
              autoFocus
          />
          <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              style={{boxShadow:'none'}}
          >
            Inicio Sesión
          </Button>
        </form>
      </Paper>
  );
}

export default Login;
