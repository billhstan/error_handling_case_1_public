//Header.js
//Tutor note: A lot of testing and experiments were carried out on this Header.js file 
//to appreciate context and hook concepts
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect, useContext } from 'react';
import {Container,Navbar,Nav,NavDropdown} from 'react-bootstrap';
import axios from 'axios';
function Header() {
return (

<div>

  <Navbar bg="light" expand="lg">
  <Container fluid>
    <Navbar.Brand href="/landing">Experiment</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto">
        <Nav.Link href="/landing">Home</Nav.Link>
        <Nav.Link href="/test">Test</Nav.Link>
        <NavDropdown title="Experiments" id="basic-nav-dropdown">
          <NavDropdown.Item href="/brands">Manage brands</NavDropdown.Item>
          <NavDropdown.Item href="/brands/add">Add brand</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="/products">Manage products</NavDropdown.Item>
          <NavDropdown.Item href="/products/add">Add product</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="/tasks">Manage tasks</NavDropdown.Item>
          <NavDropdown.Item href="/tasks/add">Add task</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
  </Container>
  </Navbar>
</div>
);
}

export default Header