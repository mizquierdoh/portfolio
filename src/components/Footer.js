import React from 'react';
import { Row, Col, Button, Image, Container } from 'react-bootstrap';
import Contacto from './Contacto'
import logo_kofi from "../resources/logo_kofi.png"

const Footer = () => (
    <Container className="align-middle">
        <Row >
            <Col className="px-1">
                <span className="align-middle">Miguel Izquierdo Hidalgo</span>
            </Col>
            <Col className="px-0" xs="auto">
                <Contacto />
            </Col>

        </Row>

        <Row >
            <Col className="px-0 align-middle">
                Si te gusta la app y te apetece invitarme a algo =>
            </Col>
            <Col xs="auto" className="px-0">
                <Button href="https://ko-fi.com/leftidos" target="_blank" rel="noopener noreferrer" style={{ height: 40, widows: 40, textIndent: 0 }} variant="light" className="p-0 my-0">
                    <Image src={logo_kofi} alt="Ko-Fi" style={{ height: 40, widows: 40 }} />
                </Button>
            </Col>
        </Row>
    </Container>

)

export default Footer;