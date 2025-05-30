"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Menu from "./account-menu";
import AvatarUpload from "./AvatarUpload";

const AccountSidebar = () => {
  const { data: session } = useSession();

   
  return (
    <div className="lg:w-1/4 md:px-3">
      <div className="relative">
        <div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900">
          <div className="profile-pic text-center mb-5">
            <div>
              <div className="flex justify-center mb-4">
                <AvatarUpload 
                  size={112}
                  showUploadIcon={true}
                  clickable={true}
                />
              </div>
              <div className="mt-4">
                <h5 className="text-lg font-semibold">{`${session?.user.name}`}</h5>
                <p className="text-slate-400">{session?.user.email}</p>
                <p className="text-slate-700 text-sm font-bold">Rol: {session?.user.role}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-700">
            <Menu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSidebar;