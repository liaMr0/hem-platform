"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateUserInfo } from '@/app/actions/account';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface UserInfo {
    firstName: string;
    lastName: string;
    email: string;
    designation: string;
    bio: string;
}

interface PersonalDetailsProps {
    userInfo: UserInfo;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ userInfo }) => {
    const { data: session, update } = useSession();
    const router = useRouter();
    
    const [infoState, setInfoState] = useState({
        firstName: userInfo?.firstName || '',
        lastName: userInfo?.lastName || '',
        email: userInfo?.email || '',
        designation: userInfo?.designation || '',
        bio: userInfo?.bio || '', 
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setInfoState(prev => ({
            ...prev, 
            [name]: value
        }));
    };

    const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        
        try {
            await updateUserInfo(userInfo?.email, infoState);
            
            // Actualizar la sesión de NextAuth con los nuevos datos
            await update({
                ...session,
                user: {
                    ...session?.user,
                    name: `${infoState.firstName} ${infoState.lastName}`,
                    firstName: infoState.firstName,
                    lastName: infoState.lastName,
                    designation: infoState.designation,
                    bio: infoState.bio
                }
            });

            // Forzar revalidación de la página
            router.refresh();
            
            // Disparar evento personalizado para que el sidebar se actualice
            window.dispatchEvent(new CustomEvent('userUpdated'));
            
            toast.success("Datos del usuario actualizados correctamente.");
        } catch (error) {
            toast.error(`Error: ${(error as Error).message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900">
            <h5 className="text-lg font-semibold mb-4">Detalles Personales:</h5>
            <form onSubmit={handleUpdate}>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
                    <div>
                        <Label className="mb-2 block">
                            Nombre: <span className="text-red-600">*</span>
                        </Label>
                        <Input
                            type="text"
                            placeholder="Julián"
                            id="firstName"
                            name="firstName"
                            value={infoState.firstName}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <Label className="mb-2 block">
                            Apellido: <span className="text-red-600">*</span>
                        </Label>
                        <Input
                            type="text"
                            placeholder="Gómez"
                            id="lastName"
                            name="lastName"
                            value={infoState.lastName}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <Label className="mb-2 block">
                            Email: <span className="text-red-600">*</span>
                        </Label>
                        <Input
                            type="email"
                            placeholder="Email"
                            id="email"
                            name="email"
                            value={infoState.email}
                            disabled
                        />
                    </div>
                    <div>
                        <Label className="mb-2 block">Ocupación:</Label>
                        <Input
                            id="designation"
                            name="designation"
                            value={infoState.designation}
                            type="text"
                            onChange={handleChange}
                            placeholder="Ing. Informático"
                            disabled={isLoading}
                        />
                    </div>
                </div>
                {/*end grid*/}
                <div className="grid grid-cols-1">
                    <div className="mt-5">
                        <Label className="mb-2 block">Descripción:</Label>
                        <Textarea
                            id="bio"
                            name="bio"
                            value={infoState.bio}
                            onChange={handleChange}
                            placeholder="Cuéntanos algo sobre ti"
                            disabled={isLoading}
                        />
                    </div>
                </div>
                {/*end row*/}
                <Button 
                    type="submit" 
                    className="mt-5"
                    disabled={isLoading}
                >
                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
            </form>
            {/*end form*/}
        </div>
    );
};

export default PersonalDetails;