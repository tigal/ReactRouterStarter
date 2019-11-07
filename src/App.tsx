import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory,
    useLocation
} from "react-router-dom";
import {LoginPage} from "./LoginPage";

const routes = [
    {
        path: "/login",
        component: LoginPage
    },
    {
        path: "/home",
        render: ({location}: { location: any }) => {
            return fakeAuth.isAuthenticated ? (
                <ProtectedPage/>
            ) : (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: {from: location}
                    }}
                />
            );
        }
    }
];

export default function AuthExample() {
    return (
        <Router>
            <div>
                <AuthButton/>

                <ul>
                    <li>
                        <Link to="/public">Public Page</Link>
                    </li>
                    <li>
                        <Link to="/protected">Protected Page</Link>
                    </li>
                </ul>

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

export const fakeAuth = {
    isAuthenticated: false,
    async authenticate(cb: (() => void)) {
        let responsePromise: Promise<Response> = fetch("http://localhost:4000/profile");

        let profile;
        try {
            profile = await responsePromise;
        } catch (e) {
            console.error(e);
        }
        console.log(profile);
        fakeAuth.isAuthenticated = true;
        setTimeout(cb, 100);
    },
    signout(cb: () => void) {
        fakeAuth.isAuthenticated = false;
        setTimeout(cb, 100);
    }
};

function AuthButton() {
    let history = useHistory();

    return fakeAuth.isAuthenticated ? (
        <p>
            Welcome!{" "}
            <button
                onClick={() => {
                    fakeAuth.signout(() => history.push("/"));
                }}
            >
                Sign out
            </button>
        </p>
    ) : (
        <p>You are not logged in.</p>
    );
}


function PublicPage() {
    return <h3>Public</h3>;
}

function ProtectedPage() {
    return <h3>Protected</h3>;
}