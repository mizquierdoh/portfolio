import React from 'react';
import { Row, Col, Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const Header = () => {

    return (
        <Row>
            <Col>
                <Navbar bg="dark" variant="dark" >
                    <Navbar.Brand> <Link to="/" className="text-light">Horarios</Link></Navbar.Brand>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <NavLink className="text-light" to="/now" >Ahora</NavLink>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

            </Col>
        </Row>

    )
}

export default Header;