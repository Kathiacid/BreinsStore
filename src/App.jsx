import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa tus componentes
import Navbar from './assets/components/navbar';
import Home from './assets/pages/home';

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />

        </Routes>
      </main>
    </Router>
  );
}

export default App;