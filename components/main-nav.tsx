'use client' 
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Logo from './logo';
import { cn } from '@/lib/utils';

import { X } from 'lucide-react';
import { Button, buttonVariants } from './ui/button';
import { Menu } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'; 
import MobileNav from './mobile-nav';
import { useSession , signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useUserAvatar } from '@/contexts/UserAvatarContext';

const MainNav = ({items,children}:any) => {
    const {data:session, status} = useSession();
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const router = useRouter();
    const [loggedInUser, setLoggedInUser] = useState(null);
    const { avatarUrl } = useUserAvatar();

    useEffect(() => { 
        async function fetchMe() {
            if (session?.user?.email) {
                try {
                    const response = await fetch("/api/me");
                    const data = await response.json();
                    setLoggedInUser(data);
                } catch (error) {
                    console.log(error);
                    setLoggedInUser(null);
                }
            } else {
                setLoggedInUser(null);
            }
        }
        fetchMe();
    },[session]);

    return (
<>
<div className='flex pl-3.5 gap-6 lg:gap-10'>
    
        <Logo/>
    
    {
        items?.length ? (
            <nav className='hidden gap-6 lg:flex'>
                {
                   items?.map((item,index) => (
                    <Link
                    key={index}
                    href={item.disable ? "#" : item.href}
                    className={cn("flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm ")}
                    >
                    {item.title}
                    </Link>
                   )) 
                }
            </nav> 
        ) : null
    }

    {showMobileMenu && items && (
        <MobileNav items={items}>{children}</MobileNav>
    ) }
     
</div>

    <nav className='flex items-center gap-3 pr-8'>
        
        {
            !session && status !== "loading" && (
                <div className='items-center gap-3 hidden lg:flex'>
                <Link href='/login' className={cn(buttonVariants({size: "sm"}), "px-4")}>
                    Iniciar sesión
                </Link>
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" onClick={() => router.push('/register/student')}>Registrarse</Button>
        </DropdownMenuTrigger>
      
    </DropdownMenu> 
            </div> 
            )
        }
        
       

    {session && (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <div className='cursor-pointer'>
    <Avatar>
    <AvatarImage src={avatarUrl} alt="Avatar del usuario" />
    <AvatarFallback>
        {loggedInUser?.name ? loggedInUser.name.charAt(0).toUpperCase() : 'U'}
    </AvatarFallback> 
    </Avatar>
            </div> 
     </DropdownMenuTrigger>

     <DropdownMenuContent align="end" className="w-56 mt-4">
        <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href='/account'>Mi Perfil</Link> 
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href='/courses'>Cursos Disponibles</Link> 
        </DropdownMenuItem>

        {(loggedInUser?.role === "instructor" || loggedInUser?.role === "admin") && (
        <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href='/dashboard'> <strong>Panel de Gestión</strong> </Link> 
        </DropdownMenuItem>
        )}

        <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href='/account/enrolled-courses'>Mis Cursos</Link> 
        </DropdownMenuItem> 

        {loggedInUser?.role === "instructor" && (
        <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href='/instructor/courses'>Gestionar Cursos</Link> 
        </DropdownMenuItem>
        )}

        <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href='' onClick={(e) => {e.preventDefault(); signOut(); }} >Cerrar Sesión</Link> 
        </DropdownMenuItem> 
    </DropdownMenuContent>   

    </DropdownMenu>
    )}
    
    <button className='flex items-center space-x-2 lg:hidden' onClick={() => setShowMobileMenu(!showMobileMenu)}>
        {showMobileMenu ? <X/> : <Menu/> } 
    </button>

    </nav> 

</>

    );
};

export default MainNav;