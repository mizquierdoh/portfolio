import React, { Component } from 'react';
import { Row, Col, Container, Card } from 'react-bootstrap'


class Now extends Component {

    state = { bandas: [] };
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

        this.state = { bandas };

    }

    getDia(ahora) {
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

    render() {
        var ahora = new Date(2019, 6, 4, 20, 30, 0);



        return (
            <Container>

                {

                    this.state.bandas[this.getDia(ahora)]
                        .escenarios.map((escenario, index, self) => {
                            var bandaActual = escenario.find(concierto => concierto.banda.horaFin.getTime() >= ahora.getTime()).banda;

                            return (

                                <Card className="text-center" key={index} style={{ width: '18rem' }}>
                                    <Card.Header>{bandaActual.escenario}</Card.Header>
                                    <Card.Body>
                                        <Card.Title>{`${bandaActual.nombre} - (${bandaActual.relevancia})`}</Card.Title>
                                        <Card.Subtitle>{`${bandaActual.horaInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}-${bandaActual.horaFin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</Card.Subtitle>
                                        <Card.Text >


                                            <p className="text-left">{bandaActual.descripcion}</p>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>


                            )
                        })

                }


            </Container>

        )
    }
}

export default Now;