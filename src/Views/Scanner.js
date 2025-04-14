import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";
import WarningAmberIcon from "@material-ui/icons/Warning"; // Icono de advertencia
import PropTypes from "prop-types";
import Carga from "./carga/carga";
import Descarga from "./descarga/descarga";
import routes from "../routes";
import ExitIcon from "../iconos/exit.png";

const contentStyle = {
  paddingBottom: "50px",
  overflow: "auto",
};

const footerStyle = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
};

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tab-panel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function Scanner() {
  const [value, setValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const handleNavigationChange = (event, newValue) => {
    if (newValue === routes.length) {
      setOpenModal(true); // Mostrar modal
    } else {
      setValue(newValue);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.reload();
  };

  return (
    <>
      <div style={contentStyle}>
        {value === 0 && <Carga />}
        {value === 1 && <Descarga />}
      </div>

      <Paper style={footerStyle} elevation={3}>
        <BottomNavigation value={value} onChange={handleNavigationChange} showLabels>
          {routes.map((r, index) => (
            <BottomNavigationAction
              key={r.name || `nav-${index}`}
              label={r.name}
              icon={<img src={r.icon} alt={r.name} style={{ width: "30px" }} />}
            />
          ))}
          <BottomNavigationAction
            label="Salir"
            icon={<img src={ExitIcon} alt="Salir" style={{ width: "25px" }} />}
          />
        </BottomNavigation>
      </Paper>

      {/* Modal de confirmación con icono */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle style={{ textAlign: "center" }}>
          <WarningAmberIcon style={{ fontSize: 48, color: "#ffa726" }} />
          <br />
          ¿Cerrar sesión?
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ textAlign: "center" }}>
            ¿Estás seguro que deseas cerrar la sesión?
            <br />
            Esta acción te sacará del sistema.
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleLogout} color="secondary" variant="contained">
            Salir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Scanner;