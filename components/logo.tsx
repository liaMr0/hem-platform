import Image from 'next/image';
import React from 'react';
import logo from "@/public/assets/images/university.png"
import { cn } from '@/lib/utils';
import { Brain} from 'lucide-react';
import Link from 'next/link';

const Logo = () => {
    return (
        <div>
            <Link href="/" className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-primary" />
                <span className="inline-block font-bold">MEH</span>
            </Link>

        </div>
    );
};

export default Logo;