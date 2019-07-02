import React, { Component } from 'react';
import Main from "./Main";
import Header from "./Header";
import Footer from "./Footer";
import Container from "react-bootstrap/Container";
import { findBandasByName } from '../services/Bandas';

class App extends Component {
  state = { buscar: "" }

  actualizarBusqueda = (buscar) => {

    this.setState({ buscar: findBandasByName(buscar) });
  }

  render() {
    return (
      <Container >
        <Header />
        <Main />
        <footer className=" pt-4 pb-2 border-top mt-4" >
          <Footer />
        </footer>

      </Container>
    );
  }
}

export default App;
