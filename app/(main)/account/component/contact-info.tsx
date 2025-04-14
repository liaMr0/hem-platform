import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import Link from "next/link";

const ContactInfo = () => {
    return (
        <div>
    <h5 className="text-lg font-semibold mb-4">Información de contacto:</h5>
    <form>
        <div className="grid grid-cols-1 gap-5">
            <div>
                <Label className="mb-2 block">No. Teléfono</Label>
                <Input
                    name="number"
                    id="number"
                    type="number"
                    placeholder="55678981"
                />
            </div>
            <div>
                <Label className="mb-2 block">Sitio web:</Label>
                <Input
                    name="url"
                    id="url"
                    type="url"
                    placeholder="Url :"
                />
            </div>
        </div>
        {/*end grid*/}
        <Button className="mt-5" type="submit">
            Agregar
        </Button>
    </form>
</div>
    );
};

export default ContactInfo;