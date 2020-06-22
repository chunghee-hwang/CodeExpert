import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
function BottomBar() {
    return (
        <Navbar bg="light" variant="light" expand="lg">
            <div className="align-center-horizontal">
                2020 Code Expert
                <Nav>
                    <Nav.Link target="_blank" href="https://www.github.com/hch0821/CodeExpert">https://www.github.com/hch0821/CodeExpert</Nav.Link>
                </Nav>
            </div>
        </Navbar>
    );
}

export default BottomBar;