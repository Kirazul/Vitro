import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Player from './pages/Player';
import { PageTransition } from './components/PageTransition';
import './index.css';

function App() {
  return (
    <BrowserRouter basename="/Vitro">
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:type/:id" element={<Player />} />
        </Routes>
      </PageTransition>
    </BrowserRouter>
  );
}

export default App;
