import React from "react";
import {
    Box,
    Paper,
    Typography
} from "@material-ui/core";
import PropTypes from "prop-types";
import Carga from "./carga/carga";
import Descarga from "./descarga/descarga";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import routes from "../routes";
import ExitIcon from "../iconos/exit.png";


function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
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
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function Scanner(props) {

    const [value, setValue] = React.useState(0);

    return (
        <div>
            <div style={{paddingBottom: "50px", overflow: "auto"}}>
                {
                    value === 0 &&
                    <Carga/>
                }
                {
                    value === 1 &&
                    <Descarga/>
                }

            </div>


            <Paper style={{position: 'fixed', bottom: 0, left: 0, right: 0}} elevation={3}>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        if (newValue === 2) {
                            localStorage.removeItem("accessToken");
                            window.location.reload();

                        } else {
                            setValue(() => {
                                return newValue
                            })
                        }
                    }}
                >
                    {
                        routes.map(r => {
                            return (
                                <BottomNavigationAction label={r.name}
                                                        icon={<img style={{width: "30px"}} alt={r.name} src={r.icon}/>}/>
                            )
                        })
                    }
                    <BottomNavigationAction label={"Salir"} icon={<img style={{width: "25px"}} alt={"Salir"} src={ExitIcon}/>}/>

                </BottomNavigation>
            </Paper>
        </div>
    )
}


export default Scanner