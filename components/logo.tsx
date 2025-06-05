import Image from 'next/image';
import React from 'react';
import logo from "@/public/assets/images/forward.png"
import { cn } from '@/lib/utils';
import { Brain} from 'lucide-react';
import Link from 'next/link';

const Logo = () => {
    return (
        <div className='ml-2'>
            <Link href="/" >
                <Image src={logo} color='blue' alt="logo" width={40} height={40} />
            </Link>

        </div>
    );
};

export default Logo;