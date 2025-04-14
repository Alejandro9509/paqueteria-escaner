import React, {Component} from 'react';
import {Grid, Paper, Typography} from "@material-ui/core";
import routes from "../routes";
import {Link} from "react-router-dom";

class Home extends Component {
    componentWillMount() {

    }

    render() {
        return (
            <div>
                <Grid container justify={"space-between"} alignItems={"center"} spacing={2} style={{padding: "20px"}}>
                    {
                      routes.map((r, index) => (
                        <Grid item sm={6} key={index}>
                            <Link
                                to={{
                                    pathname: r.path,
                                    state: { param1: index } // si usás react-router para pasar datos
                                }}
                            >
                                <Paper
                                    elevation={2}
                                    style={{
                                        margin: 'auto',
                                        height: '150px',
                                        width: '150px',
                                        flexGrow: 1,
                                        borderRadius: '10px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center'
                                    }}
                                >
                                    <img src={r.icon} alt={r.name} style={{ width: '100px' }} />
                                    <Typography variant="h2">{r.name}</Typography>
                                </Paper>
                            </Link>
                        </Grid>
                    ))
                    }

                </Grid>
            </div>
        );
    }
}

Home.propTypes = {};
export default Home;
