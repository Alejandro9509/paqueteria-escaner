import React, {Component} from 'react';
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import Login from './Views/Login';
import {AplicationConsumer, AplicationProvider} from "./Util/Contexts/AplicationContext";
import {ACCESS_TOKEN} from './Constants';
import "../node_modules/noty/lib/noty.css";  
import "../node_modules/noty/lib/themes/mint.css";
import Scanner from "./Views/Scanner";

class App extends Component {
  constructor(props) { 
    super(props);
    this.state = {};
  }

render(){
  return (
  <AplicationProvider>
    <AplicationConsumer>{(value) => {
      return(
        localStorage.getItem(ACCESS_TOKEN) ? (
          <Switch>
            <Route  path="/escaner/carga" component={Scanner} />
            <Route  path="/escaner/descarga" component={Scanner} />
            <Route  path="/escaner/validarInforme" component={Scanner} />
            <Redirect to={"/escaner/carga"}/>
          </Switch>
        ) : (
            <Switch>
              <Route exact path="/escaner" component={Login} />
              <Redirect to={"/escaner"}/>
            </Switch>
        )
      );}}
    </AplicationConsumer>
    </AplicationProvider>
  );
}

}

export default App;