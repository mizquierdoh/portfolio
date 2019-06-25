import React, { Component } from 'react';
import { Row, Col, Card, Carousel, ListGroup } from 'react-bootstrap';
import { corsUrl, urlResurrection } from '../services/Bandas';
import cheerio from 'cheerio';

const API_ADDRESS = 'https://spotify-api-wrapper.appspot.com';

class Banda extends Component {

    state = { nombre: "", banda: {}, artist: {}, imagenes: [] }

    constructor(props) {
        super(props);
        this.state = {
            nombre: this.props.match.params.banda,
            banda: this.props.location.state.banda,
            artist: {},
            imagenes: []
        };

    }



    searchArtist = () => {
        fetch(`${API_ADDRESS}/artist/${this.state.banda.nombre}`)
            .then((response) => {
                return response.json();
            })
            .then(json => {
                if (json.artists.total > 0) {
                    const artist = json.artists.items[0];
                    if (artist) {
                        this.setState({ artist });

                        var imagenes = this.state.imagenes;
                        imagenes.push(artist.images[0].url);
                        this.setState({ imagenes });
                    }
                    fetch(`${API_ADDRESS}/artist/${artist.id}/top-tracks`)
                        .then(response => response.json())
                        .then(json => {
                            this.setState({ tracks: json.tracks });
                        })
                        .catch(error => alert(error.message));
                }

            })
            .catch(error => alert(error.message));

    }


    render() {


        return (
            <Card className="text-center">
                <Card.Header><h2>{this.state.nombre}  - {this.state.banda.relevancia}</h2> </Card.Header>




                <Carousel>
                    {
                        this.state.imagenes.map((img, index) => (
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
                        <ListGroup.Item>
                            {this.state.banda.procedencia}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            {this.state.artist.genres ? (this.state.artist.genres.join(", ")) : null}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Popularidad: {this.state.artist.popularity ? (this.state.artist.popularity) : null}
                        </ListGroup.Item>
                    </ListGroup>
                    <Card.Text className="text-left">
                        <br />{this.state.banda.descripcion}
                    </Card.Text>

                </Card.Body>
            </Card>




        );
    }

    tratarNombre(nombre) {
        var nom = nombre.toLowerCase().replace(/\s/g, "-").normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        console.log(nombre, nom);
        return nom;
    }

    componentDidMount() {
        this.searchArtist();
        fetch(`${corsUrl}${urlResurrection}/bands/${this.tratarNombre(this.state.banda.nombre)}`)
            .then((response) => {
                return response.text()
            })
            .then(text => {

                var cher = cheerio.load(text);
                const parser = new DOMParser();
                const doc = parser.parseFromString(cher.xml(), 'text/html');
                var img = doc.querySelector("#page-top > div.wrap.container > div > div.row.rf-main-content > article > div > div.rf16-featured-image.col-md-8.col-lg-8.col-sm-12.col-xs-12 > a > img")
                console.log(img);
                if (img) {
                    var imagenes = this.state.imagenes;
                    imagenes.push(img.src);
                    this.setState({ imagenes });
                    console.log(this.state.imagenes);
                }
            })
    }
}


export default Banda;