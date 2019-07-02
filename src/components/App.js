import React, { Component } from 'react';
import Main from "./Main";
import Header from "./Header";
import Container from "react-bootstrap/Container";
import { findBandasByName } from '../services/Bandas';

class App extends Component {
  state = { buscar: "" }

  actualizarBusqueda = (buscar) => {

    this.setState({ buscar: findBandasByName(buscar) });
  }

  render() {
    return (
      <Container>
      <Container className="w-100 p-0">
        <Header />
        <Main />

      </Container>
    );
  }
}

export default App;
