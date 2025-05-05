import '../App.css'
import * as React from "react"
import { useState } from 'react';
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '../components/ui/navigation-menu';
import { TbSoccerField } from "react-icons/tb"
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge"
import { FaStar } from "react-icons/fa";
import { format, addMonths, startOfDay, isBefore, isAfter } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator";



import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"




function BuscarQuadrasView() {
	const [date, setDate] = React.useState<Date>();
	const today = startOfDay(new Date());
	const oneMonthFromToday = addMonths(today, 1);

	return (
		<>
			<header className='flex justify-between items-center py-2 px-8 border-b'>
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

			<section className='flex flex-col px-2 pt-10 gap-8 max-w-6xl mx-auto'>
				<div className='flex flex-col gap-2'>
					<div className='flex flex-row justify-between items-center'>
						<Label className=' font-bold text-2xl'>Playball Pompeia</Label>
						<div className='flex flex-row gap-2 items-center'>
							<Label className='text-lg' >4.2</Label>
							<FaStar />
							<Button variant="outline">Avaliar</Button>
						</div>

					</div>
					<Label className='text-lg font-normal'>Rua Jararaquara 123</Label>
					<div className='flex flex-row align-center gap-2 mt-4'>
						<Badge className='text-sm' 	variant="outline">Futebol</Badge>
						<Badge className='text-sm' variant="outline">12 pessoas</Badge>
					</div>

				</div>

				<Card className='h-80'>
					<img 	className="w-auto h-full object-contain " src="/imgs/quadrateste.jpg" alt="Imagem de Quadra"/>
				</Card>

				<div>
					<Accordion type="single" collapsible className='text-left'>
						<AccordionItem value="item-1" >
							<AccordionTrigger className='max-w-40 font-bold text-lg'>Descrição</AccordionTrigger>
							<AccordionContent>
							Esta quadra de futebol oferece um espaço amplo e bem cuidado para a prática do desporto rei. Com dimensões oficiais, relva de alta qualidade e iluminação adequada, o campo está pronto para receber jogos amadores e profissionais. As balizas emolduram o relvado, convidando a grandes jogadas.
							</AccordionContent>
						</AccordionItem>
					</Accordion>
					<Separator className='h-0'/>
					<Accordion type="single" collapsible className='text-left'>
						<AccordionItem value="item-1" >
							<AccordionTrigger className='max-w-40 font-bold text-lg'>Regras</AccordionTrigger>
							<AccordionContent>
							É proibido fumar nas instalações.

Não é permitido o uso de chuteiras com pitons de metal.

Os jogadores devem usar equipamento adequado.

A quadra deve ser utilizada apenas para a prática de futebol.

Os jogos devem terminar no horário agendado.

É proibido levar comida e bebida para dentro da quadra.

Os utilizadores são responsáveis por manter a quadra limpa e organizada.
							</AccordionContent>
						</AccordionItem>
					</Accordion>
					<Separator className='h-0'/>
				</div>


				<Label className='font-bold text-2xl'>Reservar</Label>
				<div className='grid grid-cols-3'>
					<div className='flex flex-col gap-4'>
						<Label >Data</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
								variant={"outline"}
								className={cn(
									"w-[280px] justify-start text-left font-normal",
									!date && "text-muted-foreground"
								)}
								>
								<CalendarIcon className="mr-2 h-4 w-4" />
								{date ? format(date, "PPP") : <span>Escolha uma data</span>}
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
          

				</div>


			</section>


		</>
	)
}


export default BuscarQuadrasView