import React, { Component } from 'react';
import { Card, Carousel, ListGroup, Container } from 'react-bootstrap';

import { getBanda } from '../services/Bandas'
import Countdown from 'react-countdown-now';

class Banda extends Component {

    state = { banda: {} }

    constructor(props) {
        super(props);
        console.log(props);
        if (props.banda) {
            this.state.banda = props.banda;
        }
        else {
            this.state = {
                banda: this.props.location.state.banda,
            };
        }

    }

    componentDidMount() {
        getBanda(this.state.banda)
            .then((banda) => this.setState({ banda }));

    }

    getVariant = () => {
        var variant = "";
        if (!this.state.banda.relevancia) {
            variant = "secondary";
        }
        else if (this.state.banda.relevancia < 2.5) {
            variant = "danger";
        }
        else if (this.state.banda.relevancia < 3.5) {
            variant = "warning";
        }
        else {
            variant = "success";
        }

        if (this.state.banda.preferencia === "TRUE") {
            variant = "primary";
        }
        return variant;
    }
    getTextColor = (invertir = false) => {
        var className = "white";

        if (invertir || (this.state.banda.relevancia < 3.5 && this.state.banda.relevancia >= 2.5 && this.state.banda.preferencia !== "TRUE")) {
            className = "dark";
        }
        else {
            className = "white";
        }

        return className;
    }

    render() {
        var ahora = new Date();
        ahora.setDate(ahora.getDate() + 7);
        var tocando = this.state.banda.horaInicio.getTime() <= ahora.getTime();

        return (
            <Card className="text-center" bg={this.getVariant()} text={this.getTextColor()}>
                <Card.Header><h3>{this.state.banda.nombre}  - {this.state.banda.relevancia}</h3> </Card.Header>
                {
                    <Carousel interval={null}>

                        {

                            this.state.banda.imagenes.map((img, index) => (
                                < Card.Img key={index} src={img} alt="imagen grupo" className="img-thumbnail" align="middle" />

                            ))
                        }

                    </Carousel>

                }
                <Card.Body>
                    <Card.Title>
                        <h3>{this.state.banda.escenario}

                        </h3>
                    </Card.Title>
                    <Card.Subtitle>
                        <h4><em>
                            {this.state.banda.horaInicio.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}
                            &nbsp;({this.state.banda.horaInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {" - "}
                            {this.state.banda.horaFin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                        </em></h4>
                    </Card.Subtitle>
                    <ListGroup className={"text-left text-" + this.getTextColor(true)}>
                        <ListGroup.Item className={(tocando ? "text-dark" : "text-danger") + " text-center"}>
                            <Countdown
                                date={tocando ? this.state.banda.horaFin : this.state.banda.horaInicio}

                            />
                        </ListGroup.Item>

                        {this.state.banda.procedencia ?
                            (<ListGroup.Item>
                                {this.state.banda.procedencia}
                            </ListGroup.Item>) : null
                        }
                        {this.state.banda.generos.length > 0 ?
                            (<ListGroup.Item>
                                {this.state.banda.generos.join(", ")}
                            </ListGroup.Item>) : null
                        }
                        {this.state.banda.popularidad ?
                            (<ListGroup.Item>
                                Popularidad: {this.state.banda.popularidad}
                            </ListGroup.Item>) : null}
                    </ListGroup>
                    <Card.Text className={"text-left text-" + this.getTextColor()} >
                        <br />{this.state.banda.descripcion}
                    </Card.Text>
                </Card.Body>
            </Card >
        );
    }

}

export default Banda;