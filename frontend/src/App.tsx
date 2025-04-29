import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CadastroQuadraView from './view/CadastroQuadraView';
import BuscarQuadrasView from './view/BuscarQuadrasView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BuscarQuadrasView />} />
        <Route path="/cadastro-quadra" element={<CadastroQuadraView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App