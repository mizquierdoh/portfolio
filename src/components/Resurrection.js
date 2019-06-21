import React, { Component } from 'react';
import cheerio from 'cheerio';


const urlResurrection = 'http://www.resurrectionfest.es/';
const corsUrl = 'https://cors-anywhere.herokuapp.com/'

const unique = (value, index, self) => {
    return self.indexOf(value) === index
}


class Resurrection extends Component {

    state = { bandas: [], horarios: [] }

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
                return bandas;
            })
            .then(bandas => {

                var horarios = bandas.map(banda => banda.horaInicio)
                    .concat(bandas.map(banda => banda.horaFin))
                    .filter(unique).sort((a, b) => a - b);
                console.log(horarios);
                localStorage.setItem('bandas', JSON.stringify(bandas));
                localStorage.setItem('horarios', JSON.stringify(horarios));
                this.setState({ bandas: bandas.sort(this.compararFechas), horarios });
            })

            .catch((error) => console.log(error, error.message));
    }

    searchBands = () => {
        if (localStorage.getItem('bandas') && localStorage.getItem('horarios')) {
            var horarios = JSON.parse(localStorage.getItem('horarios')).map(hora => new Date(hora));
            this.setState({
                bandas: JSON.parse(localStorage.getItem('bandas')).map(banda => {
                    banda.horaInicio = new Date(banda.horaInicio);
                    banda.horaFin = new Date(banda.horaFin);
                    return banda;
                }).sort(this.compararFechas),
                horarios

            })
            console.log(this.state.horarios);
            return;
        }
        this.actualizarBands();



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
            dia = 5
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
                    var banda = {
                        id: bandas.length,
                        horaInicio: new Date(2019, 6, diaInicio, horaInicio, minInicio, 0),
                        horaFin: new Date(2019, 6, diaFin, horaFin, minFin, 0),
                        escenario: escenario,
                        nombre
                    };
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

    componentDidMount() {
        this.searchBands();

    }

    render() {

        return (
            <div>
                <h1>Resurrection </h1>
                <div>
                    <table className="table" >
                        <thead>
                            <tr>
                                {/* <th scope="col">Banda</th>
                                <th scope="col">Día</th>
                                <th scope="col">Escenario</th>
                                <th scope="col">Inicio</th>
                                <th scope="col">Final</th> */}
                                <th scope="col">Hora</th>
                            </tr>
                        </thead>

                        < tbody >
                            {

                                this.state.bandas.map((banda, index, self) => (
                                    <tr key={banda.id} >

                                        < td > {banda.nombre} </td>
                                        <td> {this.getDia(banda.horaInicio)}</td>
                                        <td> {banda.escenario}</td>
                                        <td>{banda.horaInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} </td>
                                        < td > {banda.horaFin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} </td>

                                    </tr>
                                ))
                                // this.state.horarios.map((hora, index) => (
                                //     <tr key={index} ><th scope="row">{hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</th></tr>
                                // ))


                            }
                        </tbody>
                    </table>
                </div>
            </div>


        )
    }
}

export default Resurrection;