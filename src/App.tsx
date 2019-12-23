import React from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import LoginPage from "./LoginPage";
import dataService from "./DataService";
import Home from "./HomeComponent";
import CreateCake from "./CreateCake";

const routes = [
    {
        path: "/login",
        component: LoginPage
    },
    {
        path: "/createcake",
        component: CreateCake
    },
    {
        path: "/home",
        render: ({location}: { location: any }) => {
            return dataService.isUserAuthorized() ? (
                <Home/>
            ) : (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: {from: location}
                    }}
                />
            );
        }
    },
    {
        path: "/",
        render: ({location}: { location: any }) => {
            return (
                <Redirect
                    to={{
                        pathname: "/home"
                    }}
                />)
        }
    }
];

export default function AuthExample() {
    return (
        <Router>
            <div>
                <Switch>
                    {routes.map((route, i) => (
                        <RouteWithSubRoutes key={i} {...route} />
                    ))}
                </Switch>
            </div>
        </Router>
    );
}

function RouteWithSubRoutes(route: any, extraProps = {}) {
    return (
        <Route
            exact={route.exact}
            path={route.path}
            render={props => route.render
                ? route.render(props)
                : <route.component {...props} {...extraProps} route={route}/>}
            strict={route.strict}/>
    );
}