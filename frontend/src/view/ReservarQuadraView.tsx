import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useQuery,  } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useParams} from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Separator } from '@radix-ui/react-separator';
import { FadeLoader } from "react-spinners"
import Cookies from 'js-cookie';
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
  const [slot, setSlot] = useState<Slot>()
    
  const navigate = useNavigate();

  // funcao para realizar autenticacao ao entrar na pagina
  useEffect(() => {
    const checkTokenAndValidate = async () => {

        const token = Cookies.get('authToken'); 
        //verifica se ja há um token
        if (token) {

            console.log('Cookie de token encontrado:', token);
            try {
                //verifica se o token é valido
                const response = await fetch('https://backend-projeto-v2-bhbmfzeahubeg6a8.brazilsouth-01.azurewebsites.net/auth/validate', { 
                    method: 'GET', 
                    headers: {
                    'Authorization': `Bearer ${token}`, // Enviando o token 
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.valid) { 
                        //se token é valido
                        console.log('Token válido!');
                    } else {
                        //remove token se é invalido
                        console.log('Token inválido ou expirado.');
                        Cookies.remove('authToken');
                        navigate("/publicar-quadra/login")
                    }
                } else {
                    //erro ao obter token
                    const errorData = await response.json();
                    console.error('Erro na resposta da validação do token:', response.status, errorData);
                    Cookies.remove('authToken');
                }

            } catch (erro) {
                console.error('Erro na requisição de validação do token:', erro);
                Cookies.remove('authToken');
            } 

        } else {
            console.log('Cookie de token não encontrado.');
            navigate("publicar-quadra/login")
        }
    };
    checkTokenAndValidate();
  }, []);

  interface Slot {
		id: number;
		quadra_id: number;
		date: string;
		horario_inicio: number;
		horario_fim: number;
		available: number;
	}

  //formata data
  const formatTime = (hour: number): string => {
		const integerPart = Math.floor(hour);
		const decimalPart = hour - integerPart;

		const formattedHour = integerPart.toString().padStart(2, '0');
		const formattedMinutes = decimalPart === 0.5 ? '30' : '00';

		return `${formattedHour}:${formattedMinutes}`;
	};


  //encontra um especifico em uma lista de slots
  function findSlot(slots:Slot[], slotId: number) {
    const slot = slots.find(slot => slot.id === slotId);
    
    if (slot) {
        return slot; 
    }
    return null; 
  }

  //obtem detalhes de uma quadra 
  const fetchQuadra = async (id : string) => {
    const response = await fetch(`https://backend-projeto-v2-bhbmfzeahubeg6a8.brazilsouth-01.azurewebsites.net/quadra/${id}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json()

	};

  //obtem slots de uma quadra
  const fetchSlots = async () => {
    const response = await fetch(`https://backend-projeto-v2-bhbmfzeahubeg6a8.brazilsouth-01.azurewebsites.net/disponibilidade-quadra?date=${date}&quadraId=${id}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json()
  }

	//query para quadra
	const { data: quadra, isFetching:quadraFetching,  error:erroQuadra } = useQuery({
		queryKey: ['quadra', id],
		queryFn: () => fetchQuadra(id!), // Add the non-null assertion operator here
		staleTime: 60 * 1000,
		retry: 3,
	});

  if(erroQuadra){
      alert("Something went wrong")
  }

  //query para slots
  const { data: slots,isFetching:slotFetching, refetch,  error:erroSlot } = useQuery({
		queryKey: ['slots', id],
		queryFn: fetchSlots, 
		staleTime: 60 * 1000,
		retry: 3,
	});

  if(erroSlot){
      alert("Something went wrong")
  }

  
  useEffect(()=>{
      console.log(slots)
      if(!slots)
          return
      const currSlot = findSlot(slots, Number(slotId))
      if(currSlot)
          setSlot(currSlot)
  },[slots])

  // Valida o formulário sempre que um campo relevante muda
  useEffect(() => {
      validateForm();
  }, [nomeCapitao, cpfCapitao, metodoPagamento, numeroCartao, cvv, vencimento, nomeCartao]);

    //verifica se o form esta correto
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
        if (!cvv.trim() || cvv.trim().length < 3) {
            errors.cvv = "Por favor, digite o CVV.";
            isValid = false;
        }
        if (!vencimento.trim() || vencimento.trim().length < 5) {
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

  //tenta enviar formulario
   const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFirst(false);

    if (isFormValid) {
      //obtem novamente os slots da data
        await refetch(); 

        if (slots.length <= 0 || !slots) {
            console.log("Não foi possível obter os slots.");
            return; // Encerra a função se não houver slots
        }
       
        //verifica novamente se o slot esta disponivel antes de finalizar pagamento
        const currSlot =  findSlot(slots, Number(slotId))
        if (currSlot?.available === 1 || !currSlot) {
            console.log("Slot indisponível.");
            alert("Horário indisponível")
            return;
        }

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

        //envia detalhes de pagamento para api
        const response = await fetch('https://backend-projeto-v2-bhbmfzeahubeg6a8.brazilsouth-01.azurewebsites.net/reservar-quadra', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reservaData),
        });

        console.log(await response.json())
        if (response.ok) {

          //reserva finalizada
          alert("reserva realizada")
          console.log('Reserva realizada com sucesso!');

        } else {
          //reserva finalizada
          console.error('Erro ao realizar a reserva:', response.status);
          alert("Falha ao realizar a reserva - slot indisponível")
        }
      } catch (error) {
        //ao fazer muitas requisicoes, requisicoes futuras nao sao aceitas
        console.error("Erro:", error);
        alert("Muitas requisicoes, por favor espera")
      }
    }
  };

  //atualiza CPF
  const handleCPFChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
     const newValue = event.target.value.replace(/[^0-9]/g, '');
        event.target.value = newValue

        setCpfCapitao(newValue);
  }
  
  //atualiza cvv
  const handleCvvChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
     const newValue = event.target.value.replace(/[^0-9]/g, '');
        event.target.value = newValue

        setCvv(newValue);
  }

  //atualiza vencimento
 const handleChangeVencimento = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, ''); 
    if (value.length > 4) {
      value = value.slice(0, 4);
    }
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2); 
    }
    setVencimento(value);

  };

  return (
    <div className="max-w-4xl flex flex-col mx-auto py-8 gap-8">
      <h1 className="text-2xl font-bold mb-6">Reservar Quadra</h1>

       {(slotFetching || quadraFetching || !slot)? (<FadeLoader/>) : (
        <Card className='p-4 flex- flex-col gap-2'>
            <Label className='text-base'>Detalhes da reserva</Label>
            <Separator/>
         
            <div className='flex flex-col gap-4'>
                <Label>Quadra : <span className="font-normal">{quadra.name}</span></Label>
                <Label>Endereço : <span className="font-normal">{quadra.address}</span></Label>
             
                 <Label>Data : <span className="font-normal">{date}</span></Label>
                <Label>Horário : <span className="font-normal">{formatTime(slot.horario_inicio)} - {formatTime(slot.horario_fim)}</span></Label>
                <Label>Preço : <span className="font-normal">{quadra.price} R$</span></Label>
            </div>
            
          
        </Card>

       )} 
     
      <form onSubmit={handleSubmitForm} className="space-y-10 flex flex-col  text-start">
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
            onChange={(e) => handleCPFChange(e)}
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
          <div className="space-y-4 ">
            <div>
              <Label htmlFor="numeroCartao" className="block mb-2">Número do Cartão</Label>
              <Input
                id="numeroCartao"
                type="number"
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
                onChange={(e) => handleCvvChange(e)}
                className="w-50"
                maxLength={3}
                placeholder="Digite o CVV"
              />
               {formErrors.cvv && !first && <p className="text-sm text-red-500">{formErrors.cvv}</p>}
            </div>
            <div>
              <Label htmlFor="vencimento" className="block mb-2">Vencimento</Label>
              <Input
                id="vencimento"
                value={vencimento}
                onChange={(e) => handleChangeVencimento(e)}
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

