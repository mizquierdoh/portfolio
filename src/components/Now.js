import React, { Component } from 'react';
import { Button, CardGroup, Card, ListGroup } from 'react-bootstrap'
import cheerio from 'cheerio';
import Countdown from 'react-countdown-now';
import { MDBIcon } from 'mdbreact';


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

    render() {
        var ahora = new Date();



        return (
            <CardGroup>
                {

                    this.state.bandas[this.getDia(ahora)]
                        .escenarios.map((escenario, index, self) => {
                            var conciertoActual = escenario.find(concierto => concierto.banda.horaFin.getTime() >= ahora.getTime());
                            if (!conciertoActual) {
                                return null;
                            }

                            var bandaActual = conciertoActual.banda;
                            var tocando = bandaActual.horaInicio.getTime() <= ahora.getTime();

                            return (



                                <Card className="text-center" key={index} >
                                    <Card.Header>{bandaActual.escenario}</Card.Header>
                                    <Card.Body>
                                        <Card.Title>{`${bandaActual.nombre} - (${bandaActual.relevancia})`}</Card.Title>



                                        <ListGroup>
                                            <ListGroup.Item>
                                                <Card.Subtitle>{`${bandaActual.horaInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}-${bandaActual.horaFin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</Card.Subtitle>
                                            </ListGroup.Item>
                                            <ListGroup.Item className={tocando ? "text-dark" : "text-danger"}>
                                                <Countdown
                                                    date={tocando ? bandaActual.horaFin : bandaActual.horaInicio}

                                                />
                                            </ListGroup.Item>


                                        </ListGroup>
                                        <Card.Text className="text-left">
                                            {bandaActual.descripcion}
                                        </Card.Text>


                                    </Card.Body>
                                    <Card.Footer className="text-left">
                                        <Button variant="primary" block onClick={() => this.navegarBandas(bandaActual)}>

                                            <MDBIcon icon="info-circle" size="2x" />


                                        </Button>

                                    </Card.Footer>
                                </Card>




                            )
                        })

                }
            </CardGroup>


        )
    }
}

export default Now;