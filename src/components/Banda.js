import React, { Component } from 'react';
import { Row, Col, Card, Carousel, ListGroup } from 'react-bootstrap';
import { corsUrl, urlResurrection } from '../services/Bandas';
import cheerio from 'cheerio';
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

    render() {
        var ahora = new Date();
        ahora.setDate(ahora.getDate() + 7);
        var tocando = this.state.banda.horaInicio.getTime() <= ahora.getTime();

        return (
            <Card className="text-center">
                <Card.Header><h2>{this.state.banda.nombre}  - {this.state.banda.relevancia}</h2> </Card.Header>
                <Carousel>
                    {
                        this.state.banda.imagenes.map((img, index) => (
                            <Card.Img key={index} src={img} alt="imagen grupo" className="img-thumbnail" />
                        ))

                    }
                </Carousel>
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
                    <ListGroup className="text-left">
                        <ListGroup.Item className={tocando ? "text-dark" : "text-danger"}>
                            <Countdown
                                date={tocando ? this.state.banda.horaFin : this.state.banda.horaInicio}

                            />
                        </ListGroup.Item>
                        <ListGroup.Item>
                            {this.state.banda.procedencia}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            {this.state.banda.generos.join(", ")}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Popularidad: {this.state.banda.popularidad}
                        </ListGroup.Item>
                    </ListGroup>
                    <Card.Text className="text-left">
                        <br />{this.state.banda.descripcion}
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }

}

export default Banda;