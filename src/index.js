import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import {Router} from "react-router-dom";

import {createBrowserHistory} from "history";
import {Spinner} from "./Components/spinner";
import {ThemeProvider} from '@material-ui/core';
import Themes from "./Assets/themes";

import * as serviceWorker from "./serviceWorker";

const hist = createBrowserHistory();

serviceWorker.register();


ReactDOM.render(
    <ThemeProvider theme={Themes.default}>
        <Router history={hist} basename={'/escaner'}>
            <Spinner/>
                <App/>
        </Router>
    </ThemeProvider>,
    document.getElementById('root')
);


