import React, { Component } from 'react';
import { Row, Col, Container } from 'react-bootstrap'

class Banda extends Component {

    state = { nombre: "", banda: {} }

    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = {
            nombre: this.props.match.params.banda,
            banda: this.props.location.state.banda
        };

        console.log(this.state);
    }


    render() {


        return (
            <Container>
                <h1>{this.state.nombre} <em>({this.state.banda.procedencia}) - {this.state.banda.relevancia}</em></h1>
                <h3>{this.state.banda.escenario}{" "}
                    <span>
                        {this.state.banda.horaInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{" - "}
                        {this.state.banda.horaFin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </h3>
                <p>{this.state.nombre}</p>
                <ul>
                    <li>{this.state.banda.procedencia}</li>
                    <li>{this.state.banda.descripcion}</li>
                </ul>
            </Container>


        );
    }
}


export default Banda;