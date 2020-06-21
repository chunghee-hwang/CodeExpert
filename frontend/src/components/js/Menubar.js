import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap'
import '../css/Menubar.css'
function Menubar() {

    return (
        <Navbar bg="light" variant="light" expand="lg">
            <Link to="/problemlist">
                <Navbar.Brand className="home-button">
                    <img alt="logo" src="/logo.svg" width="30" height="30" className="d-inline-block align-top" />
                    Code Expert
                </Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="align-center-horizontal">
                    <LinkContainer to="makeproblem">
                        <Nav.Link>알고리즘 문제 출제</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="problemlist">
                        <Nav.Link>코딩테스트 연습</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="signupform">
                        <Nav.Link>회원 가입</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="loginform">
                        <Nav.Link>로그인</Nav.Link>
                    </LinkContainer>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Menubar;