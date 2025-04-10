import React from 'react';
import Logo from './logo';
import Link from 'next/link';

const SiteFooter = () => {
    return (
        <footer className="w-full border-t bg-background py-6 md:py-12">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Logo/>
            </div>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Términos
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacidad
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contacto
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MEH Digital. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    );
};

export default SiteFooter;