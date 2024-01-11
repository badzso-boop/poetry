import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';

const AppNavbar = () => {
  const { user, userId } = useContext(AppContext);
  const [expanded, setExpanded] = useState(false);
  const navbarRef = useRef(null);

  const handleNavbarToggle = () => {
    setExpanded(!expanded);
  };

  const handleNavItemClick = () => {
    setExpanded(false);
  };

  const handleOutsideClick = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      setExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      className='p-3'
      expanded={expanded}
      onToggle={handleNavbarToggle}
      ref={navbarRef}
    >
      <Navbar.Brand as={Link} to="/" onClick={handleNavItemClick}>My App</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarNav" />
      <Navbar.Collapse id="navbarNav">
        <Nav className="ml-auto">
          <Nav.Link as={Link} to="/poems" onClick={handleNavItemClick}>
            Poems
          </Nav.Link>
          <Nav.Link as={Link} to="/albums" onClick={handleNavItemClick}>
            Albums
          </Nav.Link>

          {userId ? (
            <>
              <Nav.Link as={Link} to="/profile" onClick={handleNavItemClick}>View Profile</Nav.Link>
              <Nav.Link as={Link} to="/uploadpoem" onClick={handleNavItemClick}>Upload Poem</Nav.Link>
              <Nav.Link as={Link} to="/uploadalbum" onClick={handleNavItemClick}>Upload Album</Nav.Link>
              <Nav.Link as={Link} to="/logout" onClick={handleNavItemClick}>Logout</Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/login" onClick={handleNavItemClick}>
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/register" onClick={handleNavItemClick}>
                Register
              </Nav.Link>
            </>
          )}

          {user && (
            <span className="navbar-text">
              Welcome, {user.username}!
            </span>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AppNavbar;
