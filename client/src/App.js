import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import Alert from "./components/Alert";
import Landing from "./components/Landing";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Error from "./components/Error";
import store from "./store";
import PrivateRoute from "./routing/PrivateRoute";
import { loadUser } from "./actions/auth";
import "./App.css";

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <>
      <Navbar />
      <Route exact path="/" component={Landing} />

      <div className="container">
        <Alert />
        <Switch>
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
          <Route component={Error} />
        </Switch>
      </div>
    </>
  );
};

export default App;
