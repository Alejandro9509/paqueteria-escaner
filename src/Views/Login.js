import React, { useState } from "react";
import {
  Avatar,
  Button,
  Paper,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import WarningIcon from "@material-ui/icons/Warning";
import Noty from "noty";
import { validarLoginOperador } from "../Util/Contexts/OperadoresContext";

const useStyles = makeStyles((theme) => ({
  paperLogin: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(2, 0, 0),
    boxShadow: "none",
  },
  warningIcon: {
    color: theme.palette.warning.main,
    marginRight: theme.spacing(1),
    verticalAlign: "middle",
  },
  dialogTitle: {
    display: "flex",
    alignItems: "center",
  },
}));

const showNotification = (mensaje) => {
  new Noty({
    type: "information",
    layout: "topCenter",
    text: mensaje,
    timeout: 3000,
  }).show();
};

const Login = () => {
  const classes = useStyles();
  const [numeroOperador, setNumeroOperador] = useState("");
  const [rfc, setRfc] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [errors, setErrors] = useState({ numeroOperador: false, rfc: false });

  const validateFields = () => {
    const newErrors = {
      numeroOperador: numeroOperador.trim() === "",
      rfc: rfc.trim() === "",
    };
    setErrors(newErrors);

    return !newErrors.numeroOperador && !newErrors.rfc;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      setModalMessage("Por favor completa todos los campos requeridos.");
      setOpenModal(true);
      return;
    }

    try {
      const respuesta = await validarLoginOperador(numeroOperador, rfc);

      if (
        respuesta?.data?.m_sNombreCompleto &&
        respuesta.data.m_sNombreCompleto !== ""
      ) {
        const { m_nIdOperador, m_sCorreoOperador, m_sNombreCompleto } =
          respuesta.data;

        localStorage.setItem("accessToken", "true");
        localStorage.setItem("RFC", rfc);
        localStorage.setItem("UsuarioId", m_nIdOperador);
        localStorage.setItem("Email", m_sCorreoOperador);
        localStorage.setItem("Usuario", m_sNombreCompleto);
        localStorage.setItem("Nombre", m_sNombreCompleto);

        window.location.reload();
      } else {
        showNotification(respuesta?.data || "Datos inválidos.");
      }
    } catch (error) {
      showNotification("Error en el servidor o respuesta inesperada.");
    }
  };

  return (
    <>
      <Paper className={classes.paperLogin} elevation={0}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Inicio Sesión
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            required
            fullWidth
            margin="dense"
            id="numeroOperador"
            label="Número Operador"
            name="numeroOperador"
            value={numeroOperador}
            onChange={(e) => setNumeroOperador(e.target.value)}
            error={errors.numeroOperador}
            helperText={errors.numeroOperador ? "Campo requerido" : ""}
            autoFocus
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            margin="dense"
            id="rfc"
            label="RFC"
            name="rfc"
            value={rfc}
            onChange={(e) => setRfc(e.target.value)}
            error={errors.rfc}
            helperText={errors.rfc ? "Campo requerido" : ""}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Inicio Sesión
          </Button>
        </form>
      </Paper>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle disableTypography className={classes.dialogTitle}>
          <WarningIcon className={classes.warningIcon} />
          <Typography variant="h6">Advertencia</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{modalMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary" autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Login;