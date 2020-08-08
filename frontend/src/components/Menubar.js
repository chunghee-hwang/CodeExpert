import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { paths } from 'constants/Paths';
function Menubar(props) {
    const { user } = props;
    return (
        <Navbar bg="light" variant="light" expand="lg">
            <Nav.Link href={paths.pages.root}>
                <Navbar.Brand className="home-button">
                    <img alt="logo" src="/logo.svg" width="30" height="30" className="d-inline-block align-top" />
                    Code Expert
                </Navbar.Brand>
            </Nav.Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                {user ?
                    <Nav className="align-center text-center">
                        <Nav.Link href={paths.pages.makeProblemForm}>알고리즘 문제 출제</Nav.Link>
                        <Nav.Link href={paths.pages.problemList}>코딩테스트 연습</Nav.Link>
                        <Nav.Link href={paths.pages.accountManagement}>계정 관리</Nav.Link>

                        <Nav.Link href={paths.pages.signupForm}>회원 가입</Nav.Link>
                        <Nav.Link href={paths.actions.logout}>로그아웃</Nav.Link>
                    </Nav> :
                    <Nav className="align-center text-center">
                        <Nav.Link href={paths.pages.signupForm}>회원 가입</Nav.Link>
                        <Nav.Link href={paths.pages.loginForm}>로그인</Nav.Link>
                    </Nav>
                }
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Menubar;