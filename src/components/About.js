import React from 'react'
import { Button, Accordion, Card, Container, Image, ListGroup, Row } from 'react-bootstrap';
import logo_kofi from "../resources/logo_kofi.png"
import Contacto from './Contacto';

const About = () => (
    <Container className="mb-5">
        <Row className="my-2"><h1>Acerca de la App</h1></Row>
        <Row >

            <Accordion className="w-100">
                <Card >
                    <Card.Header>

                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            <h4>Sobre la aplicación</h4>
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0" >
                        <Card.Body style={{ textIndent: 10 }} className="text-justify">
                            <Card.Text className="text-dark">Quiero antes de nada dar las gracias a la organización del Resurrection Fest, que son capaces de llevar adelante año tras año este festivalazo. Estoy seguro que ellos sacarán una app bastante mejor que la mía, pero como explico más adelante, esto en principio iba a ser sólo para mi propio uso y disfrute.</Card.Text>
                            <Card.Text className="text-dark">Esta aplicación ha sido mi forma de manejar el hype para el festival en estas últimas semanas. En ningún momento había pensado en publicarla, pero vi que quedó medio decente y que puede llegar a ser útil a alguien más que a mí mismo.</Card.Text>
                            <Card.Text className="text-dark">La información se guarda en el teléfono y en ningún momento se guarda en ninguna base de datos. La aplicación funciona desde el navegador y no es necesario instalar nada.</Card.Text>
                            <Card.Text className="text-dark">Es la segunda vez que voy al festival, la primera fue en 2017; y me di cuenta de varias cosas. </Card.Text>
                            <ListGroup variant="flush" style={{ textIndent: 0 }}>
                                <ListGroup.Item>
                                    <strong>Muchas bandas:</strong>
                                    <br />
                                    <p>
                                        El festival tiene una grandísima y muy buena oferta de bandas y muchas nos las conocía, por lo que intenté escucharlas antes para poder hacerme una ida de a qué conciertos ir. Más adelante, durante el festival me hubiera gustado tomar alguna nota y apuntarme las bandas para más tarde.
                              </p>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Horarios:</strong>
                                    <br />
                                    <p>
                                        Aunque el festival da los horarios bien explicados y su aplicación era maravillosa, yo soy un desastre y muchas veces ni me acordaba a los grupos que quería ver, sobre todo con los que no conocía, así que pensé que sería una buena idea tener toda la información en un mismo sitio.
                          </p>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Porque puedo:</strong>
                                    <br />
                                    <p>
                                        Estoy aprendiendo a manejarme con React y, a la vez que aprendo, voy haciendo esto.
                                                          </p>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>

            </Accordion>

            <Accordion className="w-100">
                <Card>
                    <Card.Header>

                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            <h4>Sobre el desarrollador</h4>
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0" >
                        <Card.Body style={{ textIndent: 10 }} className="text-justify">
                            <Card.Text className="text-dark">
                                Trabajo de programador, pero me gusta hacer mis cosillas y ésta es una de ellas. Principalmente me gusta el metal progresivo y técnico, el death metal, sobre todo si es melódico y el thrash, aunque no hago ascos a ningún estilo y escucho muchas otras cosas. En su día fui guitarra de un grupillo de versiones de rock español que no llegó a gran cosa más allá de nuestra propia experiencia. Hago publi ya que estoy del grupo resultante de cuando lo dejamos: <a href="https://open.spotify.com/artist/5L2PWYFVBWAq2MCKpc7Qtq?si=h7Dh7PPhSAylbbi2Ec_SXg" target="_blank" rel="noopener noreferrer">Endeudados</a>, que son bastante mejores de lo que fuimos en el grupo anterior y se lo toman bastante más en serio.
                            </Card.Text>
                            <Card.Text className="text-dark">
                                <strong>Contacto:</strong> por si alguien tiene alguna sugerencia que dudo que sea capaz de solucionar en lo que queda de tiempo, pero que agradeceré enormemente.
                            <br />
                                <Contacto />
                            </Card.Text>
                            <Card.Text className="text-dark">
                                Si te ha gustado la aplicación me puedes invitar a un café o media cerveza en el festival por aquí:
                            <br />
                                <Button href="https://ko-fi.com/leftidos" target="_blank" rel="noopener noreferrer" style={{ height: 40, widows: 40, textIndent: 0 }} variant="light" className="p-0">
                                    <Image src={logo_kofi} alt="Ko-Fi" style={{ height: 40, widows: 40 }} />
                                </Button>
                            </Card.Text>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>

            </Accordion>
        </Row>

        <Row className="mt-2 mb-1"><h2>Características</h2></Row>
        <Row>
            <Accordion className="w-100">
                <Card>
                    <Card.Header>

                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            <h4>Horarios</h4>
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0" >
                        <Card.Body style={{ textIndent: 10 }} className="text-justify">
                            <Card.Text className="text-dark">
                                Son los mismos que la web, de hecho están sacados del <a href="https://clashfinder.com/s/resurrectionfesteg2019/" rel="noopener noreferer">clashfinder</a>. Se recomienda ver con el móvil en horizontal
                            </Card.Text>
                            <ListGroup variant="flush" style={{ textIndent: 0 }}>
                                <ListGroup.Item>
                                    <strong>Botón actualizar:</strong> Limpia los datos locales y carga los datos por defecto.
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Botón abrir:</strong> Abre datos guardados previamente.
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Botón guardar:</strong> Guarda los datos modificados.                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Días:</strong> se puede desplazar entre los días pulsando a derecha o izquierda de la tabla.
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Tiempo:</strong> está conectado con las predicciones del [Aemet](http://www.aemet.es/es/eltiempo/prediccion/municipios/horas/viveiro-id27066) y pone en cada hora el tiempo que hará y la temperatura.
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Bandas:</strong> tocar en ellas lleva a la página de detalle de la banda. Las bandas tienen un código de colores:
                            <ul className="pl-0">
                                        <li><span className="bg-danger text-light">Rojo</span>-<span className="bg-warning">Amarillo</span>-<span className="bg-success text-light">Verde</span> - Relevancia de la banda de menor a mayor(ver Editar banda)</li>
                                        <li><span className="bg-secondary text-light">Morado</span> - Sin identificar.</li>
                                        <li><span className="bg-primary text-light">Azul</span> - Preferencia de la banda (ver Editar banda) </li>
                                    </ul>
                                </ListGroup.Item>
                            </ListGroup>

                        </Card.Body>
                    </Accordion.Collapse>
                </Card>

            </Accordion>

            <Accordion className="w-100">
                <Card>
                    <Card.Header>

                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            <h4>Detalle de la banda</h4>
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0" >
                        <Card.Body style={{ textIndent: 10 }} className="text-justify">
                            <ListGroup variant="flush" style={{ textIndent: 0 }}>
                                <ListGroup.Item>
                                    <strong>Nombre y relevancia:</strong> El nombre y la relevancia que el usuario haya puesto a la banda.
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Imágenes:</strong> Las imágenes vienen de la [página de la banda](http://www.resurrectionfest.es/bands/) en la página del festival y de la página de Spotify de la banda. Ahora, hay bandas, como las del concurso de bandas que no tienen foto en la página del festival. Por otra parte, la búsqueda de bandas en spotify se hace por nombre y cogiendo el primer artista que encuentra, por lo que muchas imágenes de spotify que no se corresponden y hay bandas que directamente no tienen. Estoy buscando una solución a esto último.
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Proveniencia:</strong> Son datos que he buscado yo por internet. Algunas las sabía, otras no estoy seguro. En España he intentado acotar a la provincia.
                                    </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Escenario, fecha y hora:</strong>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Cuenta atrás:</strong> la cuenta atrás está en rojo hasta que empiece el concierto. Entonces se pone en negro y marca lo que le queda al concierto.
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Género y popularidad:</strong> También está sacado de Spotify, por lo que puede ser información errónea si el nombre lo encuentra mal.
                           </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Descripción:</strong> La descripción que el usuario haya puesto a la banda.
                           </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Botón Editar:</strong> Accede a la página para editar la información de la banda.
                           </ListGroup.Item>
                            </ListGroup>

                        </Card.Body>
                    </Accordion.Collapse>
                </Card>

            </Accordion>
            <Accordion className="w-100">
                <Card>
                    <Card.Header>

                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            <h4>Editar banda</h4>
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0" >
                        <Card.Body style={{ textIndent: 10 }} className="text-justify">

                            <ListGroup variant="flush" style={{ textIndent: 0 }}>
                                <ListGroup.Item>
                                    <strong>Preferencia:</strong> Si el usuario decide que quiere ver esa banda, destacándola en azul en el horario.
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Procedencia:</strong> Procedencia de la banda.
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Relevancia:</strong> Este campo está pensado para indicar la importancia que tiene la banda para el usuario, que se indicará con un código de colores en el horario.
                                    </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Descripción</strong> Notas que se quieran apuntar sobre la banda. Yo lo uso para acordarme de quién era quién de los grupos que no conocía antes.
                                </ListGroup.Item>
                            </ListGroup>

                        </Card.Body>
                    </Accordion.Collapse>
                </Card>

            </Accordion>

            <Accordion className="w-100">
                <Card>
                    <Card.Header>

                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            <h4>Ahora</h4>
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0" >
                        <Card.Body style={{ textIndent: 10 }} className="text-justify">
                            <Card.Text className="text-dark">
                                Esta sección muestra los conciertos que hay en ese momento con la cuenta atrás en negro indicando lo que le queda y los siguientes que van a suceder con la cuenta atrás en rojo a cuándo van a empezar.
                            </Card.Text>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
            <Accordion className="w-100">
                <Card>
                    <Card.Header>

                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            <h4>Buscar</h4>
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0" >
                        <Card.Body style={{ textIndent: 10 }} className="text-justify">
                            <Card.Text className="text-dark">
                                Es un buscador de grupos por nombre. Al picar te lleva a la página del grupo.
                            </Card.Text>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>

        </Row>
    </Container >
)

export default About;