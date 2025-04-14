"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import Link from "next/link";
import { updateUserInfo } from '@/app/actions/account';
import { toast } from 'sonner';

const PersonalDetails = ({userInfo}:any) => {
    // console.log(userInfo);
    const [infoState, setInfoState] = useState({
        "firstName" : userInfo.firstName,
        "lastName" : userInfo.lastName,
        "email" : userInfo.email,
        "designation" : userInfo.designation,
        "bio" : userInfo.bio, 
    });

    const handleChange = (event:any) => {
        const field = event.target.name;
        const value = event.target.value;
        setInfoState({
            ...infoState, [field]: value
        });
    }
    /// console.log(infoState);

    const handleUpdate = async (event:any) => {
        event.preventDefault();
        try {
            await updateUserInfo(userInfo?.email,infoState);
            toast.success("User details updated successfully");
        } catch (error) {
            toast.error(`Error: ${(error as Error).message}`);
        }
    }



    return (
<div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900">
    <h5 className="text-lg font-semibold mb-4">Detalles Personales:</h5>
    <form onSubmit={handleUpdate} >
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
                    value={infoState?.firstName}
                    onChange={handleChange}
                    required
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
                    value={infoState?.lastName}
                    onChange={handleChange}
                    required
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
                    value={infoState?.email}
                    disabled
                />
            </div>
            <div>
                <Label className="mb-2 block">Ocupación:</Label>
                <Input
                    id="designation"
                    name="designation"
                    value={infoState?.designation}
                    type="text"
                    onChange={handleChange}
                    placeholder="Ing. Informático"
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
                    value={infoState?.bio}
                    onChange={handleChange}
                    placeholder="Cuéntanos algo sobre ti"
                />
            </div>
        </div>
        {/*end row*/}
        <Button className="mt-5" asChild>
            <input type="submit" name="send" value="Guardar Cambios" />
        </Button>
    </form>
    {/*end form*/}
</div>
    );
};

export default PersonalDetails;