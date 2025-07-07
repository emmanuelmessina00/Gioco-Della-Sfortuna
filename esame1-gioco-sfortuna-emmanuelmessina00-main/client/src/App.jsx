import { useEffect, useState } from "react";
import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { Container, Row, Alert } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import Home from "./components/Home";
import { LoginForm } from "./components/AuthComponent";
import API from "./API.mjs";
import NavbarComponent from "./components/NavbarComponent";
import GameComponent from "./components/GameComponent";
import History from "./components/History";
function App() {
  const [loggedIn, setLoggedIn] = useState(false); 
  const [message, setMessage] = useState(null); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        if(user) {
          setLoggedIn(true);
          setUser({
            id: user.id,  
            username: user.username,
            email: user.email,
          });
        }
      } catch(err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setUser({
        id: user.id,  
        username: user.username,
        email: user.email,
      });
      setMessage({msg: `Benvenuto ${user.username}!`, type: 'success'});
    } catch(err) {
      setMessage({msg: err.message || "Login failed", type: 'danger'});
    }
  };

  const handleLogout = async () => {
    try {
      await API.logOut();
      setLoggedIn(false);
      setUser(null);
      setMessage({msg: "Logged out successfully", type: 'success'});
    } catch(err) {
      setMessage({msg: "Logout failed", type: 'danger'});
    }
  };

  if(loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavbarComponent loggedIn={loggedIn} user={user} handleLogout={handleLogout} />
      
      <Container fluid className='mt-3'>
        {message && (
          <Row>
            <Alert variant={message.type} onClose={() => setMessage('')} dismissible>
              {message.msg}
            </Alert>
          </Row>
        )}
        
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/game" element={<GameComponent loggedIn={loggedIn} user={user}/>}></Route>
          <Route element={loggedIn ? <Outlet /> : <Navigate to="/login" replace />}>
            <Route path="/history" element={<History loggedIn={loggedIn} user={user}/>}></Route>
          </Route>
          
          <Route path='/login' element={
            loggedIn ? <Navigate to="/" replace /> : <LoginForm login={handleLogin} />
          } />
        </Routes>
      </Container>
    </>
  );
}

export default App;