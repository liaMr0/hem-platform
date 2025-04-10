import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Sparkles } from 'lucide-react';
import { Badge } from '../ui/badge';

const FaqSection = () => {
    return (
        <section className="bg-muted/30 py-24 md:py-32 relative overflow-hidden">
        <div className="absolute -bottom-40 left-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="container relative z-10 px-8">
          <div className="mb-16 text-center">
            <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30 font-medium px-4 py-1.5">
              <Sparkles className="mr-1 h-4 w-4" /> Preguntas Frecuentes
            </Badge>
            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              <span className="bg-gradient-to-r from-primary to-indigo-600  bg-clip-text text-transparent">¿Tienes alguna duda?</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Encuentra respuestas a las preguntas más comunes sobre nuestra plataforma
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-border">
                <AccordionTrigger className="text-left text-lg font-medium py-6">
                  ¿Cómo me registro en la plataforma?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base pb-6">
                  Haz clic en el botón "Regístrate" en la esquina superior derecha y completa el formulario con tus
                  datos. El proceso toma menos de 2 minutos y tendrás acceso inmediato a todos nuestros recursos digitales.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-b border-border">
                <AccordionTrigger className="text-left text-lg font-medium py-6">
                  ¿Hay algún costo por usar la plataforma?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base pb-6">
                  No, nuestro portal educativo es completamente gratuito para todos los educadores. Creemos en el acceso libre a recursos 
                  de calidad para la educación híbrida.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-b border-border">
                <AccordionTrigger className="text-left text-lg font-medium py-6">
                  ¿Qué tipo de recursos encontraré?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base pb-6">
                  Tendrás acceso a guías metodológicas, plantillas de clases, investigaciones actualizadas, herramientas
                  digitales recomendadas y un espacio para compartir experiencias con otros docentes especializados en educación híbrida.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="border-b border-border">
                <AccordionTrigger className="text-left text-lg font-medium py-6">
                  ¿Puedo contribuir con mis propios recursos?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base pb-6">
                  ¡Absolutamente! Valoramos las contribuciones de nuestra comunidad. Una vez registrado, podrás
                  compartir tus materiales y experiencias con otros educadores en nuestra biblioteca colaborativa.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    );
}

export default FaqSection;
