import React from "react";
import { Switch, Route } from "react-router-dom";
import Resurrection from "./Resurrection";
import Banda from "./Banda";
import Now from "./Now";
import { Container } from 'react-bootstrap'



const Main = () => (
    <Container>
        <Switch>
            <Route exact path="/" component={Resurrection} />
            <Route path="/banda/:banda" component={Banda} />
            <Route path="/now" component={Now} />
        </Switch>
    </Container>
);

export default Main;