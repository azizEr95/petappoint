import { Link } from '@tanstack/react-router'
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useAuthStore } from '../stores/authStore';

export default function Header() {
  const { login, setLogin} = useAuthStore();

  let loginButton;
  if(!login){
    loginButton = <Link id="LoginButtonHeader" to={"/login"} className='btn btn-outline-secondary button'>Einloggen</Link>
  } else {
    loginButton = <Link id="LogoutButtonHeader" to={"/"} className='btn btn-outline-secondary button' onClick={() => {setLogin(false)}}>Ausloggen</Link>
  }

  return (
    <Navbar id="Header" expand="md" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Brand id="OpenStartPageButton" as={Link} to="/" >vetlib</Navbar.Brand>
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/link1">Link1</Nav.Link>
            <Nav.Link as={Link} to="/link2">Link2</Nav.Link>
            <Nav.Link as={Link} to="/link3">Link3</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
      {loginButton}
    </Navbar>
  )
}
