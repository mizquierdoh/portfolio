import React, { Component } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import Carousel from 'react-bootstrap/Carousel'
import Button from 'react-bootstrap/Button'

import { actualizar, getBandasLocalStorage } from '../services/Bandas';
import { getWeather } from '../services/Aemet'

import packageJson from '../../package.json';

class Resurrection extends Component {

    state = { bandas: [] }

    constructor() {
        super();

        var bandas = [];

        if (localStorage.getItem('bandas')) {

            bandas = getBandasLocalStorage();

        }

        this.state = {
            bandas
        }
    }

    actualizar = () => {

        this.setState({ bandas: actualizar() });
    }

    navegarBandas = (bandaActual) => {
        this.props.history.push({ pathname: `/banda/${bandaActual.id}` });
    }

    componentDidMount() {
        var version = packageJson.version;
        if (localStorage.getItem('version') && localStorage.getItem('version') !== version) {
            localStorage.clear();
            localStorage.setItem('version', version);
            this.actualizar();
        }

        getWeather();
    }

    render() {

        let carousel = (
            this.state.bandas ? (
                <Carousel interval={null} wrap={false} indicators={true}>

                    {
                        this.state.bandas.map((dia, index) => (
                            <Carousel.Item key={index}>
                                <Table responsive>
                                    <thead>
                                        <tr><th colSpan="5"><h3>{dia.fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}</h3></th></tr>
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
                                                                        <BandaHorario key={idx} concierto={concierto} super={this} />
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
    state = { super: {} }
    constructor(props) {
        super();
        this.state = { super: props.super };
    }

    render() {
        if (this.props.concierto.banda.nombre) {
            return (<td rowSpan={this.props.concierto.rowSpan} className="align-middle p-0 m-0">
                <Button className={this.getLinkClassName} variant={this.getVariant()} block onClick={() => this.state.super.navegarBandas(this.props.concierto.banda)}>
                    <Row><strong>{this.props.concierto.banda.nombre}</strong>&nbsp;({this.props.concierto.banda.relevancia})</Row>
                    <Row><em>{`${this.props.concierto.banda.horaInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}-${this.props.concierto.banda.horaFin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</em></Row>
                </Button>
            </td >)
        }
        else {
            return (<td rowSpan={this.props.concierto.rowSpan}></td >)
        }

    }

    getLinkClassName = () => {
        var className = "text-light";

        if (this.props.concierto.banda.relevancia < 3.5 && this.props.concierto.banda.relevancia >= 2.5 && !this.props.concierto.banda.preferencia) {
            className = "text-dark";
        }

        return className + " text-center mh-100";
    }

    getVariant = () => {
        var variant = "";
        if (!this.props.concierto.banda.relevancia) {
            variant = "secondary";
        }
        else if (this.props.concierto.banda.relevancia < 2.5) {
            variant = "danger";
        }
        else if (this.props.concierto.banda.relevancia < 3.5) {
            variant = "warning";
        }
        else {
            variant = "success";
        }

        if (this.props.concierto.banda.preferencia) {
            variant = "primary";
        }
        return variant;
    }
}

export default Resurrection;