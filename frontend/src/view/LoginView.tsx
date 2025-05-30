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

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [, setIsSubmitting] = useState(false);
    const { anterior } = useParams();
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

    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (validateForm()) {
        try {
            console.log("valido")

            const response = await fetch('https://backend-projeto-v2-bhbmfzeahubeg6a8.brazilsouth-01.azurewebsites.net/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, senha: password }),
            });

            if (response.ok) {
                const data = await response.json();
  
                const authToken = data.token;
                Cookies.set('authToken', authToken, { expires: 7 }); // Set cookie to expire in 7 days
                console.log('Login successful, token saved:', authToken);
                
                if(anterior)
                    navigate(`/${anterior}`);
                else
                    navigate(`/`);
            } else {
                const errorData = await response.json();
                setFormErrors({ general: errorData.message || 'Credenciais inválidas.' });
                console.error('Login failed:', errorData);
            }
            
        } catch (error) {
            setFormErrors({ general: 'Erro ao conectar ao servidor. Tente novamente mais tarde.' });
            console.error('Network error during login:', error);
        }
        }
        console.log(formErrors)
        setIsSubmitting(false);
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

                    <Button  type='submit' variant={'default'}>Login</Button>
                </Card>
            </form>
        </main>
        </>
    )
}

export default LoginView