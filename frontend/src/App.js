import React from 'react';
import './App.css';
import Footer from 'components/js/Footer';
import Nav from 'components/js/Nav';
import AppRouter from './route/AppRouter'
function App() {
  return (
    <div className="App">
      <Nav />
      <div className="main">
        <AppRouter />
      </div>
      <Footer />
    </div>
  );
}

export default App;
