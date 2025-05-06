import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicarQuadraView from './view/PublicarQuadraView';
import BuscarQuadrasView from './view/BuscarQuadrasView';
import ReservarQuadraView from './view/ReservarQuadraView'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BuscarQuadrasView />} />
        <Route path="/publicar-quadra" element={<PublicarQuadraView />} />
        <Route path="/reservar-quadra" element={<ReservarQuadraView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App