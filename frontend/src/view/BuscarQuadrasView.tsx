import '../App.css'
import { useState } from 'react';
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '../components/ui/navigation-menu';
import { TbSoccerField } from "react-icons/tb"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from "@/components/ui/separator"
import { Checkbox } from '../components/ui/checkbox';




function BuscarQuadrasView() {

    const [selectedTypes, setSelectedTypes] = useState<Record<string, boolean>>({
       futebol: true,
        tennis: true,
        "beach-tennis": true,
        volei: true,
    });

    const [minPrice, setMinPrice] = useState<number | string>('');
    const [maxPrice, setMaxPrice] = useState<number | string>('');

    const [maxPlayerNumber, setMaxPlayerNumber] = useState<number | string>('');

    const handleCheckboxClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const { id } = event.currentTarget;
        setSelectedTypes((prev) => ({
          ...prev,
          [id]: !prev[id], // Toggle the selected state
        }));
      };

    const handleMinPriceChange = (value: string) => {
        const numValue = value ? Number(value) : '';
        numValue === "" ?   setMaxPlayerNumber(numValue) : numValue < 0 ? setMaxPlayerNumber(0) : setMaxPlayerNumber(numValue)
    };

    const handleMaxPriceChange = (value: string) => {
        const numValue = value ? Number(value) : '';
        numValue === "" ?   setMaxPlayerNumber(numValue) : numValue < 0 ? setMaxPlayerNumber(0) : setMaxPlayerNumber(numValue)
    };

    const handleMaxPlayerNumberChange = (value: string) => {
        const numValue = value ? Number(value) : '';
        numValue === "" ?   setMaxPlayerNumber(numValue) : numValue > 30 ? setMaxPlayerNumber(40) : setMaxPlayerNumber(numValue)
    };

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

        <section className='h-[400px] bg-gray-300 w-full flex place items-center justify-center'>
            <div className='flex flex-col gap-2'>
                <h1 className='text-6xl font-bold'>Encontre quadras</h1>
                <h6 className='text-gray-700'>Buscar quadras perto de você</h6>
            </div>
        </section>

        <section className='max-w-6xl mx-auto grid grid-cols-10 py-8 gap-2'>
            <Card className='col-span-3 flex flex-col px-6 '>
                <div>
                    <h4 className='font-bold'>Filtros</h4>
                </div>
                <Separator />

                <Label className='font-bold'>Preço</Label>
                <div className='flex flex-row gap-6'>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='min-price'>Preço Mínimo</Label>
                        <Input 
                            type='number' 
                            placeholder='Mínimo'
                            value={minPrice}
                            onChange={(e) => handleMinPriceChange(e.target.value)}
                        />
                    </div>
                   
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='max-price'>Preço Máximo</Label>
                        <Input 
                            type='number' 
                            placeholder='Máximo' 
                            value={maxPrice}
                            onChange={(e) => handleMaxPriceChange(e.target.value)} 
                        />
                    </div>
                    
                </div>

                <Separator />

                <div className='flex flex-col gap-5'>
                    <Label className='font-bold'>Tipo de Quadra</Label>
                    <div className='flex flex-col gap-4'>
                        <div className='flex gap-1'>
                        <Checkbox checked={selectedTypes.futebol} onClick={handleCheckboxClick} id="futebol" />
                        <Label htmlFor="futebol">Futebol</Label>
                        </div>

                        <div className='flex gap-1'>
                        <Checkbox checked={selectedTypes.tennis} onClick={handleCheckboxClick} id="tennis" />
                        <Label htmlFor="tennis">Tennis</Label>
                        </div>

                        <div className='flex gap-1'>
                        <Checkbox checked={selectedTypes["beach-tennis"]} onClick={handleCheckboxClick} id="beach-tennis" />
                        <Label htmlFor="beach-tennis">Beach-Tennis</Label>
                        </div>

                        <div className='flex gap-1'>
                        <Checkbox checked={selectedTypes.volei} onClick={handleCheckboxClick} id="volei" />
                        <Label htmlFor="volei">Volei</Label>
                        </div>
                    </div>
                </div>
                <Separator />

                <Label className='font-bold'>Número máximo de jogadores</Label>
                <Input 
                    className='w-1/2'
                    type='number' 
                    placeholder='N. Jogadores'
                    value={maxPlayerNumber}
                    onChange={(e) => handleMaxPlayerNumberChange(e.target.value)}
                />

            </Card>

            <div className='relative col-span-7'>
                <Label htmlFor="search" className="sr-only">
                    Search
                </Label>
                <Input
                    id="search"
                    placeholder="Search the docs..."
                    className="pl-8"
                />
                <Search className="pointer-events-none absolute left-2 top-[10px] size-4 select-none opacity-50" />
            </div>
        </section>
    </>
  )
}


export default BuscarQuadrasView