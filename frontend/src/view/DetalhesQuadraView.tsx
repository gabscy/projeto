import '../App.css'
import * as React from "react"
import { useState, useEffect } from 'react';
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '../components/ui/navigation-menu';
import { TbSoccerField } from "react-icons/tb"
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge"
import { FaStar } from "react-icons/fa";
import { format, addDays, startOfDay, isBefore, isAfter } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator";
import { useParams} from 'react-router-dom';
import { useQuery,  } from '@tanstack/react-query';
import { ptBR } from 'date-fns/locale';
import {  ClockIcon } from 'lucide-react'; 

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { FadeLoader } from "react-spinners"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"

import { useNavigate } from 'react-router-dom';


function BuscarQuadrasView() {
	const { id } = useParams();
	const [date, setDate] = React.useState<Date>();
	const today = startOfDay(new Date());
	const oneMonthFromToday = addDays(today, 29);
	const [slots, setSlots] = useState<Slot[]>([])
	const [selectedSlot, setSelectedSlot] = useState<Slot | null>()

	interface Slot {
		id: number;
		quadra_id: number;
		date: string;
		horario_inicio: number;
		horario_fim: number;
		available: number;
	}


	const formatDate = (date: Date | undefined): string => {
		if (!date) return ''; // Retorna string vazia se a data for undefined
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0'); // Adiciona 1 ao mês (base 0) e padroniza com 2 dígitos
		const day = String(date.getDate()).padStart(2, '0');  
		return `${year}-${month}-${day}`;
	}

	const fetchQuadra = async (id : string) => {
		
        const response = await fetch(`http://localhost:3000/quadra/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json()

	};
	

	const { data: quadra, isFetching, error } = useQuery({
		queryKey: ['quadra', id],
		queryFn: () => fetchQuadra(id!), // Add the non-null assertion operator here
		staleTime: 60 * 1000,
		retry: 3,
	});

	if(error){
        alert("Something went wrong")
    }

	const handleBuscarSlots = async () => {
		try{
			const formattedDate = formatDate(date);
		
			const response = await fetch(`http://localhost:3000/disponibilidade-quadra?date=${formattedDate}&quadraId=${id}`)
			setSlots(await response.json())
		}
		catch(err){
			alert("Something went wrong")
		}
	}

	const formatTime = (hour: number): string => {
		const integerPart = Math.floor(hour);
		const decimalPart = hour - integerPart;

		const formattedHour = integerPart.toString().padStart(2, '0');
		const formattedMinutes = decimalPart === 0.5 ? '30' : '00';

		return `${formattedHour}:${formattedMinutes}`;
	};

	

	const navigate = useNavigate();

	const prosseguirPagamento = () =>{
		const formattedDate = formatDate(date);
		if(!selectedSlot)
		
			return
		navigate(`/reservar-quadra/${quadra.id}/${selectedSlot.id}/${formattedDate}`);
	}


	useEffect(() => {
		if(date){
			setSelectedSlot(null)
			handleBuscarSlots()
		}
	
		console.log(quadra)
	}, [date])

	

	return (
		<>
			<header className='flex justify-between items-center py-2 px-8 border-b '>
				<TbSoccerField size={48} />

				<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
					<NavigationMenuLink className={navigationMenuTriggerStyle()}>
						Home
					</NavigationMenuLink>
					</NavigationMenuItem>

					<NavigationMenuItem>
					<NavigationMenuLink className={navigationMenuTriggerStyle()}>
						Minha Quadras
					</NavigationMenuLink>
					</NavigationMenuItem>

					<NavigationMenuItem>
					<NavigationMenuLink className={navigationMenuTriggerStyle()}>
						Minha Conta
					</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
				</NavigationMenu>
			</header>

			{isFetching ? (<div className='flex items-center justify-center'><FadeLoader/></div>) : (
				<section className='flex flex-col px-2 pb-8 pt-10 gap-8 max-w-6xl mx-auto'>
				<div className='flex flex-col gap-2'>
					<div className='flex flex-row justify-between items-center'>
						<Label className=' font-bold text-2xl'>{quadra.name}</Label>
						<div className='flex flex-row gap-2 items-center'>
							<Label className='text-lg' >4.2</Label>
							<FaStar />
							<Button variant="outline">Avaliar</Button>
						</div>

					</div>
					<Label className='text-lg font-normal'>{quadra.address}</Label>
					<div className='flex flex-row align-center gap-2 mt-4'>
						<Badge className='text-sm' 	variant="outline">{quadra.type.charAt(0).toUpperCase() + quadra.type.slice(1)}</Badge>
						
					</div>

				</div>

				<Card className='h-60'>
					<img className="w-auto h-full object-contain " src={quadra.image_url}/>
				</Card>

				<div>
					<Accordion type="single" collapsible className='text-left'>
						<AccordionItem value="item-1" >
							<AccordionTrigger className='max-w-40 font-bold text-xl'>Descrição</AccordionTrigger>
							<AccordionContent>
								{quadra.description}
							</AccordionContent>
						</AccordionItem>
					</Accordion>
					<Separator className='h-0'/>
					<Accordion type="single" collapsible className='text-left'>
						<AccordionItem value="item-1" >
							<AccordionTrigger className='max-w-40 font-bold text-xl'>Regras</AccordionTrigger>
							<AccordionContent>
								{quadra.rules}
							</AccordionContent>
						</AccordionItem>
					</Accordion>
					<Separator className='h-0'/>
				</div>

				<Label className='font-bold text-2xl'>Reservar</Label>
				<div className='flex gap-10 flex-wrap justify-between'>
					<div className='flex flex-row gap-15 flex-wrap'>
						<div className='flex flex-col gap-6'>
						<Label className='text-xl' >Data</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
								variant={"outline"}
								className={cn(
									"w-50 justify-start text-left font-normal",
									!date && "text-muted-foreground"
								)}
								>
								<CalendarIcon className="mr-2 h-4 w-4" />
								{date ? format(date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar
								mode="single"
								selected={date}
								onSelect={setDate}
								initialFocus
								defaultMonth={today}
								disabled={(dateToCheck) => isBefore(dateToCheck, today) || isAfter(dateToCheck, oneMonthFromToday)}
								/>
							</PopoverContent>
						</Popover>
					
					</div>

					<div className='flex flex-col  gap-6'>
						<Label className='text-xl' >Horário</Label>
						
						{slots? (
							<Popover >
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className="w-[280px] justify-start text-left font-normal"
									disabled={!date}
								>
									<ClockIcon className="mr-2 h-4 w-4" />
									{selectedSlot? `${formatTime(selectedSlot.horario_inicio)} - ${formatTime(selectedSlot.horario_fim)}` : "Selecionar Horário"}
								</Button>

							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<div className="p-2 ">
									<div className="space-y-1  grid grid-cols-2 gap-2">
									{slots.map((slot) => {
									 	const now = new Date();
										const slotDate = new Date(slot.date);
										const slotHour = Math.floor(slot.horario_inicio); 

										const isPast =
											slotDate.getFullYear() < now.getFullYear() ||
											(slotDate.getFullYear() === now.getFullYear() && slotDate.getMonth() < now.getMonth()) ||
											(slotDate.getFullYear() === now.getFullYear() &&
											slotDate.getMonth() === now.getMonth() &&
											slotDate.getDate() < now.getDate()) ||
											(slotDate.getFullYear() === now.getFullYear() &&
											slotDate.getMonth() === now.getMonth() &&
											slotDate.getDate() === now.getDate() &&
											slotHour < now.getHours());

										const timeStr = `${formatTime(slot.horario_inicio)} - ${formatTime(slot.horario_fim)}`;
										const isSelected = selectedSlot == slot;
										return (
											<Card
											key={slot.id}
											className={cn(
												"px-3 py-1.5 rounded-md cursor-pointer transition-colors duration-200",
												"flex items-center justify-between",
												slot.available === 1 || isPast
												? "bg-gray-200 text-gray-500 "
												: "hover:bg-gray-100 text-gray-700",
												isSelected && "bg-blue-100 text-blue-600" 
											)}
											onClick={() => {
												if (slot.available !== 1) {
													setSelectedSlot(slot);
												}
											}}
											>
												<span>{timeStr}</span>
												
											</Card>
									)})}
									</div>
								</div>
							</PopoverContent>
						</Popover>) 
						: 	
						(<Label>Selecione uma Data</Label>)
						}

						
				
					</div>		
					</div>
					

					<Card className='flex flex-col w-100 gap-8 p-4'>
						<div className=' flex  flex-col gap-4'>
							<Label className='text-xl' >Finalizar Reserva</Label>
							<Separator/>
						</div>
						
						<Label className='text-lg' >Dia: <span className='text-base font-normal'>{date ? format(date, "PPP", { locale: ptBR }) : "Nenhum dia selecionado."}</span> </Label>

						<div className='flex gap-2 items-center'>
							<Label className='text-base' >Horário da reserva:</Label>
					
							{ selectedSlot ? (
									<span className='text-base font-normal'>{formatTime(selectedSlot.horario_inicio)} - {formatTime(selectedSlot.horario_fim)}</span>
								) : (<span className='text-sm'>Nenhum horário selecionado.</span>)
							}

						</div>
						
						<Label className='text-lg' >Total : <span className='font-normal'>{ selectedSlot? quadra.price : 0} R$ </span></Label>
							<Button disabled={!selectedSlot} className='w-full p-6' onClick={prosseguirPagamento}>
								Prosseguir para o Pagamento
							</Button>
						
					</Card>
				</div>
			</section>

			)}

		</>
	)
}


export default BuscarQuadrasView