import '../App.css'
import { useEffect, useState} from 'react';
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '../components/ui/navigation-menu';
import { TbSoccerField } from "react-icons/tb"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from "@/components/ui/separator";
import { Checkbox } from '../components/ui/checkbox';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge"
import { FaStar } from "react-icons/fa";
import { Button } from '../components/ui/button';
import { data, Link } from 'react-router-dom';
import { FadeLoader } from "react-spinners"


import { useQuery, useQueryClient } from '@tanstack/react-query';


function BuscarQuadrasView() {

    const [selectedTypes, setSelectedTypes] = useState<Record<string, boolean>>({
       futebol: true,
        tennis: true,
        "beach-tennis": true,
        volei: true,
    });

    const [courtCEP, setCourtCEP] = useState('')
    const [minPrice, setMinPrice] = useState<number | string>('');
    const [maxPrice, setMaxPrice] = useState<number | string>('');
    const [filteredData, setFilteredData] = useState([]);

   

    const handleCheckboxClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const { id } = event.currentTarget;
        setSelectedTypes((prev) => ({
          ...prev,
          [id]: !prev[id], 
        }));
      };

    const handleMinPriceChange = (value: string) => {
        const numValue = value ? Number(value) : '';
        numValue === "" ?   setMinPrice(numValue) : numValue < 0 ? setMinPrice(0) : setMinPrice(numValue)
    };

    const handleMaxPriceChange = (value: string) => {
        const numValue = value ? Number(value) : '';
        numValue === "" ?   setMaxPrice(numValue) : numValue < 0 ? setMaxPrice(0) : setMaxPrice(numValue)
    };

    //Atualiza Cep da quadra
    const handleCEPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value.replace(/[^0-9]/g, '');
        event.target.value = newValue
        if(event.target.value.length ==8){
            setCourtCEP(newValue);
        }
    };
    
   
    // Define the fetch function
    const fetchQuadras = async () => {
        const response = await fetch('http://localhost:3000/buscar-quadras');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.json()

    }

    const { data, isFetching, refetch , error} = useQuery({
        queryKey: ["quadras"],
        queryFn: fetchQuadras,
    });

    if(error){
        alert("Something went wrong")
    }

    const atualizarFiltros = (allQuadras: any) => {
        if (!allQuadras) {
            setFilteredData([]);
            return;
        }
        const filtered = allQuadras.filter((quadra: any) => {
        // Filter selected types
        const isTypeSelected = selectedTypes[quadra.type] === true;

        // Filter  min price
        const priceAboveMin =
            minPrice === '' || (quadra.price !== undefined && Number(quadra.price) >= Number(minPrice));

        // Filter  max price
        const priceBelowMax =
            maxPrice === '' || (quadra.price !== undefined && Number(quadra.price) <= Number(maxPrice));

        return isTypeSelected && priceAboveMin && priceBelowMax;
    });

    setFilteredData(filtered);

    }

    useEffect(() => {
        if (data) {
            atualizarFiltros(data.quadras);
        }
     }, [selectedTypes, courtCEP, minPrice, maxPrice, data]);
    


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

        

        <section className='max-w-6xl mx-auto grid grid-cols-10 grid-rows-10 py-8 gap-2'>
            
            <Card className='col-span-3 row-span-7 flex flex-col px-6 '>
                <div >
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
                            min={0}
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
                            min={0}
                            onChange={(e) => handleMaxPriceChange(e.target.value)} 
                        />
                    </div>
                </div>

                <Separator />
                
                <Label className='font-bold'>Localização</Label>
                <div className='flex gap-4'>
                    <Label>Digite seu CEP</Label>
                    <Input className='w-25'  min="0" maxLength={8} onChange={(e) => {handleCEPChange(e)}}/>
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

            <div className='col-span-7 col-start-4 row-start-2 row-span-10 '>
               
                    {!isFetching ? (
                        <ScrollArea className="h-200 w-full -mt-4">
                            {filteredData.map((quadra: any) => (
                                 <Card key={quadra.id} className='h-50 flex items-center flex-row gap-4 p-4 mb-4'>
                                    <img  className="rounded h-full max-w-50" src={quadra.image_url} alt="Imagem de Quadra"/>
                                    <div className='w-full h-full flex flex-col gap-4'>
                                        <Label className='font-bold text-lg'>{quadra.name}</Label>
                                        <div className='flex flex-row gap-2'>
                                            <Label >4.2</Label>
                                            <FaStar />
                                        </div>
                                        <Label className='font-normal'>{quadra.address}</Label>
                                        <div className='flex flex-row align-center gap-2 mt-4'>
                                            <Badge variant="outline">{quadra.type.charAt(0).toUpperCase() + quadra.type.slice(1)}</Badge>
                                        </div>
                                    </div>
            
                                    <div className='flex flex-col h-full justify-end gap-4 pb-4 pr-2'>
                                            <Label>{quadra.price} R$ - {quadra.slot} min</Label>
                                            <Link to={`/reservar-quadra`}>
                                                <Button variant="outline">Reservar</Button>
                                            </Link>  
                                    </div>
                                </Card>
                            ))}
                        </ScrollArea>
                    ) : (
                        <div className=' mt-20 h-full flex items-start justify-center'>
                         <FadeLoader/>
                        </div>
                        
                    )}
                            
            </div>
        </section>
    </>
  )
}


export default BuscarQuadrasView