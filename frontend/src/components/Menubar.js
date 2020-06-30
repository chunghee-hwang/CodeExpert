import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { LinkContainer } from 'react-router-bootstrap'
import { paths } from 'constants/Paths';
function Menubar() {
    return (
        <Navbar bg="light" variant="light" expand="lg">
            <Link to={paths.pages.root}>
                <Navbar.Brand className="home-button">
                    <img alt="logo" src="/logo.svg" width="30" height="30" className="d-inline-block align-top" />
                    Code Expert
                </Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="align-center text-center">
                    <LinkContainer to={paths.pages.make_problem_form}>
                        <Nav.Link>알고리즘 문제 출제</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to={paths.pages.problem_list}>
                        <Nav.Link>코딩테스트 연습</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to={paths.pages.signup_form}>
                        <Nav.Link>회원 가입</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to={paths.pages.account_management}>
                        <Nav.Link>계정 관리</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to={paths.pages.login_form}>
                        <Nav.Link>로그인</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to={paths.actions.logout}>
                        <Nav.Link>로그아웃</Nav.Link>
                    </LinkContainer>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Menubar;