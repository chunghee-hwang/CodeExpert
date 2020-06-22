import React from 'react';
import './App.css';
import Header from './components/js/Header';
import Footer from './components/js/Footer';
import AppRouter from './route/AppRouter'
function App() {
  return (
    <div className="App">
      <Header />
      <AppRouter />
      <Footer />
    </div>
  );
}

export default App;
