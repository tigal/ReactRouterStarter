import React from 'react';
import {RouteComponentProps, withRouter} from "react-router-dom";
import dataService from "./DataService";

interface LoginPageProps extends RouteComponentProps {

}

interface LoginPageState {

    inputLogin: string;

    inputPassword: string;

}

class LoginPage extends React.Component<LoginPageProps, LoginPageState> {


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
        let history = this.props.history;
        let location = this.props.location;
        let {from} = location.state || {from: {pathname: "/"}};
        await dataService.login(this.state.inputLogin, this.state.inputPassword);

        if (dataService.isUserAuthorized()) {
            history.replace(from);
            return;
        } else {
            alert("Not OK!");
        }
    }

    render(): React.ReactNode {
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
                <button onClick={() => this.login()}
                        className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
            </form>
        )
    }

};

export default withRouter(LoginPage);