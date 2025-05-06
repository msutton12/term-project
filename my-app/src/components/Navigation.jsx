import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';

const Navbar = () => {
    const navigate = useNavigate();
    const activeUser = localStorage.getItem('activeUser');

    const handleLogout = () => {
        localStorage.removeItem('activeUser');
        navigate('/login');
    };

    return (
        <BootstrapNavbar className="app-navbar" expand="lg">
            <Container fluid>
                <Link to="/" className="navbar-brand app-navbar-brand">SplitCost</Link>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Link to="/" className="nav-link">Dashboard</Link>
                        <Link to="/groups" className="nav-link">Groups</Link>
                        {activeUser && (
                            <div className="d-flex align-items-center">
                                <span className="mx-3 text-gray">Logged in as {activeUser}</span>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={handleLogout}>
                                    Switch User
                                </Button>
                            </div>
                        )}
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;