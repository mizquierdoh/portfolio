import React, { Component } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import Carousel from 'react-bootstrap/Carousel'
import Button from 'react-bootstrap/Button'
import { MDBIcon } from "mdbreact";

import { actualizar, getBandasLocalStorage } from '../services/Bandas';
import { getWeather } from '../services/Aemet'

import packageJson from '../../package.json';
import { Container, Image } from 'react-bootstrap';

class Resurrection extends Component {

    state = { bandas: [] }

    constructor() {
        super();

        var bandas = [];

        if (localStorage.getItem('bandas')) {

            bandas = getBandasLocalStorage();

        }
        console.log(JSON.parse(localStorage.getItem("prediccion")));

        var prediccion = JSON.parse(localStorage.getItem("prediccion")) ? JSON.parse(localStorage.getItem("prediccion")).map(p => {
            p.hora = new Date(p.hora);
            return p;
        }) : [];
        this.state = {
            bandas,
            prediccion
        }

        this.refSubir = React.createRef();
    }

    actualizar = () => {

        this.setState({ bandas: actualizar() });
    }

    descargar = () => {
        let filename = "resurrection.json";
        let contentType = "application/json;charset=utf-8;";
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(this.state.bandas)))], { type: contentType });
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            var a = document.createElement('a');
            a.download = filename;
            a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(this.state.bandas));
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    subir = () => {
        this.refSubir.current.click();
    }



    handleSubir = (event) => {
        var reader = new FileReader();
        reader.onload = (event) => {
            var jsonObj = JSON.parse(event.target.result);
            localStorage.setItem('bandas', JSON.stringify(jsonObj));
            this.setState({ bandas: getBandasLocalStorage() });
        };
        reader.readAsText(event.target.files[0]);
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

        getWeather().then(p => {
            console.log(p);
            this.setState({ prediccion: p });
            localStorage.setItem("prediccion", JSON.stringify(p));
        });
    }

    render() {

        let carousel = (
            this.state.bandas ? (
                <Carousel interval={null} wrap={false} indicators={true} className="h-100">

                    {
                        this.state.bandas.map((dia, index) => (
                            <Carousel.Item key={index} className="h-100">
                                <Table responsive className="h-100">
                                    <thead >
                                        <tr><th colSpan="5"><h3>{dia.fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}</h3></th></tr>
                                        <tr>
                                            <th>Hora</th>
                                            <th>Main</th>
                                            <th>Ritual</th>
                                            <th>Chaos</th>
                                            <th>Desert</th>
                                        </tr>
                                    </thead>
                                    <tbody className="h-100">
                                        {

                                            dia.horarios.map((hora, index) => {
                                                var datosPrediccion = this.state.prediccion.find((p, index, self) => p.hora.getTime() <= hora.getTime()
                                                    && (!self[index + 1] || self[index + 1].hora.getTime() > hora.getTime()))

                                                let prediccion = datosPrediccion ? (
                                                    <>
                                                        <Row>

                                                            {datosPrediccion.estadoCielo ? (<Image src={require("../resources/aemet/" + datosPrediccion.estadoCielo.valor + ".png")} alt={datosPrediccion.estadoCielo.descripcion} />) : null}

                                                        </Row>
                                                        <Row>
                                                            {datosPrediccion.temperatura} ºC
                                                    </Row>
                                                    </>
                                                ) : null
                                                return (
                                                    <tr key={index} className="h-100">
                                                        <th >
                                                            <Container>
                                                                <Row>
                                                                    {hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </Row>
                                                                {prediccion}
                                                            </Container>

                                                        </th>
                                                        {
                                                            dia.escenarios.map((escenario, idx) => {
                                                                var concierto = escenario.find(b => b.horario === index);
                                                                if (concierto)
                                                                    return (
                                                                        <BandaHorario key={idx} concierto={concierto} super={this} className="h-100" />
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
            <Container className="h-100">
                <Row><Col>
                    <h1>Resurrection </h1>
                    <Button onClick={this.actualizar} className="p-3">
                        <MDBIcon icon="sync-alt" size="2x" />
                    </Button>
                    <Button onClick={this.subir} className="p-3">
                        <MDBIcon icon="folder-open" size="2x" />
                    </Button>
                    <Button onClick={this.descargar} className="p-3">
                        <MDBIcon icon="save" size="2x" />
                    </Button>
                    <input type="file" ref={this.refSubir} style={{ display: "none" }} onChange={this.handleSubir} />
                </Col></Row>
                <Row className="h-100"><Col className="h-100">
                    {carousel}
                </Col></Row>
            </Container>

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
            return (<td rowSpan={this.props.concierto.rowSpan} ref={this.celda} className="h-100 m-0 p-0" >
                <button
                    type="button"
                    className={`btn ${this.getVariant()} ${this.getTextClassName()} h-100 w-100 m-0`}

                    onClick={() => this.state.super.navegarBandas(this.props.concierto.banda)}

                >
                    <Row className="text-center"><strong>{this.props.concierto.banda.nombre}</strong>&nbsp;({this.props.concierto.banda.relevancia})</Row>
                    <Row className="text-center"><em className="text-center">{`${this.props.concierto.banda.horaInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}-${this.props.concierto.banda.horaFin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</em></Row>
                </button>
            </td >)
        }
        else {
            return (<td rowSpan={this.props.concierto.rowSpan}></td >)
        }

    }

    getTextClassName = () => {
        var className = "text-light";

        if (this.props.concierto.banda.relevancia < 3.5 && this.props.concierto.banda.relevancia >= 2.5 && !this.props.concierto.banda.preferencia) {
            className = "text-dark";
        }

        return className;
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
        return "btn-" + variant;
    }
}

export default Resurrection;