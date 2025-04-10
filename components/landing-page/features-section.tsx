import React from 'react';
import { FeatureCard } from './feature-card';
import { BookOpen, Lightbulb, Sparkles, Users, Clipboard } from 'lucide-react';
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
              Todo lo que necesitas para destacar en la <span className="bg-gradient-to-r from-primary to-indigo-600  bg-clip-text text-transparent">enseñanza híbrida</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Nuestra plataforma proporciona herramientas completas para apoyar tu jornada docente en entornos educativos que combinan lo mejor de lo presencial y lo virtual.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
             <FeatureCard
              icon={<BookOpen className="h-10 w-10" />}
              title="Marco Metodológico"
              description="Un enfoque estructurado para la enseñanza híbrida con estrategias comprobadas y mejores prácticas."
              color="bg-purple-600" // Color primario violeta
            />
            <FeatureCard
              icon={<Clipboard className="h-10 w-10" />}
              title="Repositorio de Documentos"
              description="Colección curada de recursos, artículos de investigación y guías prácticas sobre educación híbrida."
              color="bg-fuchsia-500" // Magenta complementario
            />
            <FeatureCard
              icon={<Users className="h-10 w-10" />}
              title="Espacio Colaborativo"
              description="Conéctate con colegas, comparte experiencias y obtén respuestas a tus desafíos docentes."
              color="bg-blue-500" // Azul coherente
            />
            <FeatureCard
              icon={<Lightbulb className="h-10 w-10" />}
              title="Crecimiento Profesional"
              description="Oportunidades de aprendizaje continuo para mejorar tus habilidades y efectividad docente."
              color="bg-cyan-500" // Turquesa complementario
            />
          </div>
        </div>
      </section>
    );
}

export default FeaturesSection;
