import '../App.css'
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '../components/ui/navigation-menu';
import { TbSoccerField } from "react-icons/tb"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from "@/components/ui/separator"


function BuscarQuadrasView() {
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
            <Card className='col-span-3 flex flex-col'>
                <div>
                    <h4 className='font-bold'>Filtros</h4>
                </div>
                <Separator />

                <div>

                </div>
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