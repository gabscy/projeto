import '../App.css'
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Separator } from '@/components/ui/separator';


function LoginView() {

    //variaveis 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const { anterior } = useParams();
    const [invalidLogin, setInvalidLogin] = useState<boolean>(false);
    const navigate = useNavigate();

    //para validar o form
    const validateForm = () => {
        const errors: { [key: string]: string } = {};
        let isValid = true;

        if (!email.trim()) {
            errors.email = "Por favor, insira seu e-mail.";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Por favor, insira um e-mail válido.";
            isValid = false;
        }

        if (!password.trim()) {
        errors.password = "Por favor, insira sua senha.";
        isValid = false;
        } 

        setFormErrors(errors);
        return isValid;
    };


    //tenta enviar o form quando botao é apertado
    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        if (validateForm()) {
        try {

            //se form for válido, envia para api

            const response = await fetch('https://backend-projeto-v2-bhbmfzeahubeg6a8.brazilsouth-01.azurewebsites.net/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, senha: password }),
            });

            if (response.ok) {
                const data = await response.json();
                
                //cria um cookie para armazenar o token
                const authToken = data.token;
                Cookies.set('authToken', authToken, { expires: 7 }); 
                console.log('Login bem succedido, token:', authToken);
                
                //navega de volta ao site
                if(anterior)
                    navigate(`/${anterior}`);
                else
                    navigate(`/`);
            } else {
                //login invalido
                const errorData = await response.json();
                setFormErrors({ general: errorData.message || 'Credenciais inválidas.' });
                setInvalidLogin(true)
                console.error('Falha no lign:', errorData);
            }
            
        } catch (error) {
            //erro no login
            setFormErrors({ general: 'Erro ao conectar ao servidor. Tente novamente mais tarde.' });
            console.error('Erro durante login:', error);
        }
        }
        console.log(formErrors)
    };


    return (
        < > 
        <main > 
            <form className=' h-screen my-auto max-w-2xl h-full mx-auto py-8 flex justify-center items-center' action="" onSubmit={(e) => handleSubmitForm(e)}>
                <Card className='w-full p-6 flex flex-col gap-8'>
                    <div className='flex gap-6 flex-col'>
                        <Label className='text-2xl font-bold'>Login</Label>
                        <Separator/>
                    </div>
                

                    <div className='flex flex-col gap-4'>
                        <Label className='text-lg '>Email {formErrors.email && <span className='text-red-600'>*</span>}</Label>
                        <Input placeholder='exemplo@gmail.com'  onChange={(e) => setEmail(e.target.value)}></Input>
                        {formErrors.email && <p className='text-red-500 text-start'>{formErrors.email}</p>}
                    </div>
                  

                      <div className='flex flex-col gap-4'>
                        <Label className='text-lg '>Senha {formErrors.password && <span className='text-red-600'>*</span>}</Label>
                        <Input type='password' onChange={(e) => setPassword(e.target.value)} placeholder='******'></Input>
                     
                    </div>

                    {invalidLogin && <p className='text-red-500 text-start'>Login inválido</p> }

                    <Button  type='submit' variant={'default'}>Login</Button>
                </Card>
            </form>
        </main>
        </>
    )
}

export default LoginView