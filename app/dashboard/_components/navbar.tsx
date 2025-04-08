"use client";

import { MobileSidebar } from "./mobile-sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface UserData {
  profilePicture?: string;
  // Agrega otros campos que devuelva tu API
  email?: string;
  name?: string;
}

export const Navbar = () => {
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState<UserData | null>(null);

  useEffect(() => {  
    async function fetchMe() {
      try {
        const response = await fetch("/api/me");
        const data: UserData = await response.json();
        setLoggedInUser(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchMe();
  }, []);

  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <MobileSidebar />
      <div className="flex items-center justify-end  w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer">
              <Avatar>
                <AvatarImage
                  src={loggedInUser?.profilePicture}
                  alt="User avatar"
                />
                <AvatarFallback>
                  {loggedInUser?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-4">
          <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/account')}>
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
            Logout
          </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
