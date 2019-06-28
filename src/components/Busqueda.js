import React, { Component } from 'react';
import { ListGroup, Container, Form, FormControl, Row } from 'react-bootstrap';
import { findBandasByName } from '../services/Bandas';

class Busqueda extends Component {

    state = { nombre: "", busqueda: [] }

    navegarBandas = (bandaActual) => {
        this.props.history.push({ pathname: `/banda/${bandaActual.id}` });
    }

    handleSearchBar = (e) => {
        this.setState({
            nombre: e.target.value,
            busqueda: findBandasByName(e.target.value)
        })
    }

    render() {


        let resultado = this.state.busqueda ? (
            <ListGroup>
                {

                    this.state.busqueda.map((elemento, index) => (
                        <ListGroup.Item action variant="dark" key={index} onClick={(e) => this.navegarBandas(elemento)}>

                            {elemento.nombre}

                        </ListGroup.Item>
                    ))
                }
            </ListGroup>
        ) : (
                <h2 className="text-center mt-5">No hay elementos</h2>
            )

        return (
            <Container className="mt-3">
                <Form >
                    <FormControl placeholder="Buscar" value={this.state.nombre} size="sm" onChange={(e) => this.handleSearchBar(e)} />

                </Form>
                {resultado}
            </Container>

        )
    }

}
export default Busqueda;