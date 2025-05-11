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
import { useNavigate } from 'react-router-dom';

function PublicarQuadraView() {
  //tempo de funcionamento
  const [selectedTimeStart, setSelectedTimeStart] = useState<Date | undefined>(undefined);
  const [selectedTimeEnd, setSelectedTimeEnd] = useState<Date | undefined>(undefined);
  const [isPopoverOpenStart, setIsPopoverOpenStart] = useState(false);
  const [isPopoverOpenEnd, setIsPopoverOpenEnd] = useState(false);
  const [timeOptions, setTimeOptions] = useState<Date[]>([]);

  //informacoes da quadra
  const [courtName, setCourtName] = useState('');
  const [opencourtType, setOpenCourtType] = useState(false)
  const [courtType, setCourtType] = useState("")
  const [courtState, setCourtState] = useState<UF | null>(null);
  const [openState, setOpenState] = useState(false);
  const [courtCity, setCourtCity] = useState("");
  const [courtCEP, setCourtCEP] = useState('')
  const [courtAddress, setCourtAddress] = useState('');
  const [courtRules, setCourtRules] = useState('');
  const [courtDescription, setCourtDescription] = useState('');
  const [courtImage, setCourtImage] = useState<File | null>(null);
  const [courtDocument, setCourtDocument] = useState<File | null>(null);
  const [openSlot, setOpenSlot] = useState(false)
  const [slot, setSlot] = useState("")
  const [courtPrice, setCourtPrice] = useState('')
  const [openCity, setOpenCity] = useState(false)

  // Estados para validação do formulário
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [first, setFirst] = useState<Boolean>(true)

  const navigate = useNavigate();


    // Gera opções de hora com base em um horário de início 
  const generateTimeOptions = (startTime?: Date) => {
    const times = [];
    const now = new Date();
    let currentTime = setMinutes(setHours(now, 0), 0);

    if (startTime) {
        currentTime = new Date(startTime);
        currentTime = setMinutes(setHours(currentTime, currentTime.getHours()), 0);
    }

    for (let i = 0; i < 24; i++) { 
        times.push(currentTime);
        currentTime = setHours(currentTime, currentTime.getHours() + 1); // Increment by 1 hour

    }
    return times;
  };

  // Inicializa as opções de hora ao montar o componente
  useEffect(() => {
      setTimeOptions(generateTimeOptions());
  }, []);

   // Atualiza as opções de hora de término quando o horário de início muda
  useEffect(() => {
      if (selectedTimeStart) {
          const nextHour = setMinutes(setHours(selectedTimeStart, selectedTimeStart.getHours() + 1), 0);
          setTimeOptions(generateTimeOptions(nextHour)); 
      } else {
          setTimeOptions(generateTimeOptions());
      }
  }, [selectedTimeStart]);


   // Define o horário de início 
  const handleTimeSelectStart = useCallback((time: Date) => {
    setSelectedTimeStart(time);
    setSelectedTimeEnd(undefined); 
    setIsPopoverOpenStart(false);
  }, []);

  // Define o horário de fim
  const handleTimeSelectEnd = useCallback((time: Date) => {
      setSelectedTimeEnd(time);
      setIsPopoverOpenEnd(false);
  }, []);

  // Filtra as opções de horário de término válidas (após o horário de início)
  const getValidEndTimeOptions = () => {
      if (!selectedTimeStart) return generateTimeOptions(); 
      return timeOptions.filter(optionTime => isAfter(optionTime, selectedTimeStart));
  };

  const validEndTimeOptions = getValidEndTimeOptions();

  // Estado para os dias da semana selecionados
  const [selectedDays, setSelectedDays] = useState<Record<string, boolean>>({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  // Atualiza o estado do dia da semana selecionado ao clicar no checkbox
  const handleCheckboxClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = event.currentTarget;
    setSelectedDays((prev) => ({
      ...prev,
      [id]: !prev[id], 
    }));
  };

  //Atualiza Cep da quadra
  const handleCEPChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.replace(/[^0-9]/g, '');
    event.target.value = newValue

      setCourtCEP(newValue);
    
  };

  const handleCourtImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null; // Get the first selected file or null
    setCourtImage(file);
  };

  const handleCourtDocumentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null; // Get the first selected file or null
    setCourtDocument(file);
  };

   // Valida o formulário sempre que um campo relevante muda
  useEffect(() => {
    validateForm();
   }, [courtName, courtType, courtAddress, courtState, courtDescription, courtRules, selectedDays,courtCity, courtCEP, selectedTimeStart, selectedTimeEnd, slot, courtDocument, courtImage]);


  // Função para validar o formulário
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    let isValid = true;

    if (!courtName.trim()) {
      errors.courtName = "Por favor, digite o nome da quadra.";
      isValid = false;
    }
    if (!courtType) {
      errors.courtType = "Por favor, selecione o tipo de quadra.";
      isValid = false;
    }
    if (!courtAddress.trim()) {
      errors.courtAddress = "Por favor, digite o endereço da quadra.";
      isValid = false;
    }
    if (!courtState) {
      errors.courtState = "Por favor, selecione um estado.";
      isValid = false;
    }
    if(!courtCity.trim()){
      errors.courtCity = "Por favor, selecione a cidade da quadra"
      isValid= false;
    }

    if (!courtCEP.trim() || courtCEP.trim().length < 8) {
      errors.courtCEP = "Por favor, digite o CEP da quadra.";
      isValid = false;

    }

    if (!courtDescription.trim()) {
      errors.courtDescription = "Por favor, insira a descrição da quadra.";
      isValid = false;
    }
    if (!courtRules.trim()) {
      errors.courtRules = "Por favor, insira as regras da quadra.";
      isValid = false;
    }
    if (!Object.values(selectedDays).some(Boolean)) {
      errors.selectedDays = "Por favor, selecione pelo menos um dia de funcionamento.";
      isValid = false;
    }
    
    if (!selectedTimeStart) {
      errors.selectedTimeStart = "Por favor, selecione o horário de início.";
      isValid = false;
    }
    if (!selectedTimeEnd) {
      errors.selectedTimeEnd = "Por favor, selecione o horário de término.";
      isValid = false;
    }
    if (!slot) {
      errors.slot = "Por favor, selecione a duração do slot.";
      isValid = false;
    }
    
    if (!courtPrice) {
      errors.courtPrice = "Por favor, digite o preço da reserva.";
      isValid = false;
    }

    if (!courtImage){
      errors.courtImage = "Por favor, escolha uma imagem";
      isValid = false;
    }
    if(!courtDocument){
      errors.courtDocument = "Por favor, escolha um documento.";
      isValid = false
    }
   
    setFormErrors(errors);
    setIsFormValid(isValid);
 
  };

    // Envia os dados do formulário para o servidor
  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFirst(false);

    // ... (seu código de validação e criação do formData) ...

    if (isFormValid) {
      const formData = new FormData();
      formData.append("courtName", courtName);
      formData.append("courtType", courtType);
      formData.append("courtAddress", courtAddress);
      formData.append("courtState", courtState?.value || '');
      formData.append("courtCity", courtCity);
      formData.append("courtCEP", courtCEP);
      formData.append("courtDescription", courtDescription);
      formData.append("courtRules", courtRules);
      formData.append("selectedDays", JSON.stringify(selectedDays));
      formData.append("selectedTimeStart", selectedTimeStart?.getHours().toString() as string);
      formData.append("selectedTimeEnd", selectedTimeEnd?.getHours().toString() as string);
      formData.append("slot", slot);
      formData.append("courtPrice", courtPrice);
      if (courtImage) {
        formData.append('courtImage', courtImage);
      }
      if (courtDocument) {
        formData.append('courtDocument', courtDocument);
      }
      console.log(formData)
      //publicar dados
      try {
        const response = await fetch('http://localhost:3000/quadra', {
          method: 'POST',
          body: formData,
        });


        if (response.ok) {
          console.log(formData)
          alert('Quadra publicada com sucesso!');
          
          navigate('/'); // Redireciona para a página inicial
          
        } else {
          console.error('Erro ao publicar a quadra:', response.status);
         
        }

      } catch (error) {
        console.log(error);

      }

    } else {
      console.log("Formulário inválido. Por favor, corrija os erros.");
    }
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

      <main className='max-w-4xl mx-auto py-8'>
        <form action="" onSubmit={(e) => handleSubmitForm(e)}>
          <div className='flex flex-col gap-8'> 

            <div>
              <div className='grid gap-2'>
                <Label>Nome da quadra</Label>
                <Input
                  onChange={(e) => setCourtName(e.target.value)}
                />
              </div>
              {formErrors.courtName && !first && <p className="text-left text-sm text-red-500">{formErrors.courtName}</p>}
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
              {formErrors.courtType && !first && <p className="text-left text-sm text-red-500">{formErrors.courtType}</p>}
            </div>

            <div className='grid gap-2'>
              <Label>Endereço da quadra</Label>
              <Input
                onChange={(e) => setCourtAddress(e.target.value)}
              />
                {formErrors.courtAddress && !first && <p className="text-left text-sm text-red-500">{formErrors.courtAddress}</p>}
            </div>
            
            <div className='flex flex-row flex-wrap gap-10'>
              <div className="flex items-center space-x-4">
                <Label>Estado</Label>
                <Popover open={openState} onOpenChange={setOpenState}>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      {courtState ? (
                        <>{courtState.label}</>
                      ) : (
                        <>Selecionar Estado</>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-40"  align="start">
                    <Command>
                      <CommandInput placeholder="Buscar estado..." />
                      <CommandList>
                        <CommandEmpty>Nenhum estado encontrado.</CommandEmpty>
                        <CommandGroup>
                          {estados.map((estado) => (
                            <CommandItem
                              key={estado.label}
                              value={estado.value}
                              onSelect={(value) => {
                                setCourtState(
                                  estados.find((uf) => uf.value === value) || null
                                );
                                setOpenState(false);
                              }}
                            >
                              {estado.label} 
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {formErrors.courtState && !first &&  <p className="text-sm text-red-500">{formErrors.courtState}</p>}
            </div>
            
            <div className="flex items-center space-x-4">
              <Label>Cidade</Label>
              <Popover open={openCity} onOpenChange={setOpenCity}>
                <PopoverTrigger asChild>
                  <Button disabled={!courtState} variant="outline" className={cn("w-[220px] justify-start", formErrors.courtCity && "ring-red-500")}>
                    {courtCity ? (
                      <>{cidadesSaoPaulo.find((c) => c.value == courtCity)?.label}</> 
                    ) : (
                      <>Selecionar Cidade</>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-80" align="start">
                  <Command>
                    <CommandInput placeholder="Buscar cidade..." />
                    <CommandList>
                      <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
                      <CommandGroup>
                        {cidadesSaoPaulo.map((cidade) => (
                          <CommandItem
                            key={cidade.label}
                            value={cidade.label}
                            onSelect={(value) => {
                              setCourtCity(
                                cidade.value
                              );
                              setOpenCity(false);
                            }}
                          >
                            {cidade.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {formErrors.courtCity && !first && <p className="text-sm text-red-500">{formErrors.courtCity}</p>}
            </div>
            
            <div className='flex gap-4'>
              <Label>CEP</Label>
              <Input   min="0" maxLength={8} onChange={(e) => {handleCEPChange(e)}}/>
              {formErrors.courtCEP && !first && <p className="text-sm text-red-500">{formErrors.courtCEP}</p>}
            </div>

          </div>
            

            <div className='grid gap-2'>
              <Label>Regras da quadra</Label>
              <Textarea
                value={courtRules}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCourtRules(e.target.value)}
              />
               {formErrors.courtRules && !first && <p className="text-sm text-left text-red-500">{formErrors.courtRules}</p>}
            </div>

            <div className='grid gap-2'>
              <Label>Descrição da quadra</Label>
              <Textarea
                value={courtDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCourtDescription(e.target.value)}
              />
               {formErrors.courtDescription && !first && <p className="text-sm text-left text-red-500">{formErrors.courtDescription}</p>}
            </div>

            <div className='grid gap-3'>
              <Label>Dias de funcionamento</Label>
              <div className='flex gap-4'>
                <div className='flex gap-1'>
                  <Checkbox checked={selectedDays.monday} onClick={handleCheckboxClick} id="monday" />
                  <Label htmlFor="segunda">Segunda</Label>
                </div>

                <div className='flex gap-1'>
                  <Checkbox checked={selectedDays.tuesday} onClick={handleCheckboxClick} id="tuesday" />
                  <Label htmlFor="terca">Terça</Label>
                </div>

                <div className='flex gap-1'>
                  <Checkbox checked={selectedDays.wednesday} onClick={handleCheckboxClick} id="wednesday" />
                  <Label htmlFor="quarta">Quarta</Label>
                </div>

                <div className='flex gap-1'>
                  <Checkbox checked={selectedDays.thursday} onClick={handleCheckboxClick} id="thursday" />
                  <Label htmlFor="quinta">Quinta</Label>
                </div>

                <div className='flex gap-1'>
                  <Checkbox checked={selectedDays.friday} onClick={handleCheckboxClick} id="friday" />
                  <Label htmlFor="sexta">Sexta</Label>
                </div>

                <div className='flex gap-1'>
                  <Checkbox checked={selectedDays.saturday} onClick={handleCheckboxClick} id="saturday" />
                  <Label htmlFor="sabado">Sábado</Label>
                </div>

                <div className='flex gap-1'>
                  <Checkbox checked={selectedDays.sunday} onClick={handleCheckboxClick} id="sunday" />
                  <Label htmlFor="domingo">Domingo</Label>
                </div>
              </div>
              {formErrors.selectedDays && !first && <p className="text-left text-sm text-red-500">{formErrors.selectedDays}</p>}
            </div>

            <div className='grid gap-2'>
              <Label>Horário de funcionamento</Label>
              <div className='flex  flex-wrap gap-2'>
              
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
                          {selectedTimeStart  ? format(selectedTimeStart, "HH:mm") : <span>Horário de abertura</span>}
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
                <Label>Até</Label>
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
                          {selectedTimeEnd ? format(selectedTimeEnd, "HH:mm") : <span>Horário de fechamento</span>}
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
              {(formErrors.selectedTimeStart || formErrors.selectedTimeEnd) && !first && <p className="text-sm text-left text-red-500">Por favor, escolha o horário de funcionamento da quadra.</p>}
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
              {formErrors.slot && !first && <p className="text-sm text-left text-red-500">{formErrors.slot}</p>}
            </div>

            <div className='grid gap-2'>
              <Label>Preço da Reserva</Label>
              <Input 
                type="number"
                min="0"
                max={2000}
                onChange={(e)=> setCourtPrice(e.target.value)}
              />
               {formErrors.courtPrice && !first && <p className="text-sm text-left text-red-500">{formErrors.courtPrice}</p>}
            </div>

            <div className='grid gap-2'>
              <Label>Foto da quadra</Label>
              <Input 
                type="file"
                onChange={handleCourtImageChange}
              />
              {formErrors.courtImage && !first && <p className="text-sm text-left text-red-500">{formErrors.courtImage}</p>}
            </div>

            <div className='grid gap-2'>
              <Label>IPTU de quadra</Label>
              <Input 
                type="file"
                onChange={handleCourtDocumentChange}
              />
                {formErrors.courtDocument && !first && <p className="text-sm text-left text-red-500">{formErrors.courtDocument}</p>}
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

type UF = {
  value: string;
  label: string;
};

const estados: UF[] = [
  { value: "SP", label: "SP" }
];




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

type Cidade = {
  value: string;
  label: string;
};

const cidadesSaoPaulo: Cidade[] = [
  { value: 'sao_paulo', label: 'São Paulo' },
  { value: 'guarulhos', label: 'Guarulhos' },
  { value: 'campinas', label: 'Campinas' },
  { value: 'sao_bernardo_do_campo', label: 'São Bernardo do Campo' },
  { value: 'santo_andre', label: 'Santo André' },
  { value: 'osasco', label: 'Osasco' },
  { value: 'sao_jose_dos_campos', label: 'São José dos Campos' },
  { value: 'sorocaba', label: 'Sorocaba' },
  { value: 'ribeirao_preto', label: 'Ribeirão Preto' },
  { value: 'maua', label: 'Mauá' },
  { value: 'sao_jose_do_rio_preto', label: 'São José do Rio Preto' },
  { value: 'mogi_das_cruzes', label: 'Mogi das Cruzes' },
  { value: 'jundiai', label: 'Jundiaí' },
  { value: 'piracicaba', label: 'Piracicaba' },
  { value: 'carapicuiba', label: 'Carapicuíba' },
  { value: 'bauru', label: 'Bauru' },
  { value: 'itaquaquecetuba', label: 'Itaquaquecetuba' },
  { value: 'sao_vicente', label: 'São Vicente' },
  { value: 'diadema', label: 'Diadema' },
  { value: 'franca', label: 'Franca' },
  { value: 'guaruja', label: 'Guarujá' },
  { value: 'taubate', label: 'Taubaté' },
  { value: 'suzano', label: 'Suzano' },
  { value: 'praia_grande', label: 'Praia Grande' },
  { value: 'limeira', label: 'Limeira' },
  { value: 'americana', label: 'Americana' },
  { value: 'itapecerica_da_serra', label: 'Itapecerica da Serra' },
  { value: 'presidente_prudente', label: 'Presidente Prudente' },
  { value: 'rio_claro', label: 'Rio Claro' },
  { value: 'araraquara', label: 'Araraquara' },
  { value: 'ferraz_de_vasconcelos', label: 'Ferraz de Vasconcelos' },
  { value: 'santa_barbara_doeste', label: 'Santa Bárbara d\'Oeste' },
  { value: 'cotia', label: 'Cotia' },
  { value: 'taboao_da_serra', label: 'Taboão da Serra' },
  { value: 'sumare', label: 'Sumaré' },
  { value: 'olimpia', label: 'Olímpia' },
  { value: 'catanduva', label: 'Catanduva' },
  { value: 'itu', label: 'Itu' },
  { value: 'botucatu', label: 'Botucatu' },
  { value: 'sao_carlos', label: 'São Carlos' },
  { value: 'atibaia', label: 'Atibaia' },
  { value: 'indaiatuba', label: 'Indaiatuba' },
  { value: 'hortolandia', label: 'Hortolândia' },
  { value: 'araras', label: 'Araras' },
  { value: 'itapevi', label: 'Itapevi' },
  { value: 'cubatao', label: 'Cubatão' },
  { value: 'barretos', label: 'Barretos' },
  { value: 'votorantim', label: 'Votorantim' },
  { value: 'paulinia', label: 'Paulínia' },
  { value: 'birigui', label: 'Birigui' },
  { value: 'mongagua', label: 'Mongaguá' },
  { value: 'itapetininga', label: 'Itapetininga' },
  { value: 'aracatuba', label: 'Araçatuba' },
  { value: 'guaratingueta', label: 'Guaratinguetá' },
  { value: 'jacarei', label: 'Jacareí' },
  { value: 'itapolis', label: 'Itápolis' },
  { value: 'penapolis', label: 'Penápolis' },
  { value: 'registro', label: 'Registro' },
  { value: 'ubatuba', label: 'Ubatuba' },
  { value: 'ilhabela', label: 'Ilhabela' },
  { value: 'caraguatatuba', label: 'Caraguatatuba' },
  { value: 'sao_sebastiao', label: 'São Sebastião' },
  { value: 'bertioga', label: 'Bertioga' },
  { value: 'peruibe', label: 'Peruíbe' },
  { value: 'itanhaem', label: 'Itanhaém' },
  { value: 'jaguariuna', label: 'Jaguariúna' },
  { value: 'amparo', label: 'Amparo' },
  { value: 'pedreira', label: 'Pedreira' },
  { value: 'holambra', label: 'Holambra' },
  { value: 'santo_antonio_de_posse', label: 'Santo Antônio de Posse' },
  { value: 'aguas_de_lindoia', label: 'Águas de Lindóia' },
  { value: 'lindoia', label: 'Lindóia' },
  { value: 'socorro', label: 'Socorro' },
  { value: 'serra_negra', label: 'Serra Negra' },
  { value: 'itatiba', label: 'Itatiba' },
  { value: 'braganca_paulista', label: 'Bragança Paulista' },
  { value: 'piracaia', label: 'Piracaia' },
  { value: 'nazaré_paulista', label: 'Nazaré Paulista' },
  { value: 'bom_jesus_dos_perdoes', label: 'Bom Jesus dos Perdões' },
  { value: 'mairipora', label: 'Mairiporã' },
  { value: 'franco_da_rocha', label: 'Franco da Rocha' },
  { value: 'caieiras', label: 'Caieiras' },
  { value: 'francisco_morato', label: 'Francisco Morato' },
  { value: 'embudas_artes', label: 'Embu das Artes' },
  { value: 'varzea_paulista', label: 'Várzea Paulista' },
  { value: 'campo_limpo_paulista', label: 'Campo Limpo Paulista' },
  { value: 'jarinu', label: 'Jarinu' },
  { value: 'louveira', label: 'Louveira' },
  { value: 'vinhedo', label: 'Vinhedo' },
  { value: 'valinhos', label: 'Valinhos' },
  { value: 'cosmopolis', label: 'Cosmópolis' },
  { value: 'artur_nogueira', label: 'Artur Nogueira' },
  { value: 'engenheiro_coelho', label: 'Engenheiro Coelho' },
  { value: 'conchal', label: 'Conchal' },
  { value: 'leme', label: 'Leme' },
  { value: 'capivari', label: 'Capivari' },
  { value: 'rafard', label: 'Rafard' },
  { value: 'elias_fausto', label: 'Elias Fausto' },
  { value: 'monte_mor', label: 'Monte Mor' },
  { value: 'nova_odessa', label: 'Nova Odessa' },
];

export default PublicarQuadraView