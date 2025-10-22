import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Player from './pages/Player';
import { PageTransition } from './components/PageTransition';
import './index.css';

function App() {
  return (
    <HashRouter>
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:type/:id" element={<Player />} />
        </Routes>
      </PageTransition>
    </HashRouter>
  );
}

export default App;
