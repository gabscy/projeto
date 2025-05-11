import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { format } from "date-fns"
import { useQuery,  } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useParams} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function ReservarQuadraView() {

    const {id, slotId ,date }  = useParams()
    const [nomeCapitao, setNomeCapitao] = useState('');
    const [cpfCapitao, setCpfCapitao] = useState('');
    const [metodoPagamento, setMetodoPagamento] = useState('');
    const [numeroCartao, setNumeroCartao] = useState('');
    const [cvv, setCvv] = useState('');
    const [vencimento, setVencimento] = useState('');
    const [nomeCartao, setNomeCartaoTitular] = useState('');
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [first, setFirst] = useState(true);
    const navigate = useNavigate();
    const [slots, setSlots] = useState<Slot[]>([])

    interface Slot {
		id: number;
		quadra_id: number;
		date: string;
		horario_inicio: number;
		horario_fim: number;
		available: number;
	}

   function slotAvailable(slotId: number) {
    const slot = slots.find(slot => slot.id === slotId);
    if (slot && slot.available === 0) {
        return true; 
    }
    return false; 
    }

    const fetchQuadra = async (id : string) => {
		
        const response = await fetch(`http://localhost:3000/quadra/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json()

	};

    const handleBuscarSlots = async () => {
		try{
		
			const response = await fetch(`http://localhost:3000/disponibilidade-quadra?date=${date}&quadraId=${id}`)
			setSlots(await response.json())
		}
		catch(err){
			alert("Something went wrong")
		}
	}
	

	const { data: quadra,  error } = useQuery({
		queryKey: ['quadra', id],
		queryFn: () => fetchQuadra(id!), // Add the non-null assertion operator here
		staleTime: 60 * 1000,
		retry: 3,
	});

    if(error){
        alert("Something went wrong")
    }


    // Valida o formulário sempre que um campo relevante muda
    useEffect(() => {
        validateForm();
    }, [nomeCapitao, cpfCapitao, metodoPagamento, numeroCartao, cvv, vencimento, nomeCartao]);

    const validateForm = () => {
        const errors: { [key: string]: string } = {};
        let isValid = true;

        if (!nomeCapitao.trim()) {
            errors.nomeCapitao = "Por favor, digite o nome do capitão.";
            isValid = false;
        }
        if (!cpfCapitao.trim()) {
            errors.cpfCapitao = "Por favor, digite o CPF do capitão.";
            isValid = false;
        }
        if (!metodoPagamento) {
            errors.metodoPagamento = "Por favor, selecione o método de pagamento.";
            isValid = false;
        }
        if (!numeroCartao.trim()) {
            errors.numeroCartao = "Por favor, digite o número do cartão.";
            isValid = false;
        }
        if (!cvv.trim()) {
            errors.cvv = "Por favor, digite o CVV.";
            isValid = false;
        }
        if (!vencimento.trim()) {
            errors.vencimento = "Por favor, digite o vencimento do cartão.";
            isValid = false;
        }
        if (!nomeCartao.trim()) {
            errors.nomeCartao = "Por favor, digite o nome do titular do cartão.";
            isValid = false;
        }

        setFormErrors(errors);
        setIsFormValid(isValid);
    };

   const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFirst(false);

    if (isFormValid) {
        handleBuscarSlots()

        if(!slots ) return

        if(!slotAvailable(Number(slotId)))
            return

        const reservaData = {
            quadraId: quadra.id, 
            dataReserva: date, 
            nomeCapitao: nomeCapitao,
            cpfCapitao: cpfCapitao,
            valor: quadra.price, 
            metodoPagamento: metodoPagamento,
            numeroCartao,
            cvv : cvv,
            vencimento : vencimento,
            nomeCartao: nomeCartao,
            slotId: slotId 
        };

      try {
        const response = await fetch('http://localhost:3000/reservar-quadra', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reservaData),
        });

        if (response.ok) {
          
          console.log('Reserva realizada com sucesso!');
        } else {
          console.error('Erro ao realizar a reserva:', response.status);
        }
      } catch (error) {
        console.error("Erro:", error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Reservar Quadra</h1>
      <form onSubmit={handleSubmitForm} className="space-y-6">
        <div>
          <Label htmlFor="nomeCapitao" className="block mb-2">Nome do Capitão</Label>
          <Input
            id="nomeCapitao"
            value={nomeCapitao}
            onChange={(e) => setNomeCapitao(e.target.value)}
            className="w-full"
            placeholder="Digite o nome completo"
          />
           {formErrors.nomeCapitao && !first && <p className="text-sm text-red-500">{formErrors.nomeCapitao}</p>}
        </div>

        <div>
          <Label htmlFor="cpfCapitao" className="block mb-2">CPF do Capitão</Label>
          <Input
            id="cpfCapitao"
            value={cpfCapitao}
            onChange={(e) => setCpfCapitao(e.target.value)}
            className="w-full"
            placeholder="Digite o CPF"
          />
           {formErrors.cpfCapitao && !first && <p className="text-sm text-red-500">{formErrors.cpfCapitao}</p>}
        </div>

        <div>
          <Label htmlFor="metodoPagamento" className="block mb-2">Método de Pagamento</Label>
          <Select onValueChange={setMetodoPagamento} value={metodoPagamento}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o método de pagamento" />
            </SelectTrigger>
            <SelectContent>
            
              <SelectItem value="cartao de credito">Cartão de Crédito</SelectItem>
            </SelectContent>
          </Select>
           {formErrors.metodoPagamento && !first && <p className="text-sm text-red-500">{formErrors.metodoPagamento}</p>}
        </div>

        {metodoPagamento === 'cartao de credito' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="numeroCartao" className="block mb-2">Número do Cartão</Label>
              <Input
                id="numeroCartao"
                value={numeroCartao}
                onChange={(e) => setNumeroCartao(e.target.value)}
                className="w-full"
                placeholder="Digite o número do cartão"
              />
               {formErrors.numeroCartao && !first && <p className="text-sm text-red-500">{formErrors.numeroCartao}</p>}
            </div>
            <div>
              <Label htmlFor="cvv" className="block mb-2">CVV</Label>
              <Input
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full"
                placeholder="Digite o CVV"
              />
               {formErrors.cvv && !first && <p className="text-sm text-red-500">{formErrors.cvv}</p>}
            </div>
            <div>
              <Label htmlFor="vencimento" className="block mb-2">Vencimento</Label>
              <Input
                id="vencimento"
                value={vencimento}
                onChange={(e) => setVencimento(e.target.value)}
                className="w-full"
                placeholder="MM/AA"
              />
               {formErrors.vencimento && !first && <p className="text-sm text-red-500">{formErrors.vencimento}</p>}
            </div>
            <div>
              <Label htmlFor="nomeCartao" className="block mb-2">Nome do Titular</Label>
              <Input
                id="nomeCartao"
                value={nomeCartao}
                onChange={(e) => setNomeCartaoTitular(e.target.value)}
                className="w-full"
                placeholder="Digite o nome do titular"
              />
               {formErrors.nomeCartao && !first && <p className="text-sm text-red-500">{formErrors.nomeCartao}</p>}
            </div>
          </div>
        )}

        <Button type="submit" className="w-full">
          Finalizar Reserva
        </Button>
      </form>
    </div>
  );
}

export default ReservarQuadraView;

