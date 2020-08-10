import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
function BottomBar() {
    return (
        <Navbar bg="light" variant="light" expand="lg" className="pt-1 pb-1 bottom-bar">
            <div className="bottom-bar-content">
                <div className="align-center">
                    <div>2020 Code Expert</div><div>이 웹사이트는 프로그래머스, 백준, 코드업의 클론 프로젝트입니다. 어떤 상업적 목적으로도 사용하지 않습니다.</div>
                    <Nav>
                        <Nav.Link target="_blank" href="https://www.github.com/hch0821/CodeExpert" className="align-center text-center">https://www.github.com/hch0821/CodeExpert</Nav.Link>
                    </Nav>
                </div>
            </div>

        </Navbar>
    );
}

export default BottomBar;