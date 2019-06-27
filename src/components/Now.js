import React, { Component } from 'react';
import { CardGroup } from 'react-bootstrap'
import Banda from './Banda';

class Now extends Component {

    state = { bandas: [] };
    constructor() {
        super();
        var bandas = [];
        var ahora = new Date();

        if (localStorage.getItem('bandas')) {

            if (localStorage.getItem('bandas')) {

                var dias = JSON.parse(localStorage.getItem('bandas')).map(dia => {

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

                bandas = dias[this.getDia(ahora)]
                    .escenarios.map(escenario => {
                        var conciertoActual = escenario.find(concierto => concierto.banda.horaFin.getTime() >= ahora.getTime());
                        if (!conciertoActual) {
                            return null;
                        }
                        return conciertoActual.banda;
                    });
            }
            this.state = { bandas }
        }
    }

    getDia(ahora) {
        if (ahora.getTime() <= new Date(2019, 6, 3, 17, 30).getTime() || ahora.getTime() >= new Date(2019, 6, 7, 3).getTime()) {
            return 0;
        }
        if (ahora.getHours() < 5) {
            return ahora.getDay() - 4;
        }
        return Math.max(ahora.getDay() - 3, 0);
    }

    getHorario(dia, horaActual) {
        return dia.horarios.indexOf(dia.horarios.find((hora, index, self) =>
            hora <= horaActual
            && (index === self.length - 1 ||
                self[index + 1] >= horaActual)))
    }

    navegarBandas = (bandaActual) => {
        this.props.history.push({ pathname: `/banda/${bandaActual.nombre}`, state: { banda: bandaActual } });
    }

    componentDidMount() {

    }

    render() {
        return (
            <CardGroup>
                {

                    this.state.bandas.map((bandaActual, index) => {

                        if (!bandaActual)
                            return null;

                        return (
                            <Banda key={index} banda={bandaActual} />

                        )
                    })

                }
            </CardGroup>

        )
    }
}

export default Now;