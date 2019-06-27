import React from "react";
import { Switch, Route } from "react-router-dom";
import Resurrection from "./Resurrection";
import Banda from "./Banda";
import Now from "./Now";
import { Container } from 'react-bootstrap'

const Main = () => (
    <Container className="p-0">
        <Switch>
            <Route name="home" exact path={process.env.PUBLIC_URL + "/"} component={Resurrection} />
            <Route name="banda" path={process.env.PUBLIC_URL + "/banda/:banda"} component={Banda} />
            <Route name="ahora" path={process.env.PUBLIC_URL + "/now"} component={Now} />
        </Switch>
    </Container>
);

export default Main;