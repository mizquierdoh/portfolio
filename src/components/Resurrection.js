import React, { Component } from 'react';
import cheerio from 'cheerio';


const urlResurrection = 'http://www.resurrectionfest.es/';
const corsUrl = 'https://cors-anywhere.herokuapp.com/'

class Resurrection extends Component {

    state = { horario: [] }

    searchBands = () => {

        fetch(`${corsUrl}${urlResurrection}/horarios/`)
            .then((response) => {
                return response.text()
            })
            .then(text => {

                this.setState({ elemento: (<div dangerouslySetInnerHTML={{ __html: text }}></div>) });
                var cher = cheerio.load(text);
                const parser = new DOMParser();
                const doc = parser.parseFromString(cher.xml(), 'text/html');
                var miercolesHTML = doc.querySelector("#page-top > div.wrap.container > div > div:nth-child(2) > article > div > div > div:nth-child(14)");
                var miercoles = {};
                miercoles.fecha = new Date(2019, 6, 3, 0, 0, 0);
                miercoles.escenario = [];
                miercoles.nombre = "Miércoles";



                var hijos = miercolesHTML.querySelector("#page-top > div.wrap.container > div > div:nth-child(2) > article > div > div > div:nth-child(14) > p:nth-child(2)")
                    .innerHTML.split("<br>");

                for (var i = 0; i < hijos.length; i++) {
                    if (i === 0) {
                        var j = miercoles.escenario.length;
                        miercoles.escenario[miercoles.escenario.length] = { id: j, nombre: hijos[i].replace("<em>", "").replace("</em>", ""), bandas: [] };
                    }
                    else {

                        var banda = {
                            id: i,
                            horaInicio: new Date(2019, 6, 3, hijos[1].substring(1, 6).split(':')[0], hijos[1].substring(1, 6).split(':')[1], 0),
                            horaFin: new Date(2019, 6, 3, hijos[1].substring(9, 14).split(':')[0], hijos[1].substring(9, 14).split(':')[1], 0),

                            nombre: hijos[i].substr(15)
                        };
                        console.log(banda);
                        miercoles.escenario[0].bandas[i - 1] = banda;
                    }
                }
                console.log('dia', miercoles);

                console.log('miercoles', miercolesHTML);
                console.log('children', hijos);

                this.setState({ horario: [miercoles] })
            })

            .catch((error) => console.log(error, error.message));

    }

    componentDidMount() {
        this.searchBands();
    }

    render() {
        return (
            <div>
                <h1>Resurrection</h1>
                <div>
                    {
                        this.state.horario.map(dia => (
                            <div key={dia.fecha.getDate()}>
                                <h2>{dia.nombre} <em>{dia.fecha.toLocaleDateString()}</em></h2>
                                <div>
                                    {
                                        dia.escenario.map(escenario => (
                                            <div key={escenario.id}>
                                                <h3>{escenario.nombre}</h3>
                                                <div>
                                                    <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">Inicio</th>
                                                                <th scope="col">Final</th>
                                                                <th scope="col">Banda</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                escenario.bandas.map(banda => (
                                                                    <tr key={banda.id}>
                                                                        <td>{banda.horaInicio.toLocaleTimeString()}</td>
                                                                        <td>{banda.horaFin.toLocaleTimeString()}</td>
                                                                        <td>{banda.nombre}</td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>

                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default Resurrection;