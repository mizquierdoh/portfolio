import React, { Component } from 'react';
import cheerio from 'cheerio';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import Alert from 'react-bootstrap/Alert'
import Container from 'react-bootstrap/Container'

import Bandas from '../data/Bandas';


const urlResurrection = 'http://www.resurrectionfest.es/';
const corsUrl = 'https://cors-anywhere.herokuapp.com/'

const unique = (value, index, self) => {
    return self.indexOf(value) === index
}


class Resurrection extends Component {

    state = { bandas: [], horarios: [], escenarios: [] }

    constructor() {
        super();
        var bandas = [];
        var horarios = [];
        var escenarios = [];
        if (localStorage.getItem('bandas')) {

            bandas = JSON.parse(localStorage.getItem('bandas')).map(banda => {
                banda.horaInicio = new Date(banda.horaInicio);
                banda.horaFin = new Date(banda.horaFin);
                return banda;
            });

        }

        if (localStorage.getItem('horarios')) {
            horarios = JSON.parse(localStorage.getItem('horarios')).map(hora => new Date(hora));
        }

        if (localStorage.getItem('escenarios')) {
            escenarios = JSON.parse(localStorage.getItem('escenarios'))
                .map(escenario => {
                    return escenario.map(banda => {
                        banda.banda.horaInicio = new Date(banda.banda.horaInicio);
                        banda.banda.horaFin = new Date(banda.banda.horaFin);
                        return banda;
                    });
                });
        }

        this.state = {
            bandas, horarios, escenarios
        }
    }

    actualizarBands = () => {
        fetch(`${corsUrl}${urlResurrection}/horarios/`)
            .then((response) => {
                return response.text()
            })
            .then(text => {

                var cher = cheerio.load(text);
                const parser = new DOMParser();
                const doc = parser.parseFromString(cher.xml(), 'text/html');
                var miercolesHTML = doc.querySelector("#page-top > div.wrap.container > div > div:nth-child(2) > article > div > div > div:nth-child(14)");
                var juevesHTML = doc.querySelector("#page-top > div.wrap.container > div > div:nth-child(2) > article > div > div > div:nth-child(15)");
                var viernesHTML = doc.querySelector("#page-top > div.wrap.container > div > div:nth-child(2) > article > div > div > div:nth-child(16)");
                var sabadoHTML = doc.querySelector("#page-top > div.wrap.container > div > div:nth-child(2) > article > div > div > div:nth-child(17)");
                var bandas = [];
                bandas = this.tratarHTML(bandas, miercolesHTML);
                bandas = this.tratarHTML(bandas, juevesHTML);
                bandas = this.tratarHTML(bandas, viernesHTML);
                bandas = this.tratarHTML(bandas, sabadoHTML);
                return bandas.sort(this.compararFechas);
            })
            .then(bandas => {

                var horarios = bandas.map(banda => banda.horaInicio)
                    .concat(bandas.map(banda => banda.horaFin))
                    .map(fecha => fecha.toString())
                    .filter(unique)
                    .map(fecha => new Date(fecha))
                    .sort((a, b) => a - b);

                console.log(horarios);
                localStorage.setItem('bandas', JSON.stringify(bandas));
                localStorage.setItem('horarios', JSON.stringify(horarios));
                this.setState({ bandas: bandas, horarios });

                var mainStage = this.getEscenario(bandas, "Main Stage", horarios.map(fecha => fecha.toString()));
                var ritualStage = this.getEscenario(bandas, "Ritual Stage", horarios.map(fecha => fecha.toString()));
                var chaosStage = this.getEscenario(bandas, "Chaos Stage", horarios.map(fecha => fecha.toString()));
                var desertStage = this.getEscenario(bandas, "Desert Stage", horarios.map(fecha => fecha.toString()));

                this.setState({ escenarios: [mainStage, ritualStage, chaosStage, desertStage] });
                localStorage.setItem('escenarios', JSON.stringify([mainStage, ritualStage, chaosStage, desertStage]));


            })

            .catch((error) => console.log(error, error.message));
    }


    getEscenario(bandas, escenario, horarios) {
        var bandasEscenario = [];
        bandas.filter(b => b.escenario === escenario).forEach(banda => {


            var rowSpan = horarios.indexOf(banda.horaFin.toString()) - horarios.indexOf(banda.horaInicio.toString());
            var horario = horarios.indexOf(banda.horaInicio.toString());

            var vacio = {};
            if (horario !== 0) {
                if (bandasEscenario.length === 0) {
                    vacio = { horario: 0, rowSpan: horario };
                }
                else {
                    var horarioVacio = bandasEscenario[bandasEscenario.length - 1].horario + bandasEscenario[bandasEscenario.length - 1].rowSpan;
                    vacio = {
                        horario: horarioVacio,
                        rowSpan: horario - horarioVacio
                    }
                }
                if (vacio.rowSpan !== 0) {
                    bandasEscenario.push({
                        banda: { escenario: banda.escenario }, rowSpan: vacio.rowSpan, horario: vacio.horario
                    })
                }
            }


            bandasEscenario.push({
                banda, rowSpan, horario
            })
        })
        console.log(bandasEscenario);
        return bandasEscenario;
    }

    compararFechas(a, b) {
        var fA = a.horaInicio;
        var fB = b.horaInicio;
        return fA - fB;
    }

    tratarHTML = (bands, html) => {
        var bandas = bands;
        var nodosDia = Array.from(html.childNodes).filter(node => node.nodeName !== "#text");
        var dia;
        if ('14' === nodosDia[0].childNodes[0].innerText.substring(0, 2)) {
            dia = 6
        }
        else {
            dia = nodosDia[0].childNodes[0].innerText.substring(1, 2);
        }
        nodosDia = nodosDia.slice(1);
        var escenario;
        nodosDia.forEach(nodoDia => {
            var nodosEscenarios = Array.from(nodoDia.childNodes).filter(nodo => nodo.nodeName !== "BR");
            var i = 0;
            nodosEscenarios.forEach(nodoEscenarios => {

                if (i === 0) {
                    if (nodoEscenarios.nodeName === "EM") {
                        escenario = nodoEscenarios.innerText;
                    }
                    else {
                        escenario = nodoEscenarios.textContent;
                    }

                }
                else {


                    var horaInicio = nodoEscenarios.textContent.substring(1, 6).split(':')[0];
                    var minInicio = nodoEscenarios.textContent.substring(1, 6).split(':')[1];
                    var horaFin = nodoEscenarios.textContent.substring(9, 14).split(':')[0];
                    var minFin = nodoEscenarios.textContent.substring(9, 14).split(':')[1];
                    var nombre = nodoEscenarios.textContent.substr(15);
                    var diaInicio = dia;
                    if (horaInicio < 5) {
                        diaInicio++;
                    }
                    var diaFin = dia;
                    if (horaFin < 5) {
                        diaFin++;
                    }
                    var personalizado = Bandas.find(band => band.Grupo === nombre.toUpperCase());

                    var banda = {
                        id: bandas.length,
                        horaInicio: new Date(2019, 6, diaInicio, horaInicio, minInicio, 0),
                        horaFin: new Date(2019, 6, diaFin, horaFin, minFin, 0),
                        escenario: escenario,
                        nombre


                    };
                    if (personalizado) {
                        banda.preferencia = personalizado.Preferencia;
                        banda.relevancia = personalizado.Relevancia;
                        banda.procedencia = personalizado.Procedencia;
                        banda.descripcion = personalizado.Descripción;
                    }
                    bandas.push(banda);

                }
                i++;
            })


        })

        return bandas;




    }

    getDia(fecha) {

        var dia = fecha;
        if (fecha.getHours() < 4) {
            dia.setDate(fecha.getDate() - 1)
        }
        return dia.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' });
    }





    claseNombre(preferencia) {
        if (preferencia === 'TRUE') {
            return "success";
        }
        else if (preferencia === 'FALSE') {
            return "danger";
        }
        return "default";
    }

    render() {

        return (
            <Row><Col>
                <h1>Resurrection </h1>
                <button className="btn btn-primary" onClick={this.actualizarBands}>Actualizar</button>




                <Table >


                    <thead>
                        <tr>
                            <th>Hora</th>
                            <th>Main Stage</th>
                            <th>Ritual Stage</th>
                            <th>Chaos Stage</th>
                            <th>Desert Stage</th>



                        </tr>


                    </thead>

                    <tbody>
                        {


                            this.state.horarios.map((hora, index) => {
                                return (
                                    <tr key={index}>
                                        <th >
                                            {hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </th>
                                        {
                                            this.state.escenarios.map((escenario, idx) => {
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
            </Col></Row>


        )
    }
}

class BandaHorario extends Component {
    render() {
        if (this.props.concierto.banda.nombre) {
            return (<td rowSpan={this.props.concierto.rowSpan} className="align-middle">
                <Container >
                    <Row><p className="text-center">{this.props.concierto.banda.nombre}</p></Row>
                    <Row><p className="text-center"><em>{`${this.props.concierto.banda.horaInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}-${this.props.concierto.banda.horaFin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</em></p></Row>
                </Container>
            </td >)
        }
        else {
            return (<td rowSpan={this.props.concierto.rowSpan}></td >)
        }

    }
}


export default Resurrection;