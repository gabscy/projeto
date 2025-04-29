import '../App.css'
import { TbSoccerField } from "react-icons/tb";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '../components/ui/navigation-menu';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { cn } from '../lib/utils';
import { ScrollArea } from '../components/ui/scroll-area';
import { format, isAfter, setHours, setMinutes } from 'date-fns';
import { Button } from '../components/ui/button';
import { FaRegClock } from "react-icons/fa";
import { Textarea } from '../components/ui/textarea';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';


function CadastroQuadraView() {
  const [selectedTimeStart, setSelectedTimeStart] = useState<Date | undefined>(undefined);
  const [selectedTimeEnd, setSelectedTimeEnd] = useState<Date | undefined>(undefined);
  const [isPopoverOpenStart, setIsPopoverOpenStart] = useState(false);
  const [isPopoverOpenEnd, setIsPopoverOpenEnd] = useState(false);
  const [timeOptions, setTimeOptions] = useState<Date[]>([]);
  const [courtName, setCourtName] = useState('');
  const [opencourtType, setOpenCourtType] = useState(false)
  const [courtType, setCourtType] = useState("")
  const [courtAddress, setCourtAddress] = useState('');
  const [courtRules, setCourtRules] = useState('');
  const [courtDescription, setCourtDescription] = useState('');
  const [courtImage, setCourtImage] = useState<File | null>(null);
  const [courtDocument, setCourtDocument] = useState<File | null>(null);
  const [openSlot, setOpenSlot] = useState(false)
  const [slot, setSlot] = useState("")


  const generateTimeOptions = (startTime?: Date) => {
    const times = [];
    const now = new Date();
    // Start from 00:00 today
    let currentTime = setMinutes(setHours(now, 0), 0);

    // If startTime is provided, start from that time
    if (startTime) {
        currentTime = new Date(startTime);
        currentTime = setMinutes(setHours(currentTime, currentTime.getHours()), 0);
    }

    for (let i = 0; i < 24; i++) { // Generate times for a 24-hour period, or until 23:00
        times.push(currentTime);
        currentTime = setHours(currentTime, currentTime.getHours() + 1); // Increment by 1 hour

    }
    return times;
  };

  // Initialize time options on component mount
  useEffect(() => {
      setTimeOptions(generateTimeOptions());
  }, []);

  // Update available end times when start time changes
  useEffect(() => {
      if (selectedTimeStart) {
          const nextHour = setMinutes(setHours(selectedTimeStart, selectedTimeStart.getHours() + 1), 0);
          setTimeOptions(generateTimeOptions(nextHour)); // Pass start time to generateTimeOptions
      } else {
          setTimeOptions(generateTimeOptions());
      }
  }, [selectedTimeStart]);



  const handleTimeSelectStart = useCallback((time: Date) => {
    setSelectedTimeStart(time);
    setSelectedTimeEnd(undefined); // Reset end time when start time changes
    setIsPopoverOpenStart(false);
  }, []);

  const handleTimeSelectEnd = useCallback((time: Date) => {
      setSelectedTimeEnd(time);
      setIsPopoverOpenEnd(false);
  }, []);

  const getValidEndTimeOptions = () => {
      if (!selectedTimeStart) return generateTimeOptions(); // If no start time, show all

      return timeOptions.filter(optionTime => isAfter(optionTime, selectedTimeStart));
  };

  const validEndTimeOptions = getValidEndTimeOptions();

  const [selectedDays, setSelectedDays] = useState<Record<string, boolean>>({
    segunda: false,
    terca: false,
    quarta: false,
    quinta: false,
    sexta: false,
    sabado: false,
    domingo: false,
  });

  const handleCheckboxClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = event.currentTarget;
    setSelectedDays((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the selected state
    }));
  };

  const handleCourtImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null; // Get the first selected file or null
    setCourtImage(file);
    console.log('Selected Image:', file);
  };

  const handleCourtDocumentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null; // Get the first selected file or null
    setCourtDocument(file);
    console.log('Selected Image:', file);
  };

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData();

    // Add each field to FormData
    formData.append("courtName", courtName);
    formData.append("courtType", courtType);
    formData.append("courtAddress", courtAddress);
    formData.append("courtDescription", courtDescription);
    formData.append("courtRules", courtRules);

    // Convert `selectedDays` (array or object) into a JSON string if needed
    formData.append("selectedDays", JSON.stringify(selectedDays));

    // Convert time values
    formData.append("selectedTimeStart", selectedTimeStart?.getHours().toString() as string);
    formData.append("selectedTimeEnd", selectedTimeEnd?.getHours().toString() as string);

    formData.append("slot", slot);

    if (courtImage) {
      formData.append('courtImage', courtImage);
    }

    if (courtDocument) {
      formData.append('courtDocument', courtDocument);
    }

    const entries = Object.fromEntries(formData.entries());
    console.log(entries);
  }

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

      <main className='max-w-4xl mx-auto py-8'>
        <form action="" onSubmit={(e) => handleSubmitForm(e)}>
          <div className='flex flex-col gap-6'> 
            <div className='grid gap-2'>
              <Label>Nome da quadra</Label>
              <Input
                onChange={(e) => setCourtName(e.target.value)}
              />
            </div>

            <div className='grid gap-2'>
              <Label>Tipo de quadra</Label>
              <Popover open={opencourtType} onOpenChange={setOpenCourtType}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={opencourtType}
                    className="w-[200px] justify-between"
                  >
                    {courtType
                      ? tiposQuadras.find((tipo) => tipo.value === courtType)?.label
                      : "Selecionar tipo de quadra"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Pesquisar tipo de quadra..." />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {tiposQuadras.map((tipo) => (
                          <CommandItem
                            key={tipo.value}
                            value={tipo.value}
                            onSelect={(currentValue) => {
                              setCourtType(currentValue === courtType ? "" : currentValue)
                              setOpenCourtType(false)
                            }}
                          >
                            {tipo.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                courtType === tipo.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className='grid gap-2'>
              <Label>Endereço da quadra</Label>
              <Input
                onChange={(e) => setCourtAddress(e.target.value)}
              />
            </div>

            <div className='grid gap-2'>
              <Label>Regras da quadra</Label>
              <Textarea
                value={courtRules}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCourtRules(e.target.value)}
              />
            </div>

            <div className='grid gap-2'>
              <Label>Descrição da quadra</Label>
              <Textarea
                value={courtDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCourtDescription(e.target.value)}
              />
            </div>

            <div className='grid gap-3'>
              <Label>Dias de funcionamento</Label>
              <div className='flex gap-4'>
                <div className='flex gap-1'>
                  <Checkbox checked={selectedDays.segunda} onClick={handleCheckboxClick} id="segunda" />
                  <Label htmlFor="segunda">Segunda</Label>
                </div>

                <div className='flex gap-1'>
                  <Checkbox checked={selectedDays.terca} onClick={handleCheckboxClick} id="terca" />
                  <Label htmlFor="terca">Terça</Label>
                </div>

                <div className='flex gap-1'>
                  <Checkbox checked={selectedDays.quarta} onClick={handleCheckboxClick} id="quarta" />
                  <Label htmlFor="quarta">Quarta</Label>
                </div>

                <div className='flex gap-1'>
                  <Checkbox checked={selectedDays.quinta} onClick={handleCheckboxClick} id="quinta" />
                  <Label htmlFor="quinta">Quinta</Label>
                </div>

                <div className='flex gap-1'>
                  <Checkbox checked={selectedDays.sexta} onClick={handleCheckboxClick} id="sexta" />
                  <Label htmlFor="sexta">Sexta</Label>
                </div>

                <div className='flex gap-1'>
                  <Checkbox checked={selectedDays.sabado} onClick={handleCheckboxClick} id="sabado" />
                  <Label htmlFor="sabado">Sábado</Label>
                </div>

                <div className='flex gap-1'>
                  <Checkbox checked={selectedDays.domingo} onClick={handleCheckboxClick} id="domingo" />
                  <Label htmlFor="domingo">Domingo</Label>
                </div>
              </div>
            </div>

            <div className='grid gap-2'>
              <Label>Horário de funcionamento</Label>
              <div className='flex gap-2'>
                <Popover open={isPopoverOpenStart} onOpenChange={setIsPopoverOpenStart}>
                  <PopoverTrigger asChild>
                      <Button
                          variant={"outline"}
                          className={cn(
                              "w-[300px] justify-start text-left font-normal",
                              !selectedTimeStart && "text-muted-foreground"
                          )}
                      >
                          <FaRegClock className="mr-2 h-4 w-4" />
                          {selectedTimeStart ? format(selectedTimeStart, "HH:mm") : <span>Horário primeira reserva</span>}
                      </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                      <ScrollArea className="h-72 w-40 rounded-md border">
                          <div className="p-1">
                              {generateTimeOptions().map((time, index) => {
                                  const isDisabled = false; // Start time should never be disabled
                                  return (
                                      <div
                                          key={index}
                                          onClick={() => !isDisabled && handleTimeSelectStart(time)}
                                          className={cn(
                                              "px-2 py-1.5 rounded-md cursor-pointer",
                                              hoverClass(isDisabled),
                                              selectedTimeStart?.getTime() === time.getTime() && "bg-gray-200 dark:bg-gray-700 font-semibold",
                                              isDisabled && "opacity-50 cursor-not-allowed"
                                          )}
                                          style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}

                                      >
                                          {format(time, "HH:mm")}
                                      </div>
                                  )
                              })}
                          </div>
                      </ScrollArea>
                  </PopoverContent>
                </Popover>
                <Popover open={isPopoverOpenEnd} onOpenChange={setIsPopoverOpenEnd}>
                  <PopoverTrigger asChild>
                      <Button
                          variant={"outline"}
                          className={cn(
                              "w-[300px] justify-start text-left font-normal",
                              !selectedTimeEnd && "text-muted-foreground",
                              !selectedTimeStart && "opacity-50 cursor-not-allowed" // Disable if no start time
                          )}
                          disabled={!selectedTimeStart}
                      >
                          <FaRegClock className="mr-2 h-4 w-4" />
                          {selectedTimeEnd ? format(selectedTimeEnd, "HH:mm") : <span>Horário última reserva</span>}
                      </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                      <ScrollArea className="h-72 w-40 rounded-md border">
                          <div className="p-1">
                              {validEndTimeOptions.map((time, index) => {
                                      const isMidnightOrAfter: boolean = !!selectedTimeStart && ((time.getHours() < selectedTimeStart.getHours() && (time.getHours() != 0 )) || (time.getHours() == selectedTimeStart.getHours()) );
                                      return (
                                      <div
                                          key={index}
                                          onClick={() => !isMidnightOrAfter && handleTimeSelectEnd(time)}
                                          className={cn(
                                              "px-2 py-1.5 rounded-md cursor-pointer",
                                              hoverClass(isMidnightOrAfter),
                                              selectedTimeEnd?.getTime() === time.getTime() && "bg-gray-200 dark:bg-gray-700 font-semibold",
                                              isMidnightOrAfter && "opacity-50 cursor-not-allowed"
                                          )}
                                          style={{ cursor: isMidnightOrAfter ? 'not-allowed' : 'pointer' }}

                                      >
                                          {format(time, "HH:mm")}
                                      </div>
                                  )
                              })}
                          </div>
                      </ScrollArea>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className='grid gap-2'>
              <Label>Slot (Duração de reserva)</Label>
              <Popover open={openSlot} onOpenChange={setOpenSlot}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openSlot}
                    className="w-[200px] justify-between"
                  >
                    {slot
                      ? slotsQuadra.find((tempo) => tempo.value === slot)?.label
                      : "Selecionar tempo"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Pesquisar tempo..." />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {slotsQuadra.map((tempo) => (
                          <CommandItem
                            key={tempo.value}
                            value={tempo.value}
                            onSelect={(currentValue) => {
                              setSlot(currentValue === slot ? "" : currentValue)
                              setOpenSlot(false)
                            }}
                          >
                            {tempo.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                slot === tempo.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className='grid gap-2'>
              <Label>Foto da quadra</Label>
              <Input 
                type="file"
                onChange={handleCourtImageChange}
              />
            </div>

            <div className='grid gap-2'>
              <Label>IPTU de quadra</Label>
              <Input 
                type="file"
                onChange={handleCourtDocumentChange}
              />
            </div>

          <Button type='submit' variant={'default'}>Cadastrar Quadra</Button>
          </div>
        </form>
      </main>
    </>
  )
}

const hoverClass = (isMidnightOrAfter: boolean) => {
  return isMidnightOrAfter ? "" : "hover:bg-gray-100 dark:hover:bg-gray-800";
}

const tiposQuadras = [
  {
    value: "tennis",
    label: "Tennis",
  },
  {
    value: "futebol",
    label: "Futebol",
  },
  {
    value: "volei",
    label: "Volei",
  },
  {
    value: "beach-tennis",
    label: "Beach Tennis",
  },
  {
    value: "calca",
    label: "Calca",
  },
]

const slotsQuadra = [
  {
    value: "30",
    label: "0:30",
  },
  {
    value: "60",
    label: "1:00",
  },
  {
    value: "90",
    label: "1:30",
  },
  {
    value: "120",
    label: "2:00",
  }
]

export default CadastroQuadraView