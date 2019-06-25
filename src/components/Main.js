import React from "react";
import { Switch, Route } from "react-router-dom";
import Resurrection from "./Resurrection";
import Banda from "./Banda";
import Now from "./Now";
import { Container } from 'react-bootstrap'



const Main = () => (
    <Container className="p-0">
        <Switch>
            <Route name="home" exact path="/" component={Resurrection} />
            <Route name="banda" path="/banda/:banda" component={Banda} />
            <Route name="ahora" path="/now" component={Now} />
        </Switch>
    </Container>
);

export default Main;