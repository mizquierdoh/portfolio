import React from 'react'

import logo_linkedin from "../resources/logo_linkedin.png"
import logo_instagram from "../resources/logo_instagram.png"

import { MDBIcon } from "mdbreact";
import { Button, Image } from 'react-bootstrap';

const Contacto = () => (
    <>
        <Button href="https://www.linkedin.com/in/miguel-izquierdo-hidalgo-04950679/" target="_blank" rel="noopener noreferrer" variant="light" className="p-0" style={{ textIndent: 0 }}>
            <Image src={logo_linkedin} alt="LinkedIn" style={{ height: 40, widows: 40 }} />
        </Button>
        <Button href="https://www.instagram.com/michael_left90/" target="_blank" rel="noopener noreferrer" variant="light" className="p-0" style={{ textIndent: 0 }}>
            <Image src={logo_instagram} alt="Instagram" style={{ height: 40, widows: 40 }} />
        </Button>
        <Button href="mailto:miguel.izquierdo.hidalgo@gmail.com" target="_blank" rel="noopener noreferrer" style={{ height: 40, widows: 40, textIndent: 0 }} variant="light" className="p-0" >
            <MDBIcon icon="envelope" size="3x" />
        </Button>
    </>
)

export default Contacto;