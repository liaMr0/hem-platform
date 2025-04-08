'use server'
import { signIn } from "@/auth" 

export async function credentialLogin(formData:any){
    console.log(formData);
    
    try {
        const response = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect:false
        })
        return response;
    } catch (error) {
        console.error(error);
        ;
    }
}