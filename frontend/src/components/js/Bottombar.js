import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import 'components/css/Bottombar.css';
function BottomBar() {
    return (
        <Navbar bg="light" variant="light" expand="lg" className="pt-3 pb-5 bottom-bar">
            <div className="align-center text-center">
                2020 Code Expert
                <Nav>
                    <Nav.Link target="_blank" href="https://www.github.com/hch0821/CodeExpert">https://www.github.com/hch0821/CodeExpert</Nav.Link>
                </Nav>
            </div>
        </Navbar>
    );
}

export default BottomBar;