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

const routes = [
    {
        path: "/login",
        component: LoginPage
    },
    {
        path: "/public",
        component: PublicPage
    },
    {
        path: "/protected",
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

const fakeAuth = {
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

function LoginPage() {
    let history = useHistory();
    let location = useLocation();

    let {from} = location.state || {from: {pathname: "/"}};
    let login = () => {
        fakeAuth.authenticate(() => {
            history.replace(from);
        });
    };

    return (
        <form className="form-signin">
            <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
            <label htmlFor="inputEmail" className="sr-only">Email address</label>
            <input type="email" id="inputEmail" className="form-control" placeholder="Email address"
                   required={true}/>
            <label htmlFor="inputPassword" className="sr-only">Password</label>
            <input type="password" id="inputPassword" className="form-control" placeholder="Password"
                   required={true}/>
            <div className="checkbox mb-3">
                <label>
                    <input type="checkbox" value="remember-me"/> Remember me
                </label>
            </div>
            <button onClick={login} className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
        </form>
    );
}