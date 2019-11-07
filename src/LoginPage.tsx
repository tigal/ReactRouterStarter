import React, {Component} from 'react';
import {useHistory, useLocation} from "react-router-dom";
import {fakeAuth} from "./App";
import authService from "./AuthService";

interface LoginPageProps {

}

interface LoginPageState {

    inputLogin: string;

    inputPassword: string;

}

export class LoginPage extends React.Component<LoginPageProps, LoginPageState> {


    constructor(props: Readonly<LoginPageProps>) {
        super(props);
        this.state = {
            inputLogin: "",
            inputPassword: ""
        };
    }

    changeLogin(newLogin: string) {
        this.setState({
            inputLogin: newLogin
        });
    }

    changePassword(newPassword: string) {
        this.setState({
            inputPassword: newPassword
        });
    }


    async login() {

        // let {from} = location.state || {from: {pathname: "/"}};
        await authService.login(this.state.inputLogin, this.state.inputPassword);

        if (authService.isUserAuthorized()) {
            // history.replace(from);
            alert("OK!");
        } else {
            alert("Not OK!");
        }
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <form className="form-signin">
                <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
                <label htmlFor="inputEmail" className="sr-only">Email address</label>

                <input onChange={event => this.changeLogin(event.target.value)}
                       type="email" id="inputEmail" className="form-control"
                       placeholder="Email address"
                       required={true}/>

                <label htmlFor="inputPassword" className="sr-only">Password</label>

                <input onChange={event => {
                    this.changePassword(event.target.value)
                }} type="password" id="inputPassword" className="form-control"
                       placeholder="Password"
                       required={true}/>

                <div className="checkbox mb-3">
                    <label>
                        <input type="checkbox" value="remember-me"/> Remember me
                    </label>
                </div>
                <button onClick={() => this.login()} className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
            </form>
        )
    }

};