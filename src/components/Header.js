import React, { Component } from 'react';
import { Row, Col, Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import logo from '../resources/logo.png'

class Header extends Component {

    render() {
        return (
            <Row >
                <Col>
                    <Navbar bg="dark" variant="dark" >
                        <Navbar.Brand> <Link to="/" className="text-light">
                            <img
                                alt="logo"
                                src={logo}
                                width="40"
                                height="40"
                                className="d-inline-block align-top"
                            />
                        </Link></Navbar.Brand>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <NavLink className="text-light mr-4" to="/now" >Ahora</NavLink>
                                <NavLink className="text-light mr-4" to="/buscar" >Buscar</NavLink>
                                <NavLink className="text-light" to="/about" >Ayuda</NavLink>
                            </Nav>

                        </Navbar.Collapse>

                    </Navbar>

                </Col>
            </Row>

        )
    }
}

export default Header;