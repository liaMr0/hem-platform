"use client"
import React from 'react';
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const  EnrollCourse =  ({ asLink,courseId }) => {
  const router = useRouter();
  // const session = await auth();
    const formAction = async(data) => {
      router.push(`/enroll-success?courseId=${courseId}`)
    }

    return (
 <>
    <form action={formAction} >
        <input type="hidden" name='courseId' value={courseId} />
        { (
             <Button
             type="submit"
             variant="ghost"
             className="text-xs text-sky-700 h-7 gap-1"
           >
             Enroll
             <ArrowRight className="w-3" />
           </Button> 
        )}

    </form>

    
 </>
    );
};

export default EnrollCourse;