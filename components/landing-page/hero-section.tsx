'use cli'
import { Badge } from '../ui/badge';
import { ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const HeroSection = () => {
    return (
        <section className="px-8 relative overflow-hidden bg-gradient-to-b from-background to-violet-100 dark:to-violet-950/30 py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        {/* Formas decorativas */}
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl"></div>
        <div className="absolute -bottom-32 right-16 h-80 w-80 rounded-full bg-primary/20 blur-3xl"></div>
        
        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30 font-medium px-4 py-1.5">
              <Sparkles className="mr-1 h-4 w-4" /> Plataforma Educativa Digital
            </Badge>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
              Potenciando a los educadores con <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">Recursos Digitales</span>
            </h1>
            <p className="mb-10 text-lg text-muted-foreground md:text-xl">
              Accede a nuestro marco metodológico completo, a los recursos para enseñanza híbrida y a la comunidad
              colaborativa diseñada para mejorar tu práctica docente en entornos educativos híbridos.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register/student" passHref>
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base font-medium px-8 py-6"
                >
                  Únete Gratis
                </Button>
              </Link>
              <Link href="#resources" passHref>
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base font-medium px-8 py-6">
                  Saber Más <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
      </section>
    );
}

export default HeroSection;
