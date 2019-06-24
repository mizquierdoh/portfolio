import React, { Component } from 'react';
import cheerio from 'cheerio';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import Carousel from 'react-bootstrap/Carousel'
import Container from 'react-bootstrap/Container'

import Bandas from '../data/Bandas';


const urlResurrection = 'http://www.resurrectionfest.es/';
const corsUrl = 'https://cors-anywhere.herokuapp.com/'

const unique = (value, index, self) => {
    return self.indexOf(value) === index
}


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
                var bandasTemp = [];
                bandasTemp[0] = this.tratarHTML(miercolesHTML).sort(this.compararFechas);
                bandasTemp[1] = this.tratarHTML(juevesHTML).sort(this.compararFechas);
                bandasTemp[2] = this.tratarHTML(viernesHTML).sort(this.compararFechas);
                bandasTemp[3] = this.tratarHTML(sabadoHTML).sort(this.compararFechas);

                var bandas = bandasTemp.map((bandasDia, index) => {

                    var fecha = new Date(2019, 6, 3 + index, 12, 0, 0);
                    var horarios = bandasDia.map(banda => banda.horaInicio)
                        .concat(bandasDia.map(banda => banda.horaFin))
                        .map(fecha => fecha.toString())
                        .filter(unique)
                        .map(fecha => new Date(fecha))
                        .sort((a, b) => a - b);

                    var mainStage = this.getEscenario(bandasDia, "Main Stage", horarios.map(fecha => fecha.toString()));
                    var ritualStage = this.getEscenario(bandasDia, "Ritual Stage", horarios.map(fecha => fecha.toString()));
                    var chaosStage = this.getEscenario(bandasDia, "Chaos Stage", horarios.map(fecha => fecha.toString()));
                    var desertStage = this.getEscenario(bandasDia, "Desert Stage", horarios.map(fecha => fecha.toString()));
                    var escenarios = [mainStage, ritualStage, chaosStage, desertStage];



                    var dia = {
                        fecha,
                        horarios,
                        escenarios
                    };
                    return dia;
                }

                )

                this.setState({ bandas });
                localStorage.setItem('bandas', JSON.stringify(bandas));
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

    tratarHTML = (html) => {
        var bandas = [];
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
                <Carousel interval={null} warp={false} indicators={true}>

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

                </Carousel></Col></Row>


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