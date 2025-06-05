import React from 'react';
import { FeatureCard } from './feature-card';
import { BookOpen, Users, Monitor, ClipboardCheck, Sparkles, PresentationIcon, MessageSquare } from 'lucide-react';
import { Badge } from '../ui/badge';

const FeaturesSection = () => {
    return (
        <section id="features" className="py-24 md:py-32">
        <div className="container px-8">
          <div className="mb-16 text-center">
            <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30 font-medium px-4 py-1.5">
              <Sparkles className="mr-1 h-4 w-4" /> Características
            </Badge>
            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Módulos integrados para la <span className="bg-gradient-to-r from-primary to-indigo-600  bg-clip-text text-transparent">formación docente híbrida</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Herramientas especializadas para superar las limitaciones tecnológicas y metodológicas en la educación superior cubana, 
              facilitando la implementación del Modelo Educativo Híbrido.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
             <FeatureCard
              icon={<BookOpen className="h-10 w-10" />}
              title="Gestión de Cursos"
              description="Sistema completo para crear, organizar y administrar cursos de formación continua en metodología híbrida."
              color="bg-purple-600"
            />
            <FeatureCard
              icon={<Monitor className="h-10 w-10" />}
              title="Repositorio Digital"
              description="Biblioteca centralizada de recursos metodológicos, investigaciones y materiales para educación híbrida."
              color="bg-cyan-500"
            />
            <FeatureCard
              icon={<MessageSquare className="h-10 w-10" />}
              title="Foros Colaborativos"
              description="Espacios de intercambio y colaboración entre docentes de UCf, UNISS y UCI para compartir experiencias MEH."
              color="bg-green-500"
            />
            <FeatureCard
              icon={<Users className="h-10 w-10" />}
              title="Wikis Educativas"
              description="Construcción colaborativa de conocimiento sobre metodologías híbridas y mejores prácticas docentes."
              color="bg-orange-500"
            />
          </div>
        </div>
      </section>
    );
}

export default FeaturesSection;