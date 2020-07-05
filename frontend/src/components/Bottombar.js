import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
function BottomBar() {
    return (
        <Navbar bg="light" variant="light" expand="lg" className="pt-3 pb-5 bottom-bar">
            <div className="align-center text-center">
                2020 Code Expert<br />이 웹사이트는 프로그래머스, 백준, 코드업의 클론 프로젝트입니다. 어떤 상업적 목적으로도 사용되지 않습니다.
                <Nav>
                    <Nav.Link target="_blank" href="https://www.github.com/hch0821/CodeExpert">https://www.github.com/hch0821/CodeExpert</Nav.Link>
                </Nav>
            </div>
        </Navbar>
    );
}

export default BottomBar;