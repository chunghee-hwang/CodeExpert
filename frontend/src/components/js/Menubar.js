import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { LinkContainer } from 'react-router-bootstrap'
import { paths } from 'constants/Paths';
import 'components/css/Menubar.css'
function Menubar() {
    return (
        <Navbar bg="light" variant="light" expand="lg">
            <Link to={paths.root}>
                <Navbar.Brand className="home-button">
                    <img alt="logo" src="/logo.svg" width="30" height="30" className="d-inline-block align-top" />
                    Code Expert
                </Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="align-center-horizontal">
                    <LinkContainer to={paths.make_problem}>
                        <Nav.Link>알고리즘 문제 출제</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to={paths.problem_list}>
                        <Nav.Link>코딩테스트 연습</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to={paths.signup_form}>
                        <Nav.Link>회원 가입</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to={paths.login_form}>
                        <Nav.Link>로그인</Nav.Link>
                    </LinkContainer>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Menubar;