import React from "react";
import { Switch, Route } from "react-router-dom";
import Resurrection from "./Resurrection";
import Banda from "./Banda";
import EditarBanda from "./EditarBanda";
import Busqueda from "./Busqueda";
import Now from "./Now";
import { Container } from 'react-bootstrap'
import About from "./About";

const Main = () => (
    <Container className="p-0">
        <Switch>
            <Route name="home" exact path="/" component={Resurrection} />
            <Route name="banda" path="/banda/:id" component={Banda} />
            <Route name="ahora" path="/now" component={Now} />
            <Route name="editar" path="/editar/:id" component={EditarBanda} />
            <Route name="buscar" path="/buscar" component={Busqueda} />
            <Route name="about" path="/about" component={About} />
        </Switch>
    </Container>
);

export default Main;