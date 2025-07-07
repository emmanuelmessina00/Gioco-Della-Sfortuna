import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import { LogoutButton } from './AuthComponent';

function NavbarComponent(props) {
    return (
        <Navbar expand="lg" className="bg-dark navbar-dark px-3">
            <Container>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link to='/' style={{ marginRight: '20px' }}>Home</Link>
                        <Link to='/game' style={{ marginRight: '20px' }}>Join the Game</Link>
                        {props.loggedIn && <Nav.Link as={Link} to="/history">Storico Partite</Nav.Link>}
                    </Nav>
                    <Nav>
                        {props.loggedIn ? 
                            <LogoutButton logout={props.handleLogout} /> :
                            <Link to='/login' className='btn btn-outline-light'>Login</Link>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;