import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse} from "@material-ui/core";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    title: {
        fontSize: '1.4rem',
    },
    titleHead: {
        fontSize: '1.2rem',
    },
    message: {
        fontSize: '1.5rem',
    },
    button: {
        fontSize: '1.4rem',
    },
});
const ConfirmDialog = ({ open, onClose, data }) => {

    const classes = useStyles();

    const handleResponse = () => {
        onClose();
    }

    function Row(props) {
        const { row } = props;
        const [open, setOpen] = React.useState(false);

        if (row.faltantes.length === 0) {
            return null;
        }
        // console.log('Los datos que llegan',row);
        return (
            <React.Fragment>
                <TableRow>
                    <TableCell>
                        <button type="button" onClick={() => setOpen(!open)}>
                            <Typography className={classes.titleHead}>{open ? '\u25B2' : '\u25BC'}</Typography>
                        </button>
                    </TableCell>
                    <TableCell>
                        <Typography className={classes.titleHead}>Paquete: {row.folio} - {row.descripcion}</Typography>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box margin={1}>
                                <Table size="small" aria-label="faltantes">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Paquetes faltantes</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.faltantes.map((faltante) => (
                                            <TableRow key={faltante}>
                                                <TableCell>{faltante}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        );
    }
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Typography variant="h5" className={classes.title}>Estos son los paquetes que faltan por escanear</Typography>
            </DialogTitle>
            <DialogContent>
                {/*<Typography variant="body1" className={classes.message}>{message}</Typography>*/}
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableBody>
                            {data.map((row) => (
                                <Row key={row.idEmbarqueDetalle} row={row} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button className={classes.button} onClick={handleResponse} color="primary" autoFocus>Aceptar</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDialog;