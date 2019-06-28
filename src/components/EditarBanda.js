import React from 'react'
import { Component } from "react";
import { Container } from 'react-bootstrap';
import { Form, Button } from "react-bootstrap";

import { actualizarBanda, getBandaById } from "../services/Bandas";

class EditarBanda extends Component {
    state = { banda: {} }

    constructor(props) {
        super(props);
        var banda = {};
        if (props.banda) {
            banda = props.banda;
        }
        else {

            banda = getBandaById(props.match.params.id);

        }

        var { nombre, preferencia, procedencia, relevancia, descripcion } = banda;
        this.state = {
            nombre,
            preferencia: preferencia == true,
            procedencia: procedencia ? procedencia : "",
            relevancia: relevancia ? relevancia : "",
            descripcion: descripcion ? descripcion : "",
            banda
        };
        console.log(this.state);

    }

    guardarBanda = () => {
        var banda = this.state.banda;
        banda.preferencia = this.state.preferencia;
        banda.procedencia = this.state.procedencia;
        banda.relevancia = this.state.relevancia;
        banda.descripcion = this.state.descripcion;
        console.log(banda);
        actualizarBanda(banda);
        this.props.history.goBack();
    }

    render() {

        return (
            <Container>
                <h1>{this.state.nombre}</h1>

                <Form>
                    <Form.Group>
                        <Form.Label>
                            Preferencia:
                        </Form.Label>
                        <Form.Check defaultChecked={this.state.preferencia} onChange={(e) => this.setState({ preferencia: e.target.checked })} />
                        <Form.Label>Procedencia:</Form.Label>
                        <Form.Control value={this.state.procedencia} onChange={(e) => this.setState({ procedencia: e.target.value })} />
                        <Form.Label>
                            Relevancia:
                </Form.Label>
                        <Form.Control type="number" min="0" max="100" value={this.state.relevancia} onChange={(e) => this.setState({ relevancia: e.target.value })} />
                        <Form.Label>
                            Descripcion:
                </Form.Label>
                        <Form.Control as="textarea" rows="3" value={this.state.descripcion} onChange={(e) => this.setState({ descripcion: e.target.value })} />
                    </Form.Group>
                    <Button onClick={this.guardarBanda}>Guardar</Button>
                    <Button variant="danger" onClick={() => this.props.history.goBack()}>Cancelar</Button>
                </Form>
            </Container>
        )
    }
}

export default EditarBanda;