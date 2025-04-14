import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@material-ui/core";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    title: {
        fontSize: '1.4rem',
    },
    message: {
        fontSize: '1.5rem',
    },
    button: {
        fontSize: '1.4rem',
    },
});
const ConfirmDialog = ({ open, onClose, message, onUserResponse }) => {

    const classes = useStyles();
    const handlePositiveResponse = () => {
        onUserResponse(true);
        onClose();
    }

    const handleNegativeResponse = () => {
        onUserResponse(false);
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Typography variant="h5" className={classes.title}>Confirmar</Typography>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1" className={classes.message}>{message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button className={classes.button} onClick={handlePositiveResponse} color="primary">Sí</Button>
                <Button className={classes.button} onClick={handleNegativeResponse} color="primary" autoFocus>No</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDialog;