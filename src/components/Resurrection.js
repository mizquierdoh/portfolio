import React, { Component } from 'react';
import cheerio from 'cheerio';


const urlResurrection = 'http://www.resurrectionfest.es/';
const corsUrl = 'https://cors-anywhere.herokuapp.com/'


class Resurrection extends Component {

    state = { bandas: [] }

    searchBands = () => {

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

                this.tratarHTML(miercolesHTML);
                this.tratarHTML(juevesHTML);
                this.tratarHTML(viernesHTML);
                this.tratarHTML(sabadoHTML);
                console.log(this.state.bandas.sort(this.compararFechas));

                // var hijos = miercolesHTML.querySelector("#page-top > div.wrap.container > div > div:nth-child(2) > article > div > div > div:nth-child(14) > p:nth-child(2)")
                //     .innerHTML.split("<br>");

                // var escenario;
                // var bandas = [];

                // for (var i = 0; i < hijos.length; i++) {
                //     if (i === 0) {
                //         escenario = hijos[i].replace("<em>", "").replace("</em>", "");
                //     }
                //     else {

                //         var banda = {
                //             id: i,
                //             horaInicio: new Date(2019, 6, 3, hijos[i].substring(1, 6).split(':')[0], hijos[i].substring(1, 6).split(':')[1], 0),
                //             horaFin: new Date(2019, 6, 3, hijos[i].substring(9, 14).split(':')[0], hijos[i].substring(9, 14).split(':')[1], 0),
                //             escenario: escenario,
                //             nombre: hijos[i].substr(15)
                //         };
                //         // console.log(banda);
                //         bandas.push(banda);
                //     }
                // }
                // console.log('bandas', bandas);

                // console.log('miercoles', miercolesHTML);
                // console.log('children', hijos);

                // this.setState({ bandas: bandas.sort(this.compararFechas) });
            })

            .catch((error) => console.log(error, error.message));

    }

    compararFechas(a, b) {
        var fA = a.horaInicio;
        var fB = b.horaInicio;
        return fA - fB;
        // if (fA.getDate() !== fB.getDate()) {
        //     return fA.getDate() - fB.getDate();
        // }
        // else if (fA.getHours() !== fB.getHours()) {
        //     return fA.getHours() - fB.getHours()
        // }
        // else if (fA.getMinutes() !== fB.getMinutes()) {
        //     return fA.getMinutes() - fB.getMinutes()
        // }
        // else {
        //     return 0;
        // }


    }

    tratarHTML = (html) => {
        var bandas = this.state.bandas.sort(this.compararFechas);
        var nodosDia = Array.from(html.childNodes).filter(node => node.nodeName !== "#text");
        var dia = nodosDia[0].childNodes[0].innerText.substring(1, 2);

        nodosDia = nodosDia.slice(1);
        var escenario;
        nodosDia.forEach(nodoDia => {
            var nodosEscenarios = Array.from(nodoDia.childNodes).filter(nodo => nodo.nodeName !== "BR");
            // console.log(nodosEscenarios);
            var i = 0;
            nodosEscenarios.forEach(nodoEscenarios => {

                if (i === 0) {
                    if (nodoEscenarios.nodeName === "EM") {
                        escenario = nodoEscenarios.innerText;
                    }
                    else {
                        escenario = nodoEscenarios.textContent;
                    }
                    // console.log(nodoEscenarios, escenario);

                }
                else {


                    var horaInicio = nodoEscenarios.textContent.substring(1, 6).split(':')[0];
                    var minInicio = nodoEscenarios.textContent.substring(1, 6).split(':')[1];
                    var horaFin = nodoEscenarios.textContent.substring(9, 14).split(':')[0];
                    var minFin = nodoEscenarios.textContent.substring(9, 14).split(':')[1];
                    var nombre = nodoEscenarios.textContent.substr(15)
                    var diaInicio = dia;
                    if (horaInicio < 5) {
                        diaInicio++;
                    }
                    var diaFin;
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
                    console.log(nodoEscenarios, dia, escenario, horaInicio, minInicio, horaFin, minFin, nombre, banda);
                    bandas.push(banda);
                    console.log(bandas);

                }
                i++;
            })

        })

        this.setState({ bandas: bandas.sort(this.compararFechas) })





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
                                <th scope="col">Banda</th>
                                <th scope="col">Día</th>
                                <th scope="col">Escenario</th>
                                <th scope="col">Inicio</th>
                                <th scope="col">Final</th>
                            </tr>
                        </thead>

                        < tbody >
                            {

                                this.state.bandas.map(banda => (
                                    <tr key={banda.id} >
                                        < td > {banda.nombre} </td>
                                        <td> {this.getDia(banda.horaInicio)}</td>
                                        <td> {banda.escenario}</td>
                                        <td>{banda.horaInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} </td>
                                        < td > {banda.horaFin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} </td>

                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>


        )
    }
}

export default Resurrection;