import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicarQuadraView from './view/PublicarQuadraView';
import BuscarQuadrasView from './view/BuscarQuadrasView';
import DetalhesQuadraView from './view/DetalhesQuadraView'
import ReservarQuadraView from './view/ReservarQuadraView'
import { QueryClient, QueryClientProvider} from "@tanstack/react-query"

const queryClient = new QueryClient()

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<BuscarQuadrasView />} />
          <Route path="/publicar-quadra" element={<PublicarQuadraView />} />
          <Route path="/detalhes-quadra/:id" element={<DetalhesQuadraView />} />
          <Route path="/reservar-quadra/:id/:slotId/:date" element={<ReservarQuadraView />} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

export default App