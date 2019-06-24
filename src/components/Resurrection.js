import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import Carousel from 'react-bootstrap/Carousel'
import Container from 'react-bootstrap/Container'

import { actualizar } from '../services/Bandas';






class Resurrection extends Component {

    state = { bandas: [] }

    constructor() {
        super();
        var bandas = [];

        if (localStorage.getItem('bandas')) {

            bandas = JSON.parse(localStorage.getItem('bandas')).map(dia => {

                dia.fecha = new Date(dia.fecha);
                dia.horarios = dia.horarios.map(hora => new Date(hora));
                dia.escenarios = dia.escenarios.map(escenario => {
                    return escenario.map(concierto => {
                        concierto.banda.horaInicio = new Date(concierto.banda.horaInicio);
                        concierto.banda.horaFin = new Date(concierto.banda.horaFin);
                        return concierto;
                    });
                });

                return dia;
            });

        }



        this.state = {
            bandas
        }
    }

    actualizar = () => actualizar().then(bandas => {
        this.setState({ bandas })
    });



    render() {

        let carousel = (
            this.state.bandas ? (
                <Carousel interval={null} wrap={false} indicators={true}>

                    {
                        this.state.bandas.map((dia, index) => (
                            <Carousel.Item key={index}>
                                <Table >
                                    <thead>
                                        <tr><th><h3>{dia.fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}</h3></th></tr>
                                        <tr>
                                            <th>Hora</th>
                                            <th>Main</th>
                                            <th>Ritual</th>
                                            <th>Chaos</th>
                                            <th>Desert</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            dia.horarios.map((hora, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <th >
                                                            {hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </th>
                                                        {
                                                            dia.escenarios.map((escenario, idx) => {
                                                                var concierto = escenario.find(b => b.horario === index);
                                                                if (concierto)
                                                                    return (
                                                                        <BandaHorario key={idx} concierto={concierto} />
                                                                    )
                                                                else
                                                                    return null;
                                                            })
                                                        }
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>

                                </ Table>

                            </Carousel.Item>
                        ))
                    }

                </Carousel>
            ) : null

        )

        return (
            <Row><Col>
                <h1>Resurrection </h1>
                <button className="btn btn-primary" onClick={this.actualizar}>Actualizar</button>
                {carousel}
            </Col></Row>


        )
    }
}

class BandaHorario extends Component {
    render() {
        if (this.props.concierto.banda.nombre) {
            return (<td rowSpan={this.props.concierto.rowSpan} className={this.getTdClassName()}>
                <Link to={{ pathname: `/banda/${this.props.concierto.banda.nombre}`, state: { banda: this.props.concierto.banda } }} className={this.getLinkClassName()} >
                    <Container >
                        <Row><strong>{this.props.concierto.banda.nombre}</strong>&nbsp;({this.props.concierto.banda.relevancia})</Row>
                        <Row><em>{`${this.props.concierto.banda.horaInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}-${this.props.concierto.banda.horaFin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</em></Row>
                    </Container>
                </Link>
            </td >)
        }
        else {
            return (<td rowSpan={this.props.concierto.rowSpan}></td >)
        }

    }

    getLinkClassName = () => {
        var className = "text-light";


        if (this.props.concierto.banda.relevancia < 3.5 && this.props.concierto.banda.relevancia >= 2.5 && this.props.concierto.banda.preferencia !== "TRUE") {
            className = "text-dark";
        }

        return className;
    }

    getTdClassName = () => {
        var className = "";
        if (!this.props.concierto.banda.relevancia) {
            className = "bg-secondary";
        }
        else if (this.props.concierto.banda.relevancia < 2.5) {
            className = "bg-danger";
        }
        else if (this.props.concierto.banda.relevancia < 3.5) {
            className = "bg-warning";
        }
        else {
            className = "bg-success";
        }

        if (this.props.concierto.banda.preferencia === "TRUE") {
            className = "bg-primary";
        }

        return "align-middle " + className;
    }
}





export default Resurrection;