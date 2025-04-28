"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import Link from "next/link";
import { changePassword } from '@/app/actions/account';
import { toast } from 'sonner';

const ChangePassword = ({email}:any) => {
    //console.log(email);

    const [passwordState, setPasswordState] = useState({
        "oldPassword" : "",
        "newPassword" : "", 
    });

    const handleChange = (event:any) => {
        const key = event.target.name;
        const value = event.target.value;
        setPasswordState({
            ...passwordState, [key]: value
        });
    }

    async function doPasswordChange(event:any) {
        event.preventDefault();

        try {
            await changePassword(email,passwordState?.oldPassword, passwordState?.newPassword);
            toast.success("La contraseña se cambió correctamente.")
        } catch (error) {
            toast.error(`Error: ${(error as Error).message}`);
        }
    }



    return (
        <div>
            <h5 className="text-lg font-semibold mb-4">
                Cambiar contraseña:
            </h5>
            <form onSubmit={doPasswordChange}>
                <div className="grid grid-cols-1 gap-5">
                    <div>
                        <Label className="mb-2 block">Antigua contraseña:</Label>
                        <Input
                            type="password"
                            id="oldPassword"
                            name="oldPassword"
                            onChange={handleChange}
                            placeholder="*****"
                            required
                        />
                    </div>
                    <div>
                        <Label className="mb-2 block">Nueva contraseña:</Label>
                        <Input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            onChange={handleChange}
                            placeholder="*****"
                            required
                        />
                    </div>
                    <div>
                        <Label className="mb-2 block">
                            Volver a escribir nueva contraseña:
                        </Label>
                        <Input
                            type="password"
                            placeholder="*****"
                            required
                        />
                    </div>
                </div>
                {/*end grid*/}
                <Button className="mt-5" type="submit">
                    Guardar contraseña
                </Button>
            </form>
        </div>
    );
};

export default ChangePassword;