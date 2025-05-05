import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CadastroQuadraView from './view/CadastroQuadraView';
import BuscarQuadrasView from './view/BuscarQuadrasView';
import ReservarQuadraView from './view/ReservarQuadraView'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BuscarQuadrasView />} />
        <Route path="/cadastro-quadra" element={<CadastroQuadraView />} />
        <Route path="/reservar-quadra" element={<ReservarQuadraView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App