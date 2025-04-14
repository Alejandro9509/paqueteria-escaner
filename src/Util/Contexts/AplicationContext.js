import React, { Component } from 'react';
export const AplicationContext = React.createContext();
export const AplicationConsumer = AplicationContext.Consumer;

export class AplicationProvider extends Component {
    state = {
        authenticated: false,
        currentUser: null,
        loading: true
    };
    componentDidMount() {
    }

    render() {
        return (
            <AplicationContext.Provider
            value = {{
                aplicationCurrentUser: this.state.currentUser,
                userIsAuthenticated: this.state.authenticated,
                loading: this.loading,
                login: this.loginAction,
                logout: this.logout,
                loadCurrentlyLoggedInUser: this.loadCurrentlyLoggedInUser
            }}
            >
                {this.props.children}
            </AplicationContext.Provider>
        );
    }


}

export default AplicationProvider;