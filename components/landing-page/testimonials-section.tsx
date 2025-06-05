
import { Badge } from "@/components/ui/badge"
import { TestimonialCard } from "./testimonial-card";
import { Sparkles } from "lucide-react";


const TestimonialsSection = () => {
    return (
        <section id="testimonials" className="py-24 md:py-32 bg-gradient-to-br from-background via-background to-muted/30">
        <div className="container px-8">
          <div className="mb-16 text-center">
            <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30 font-medium px-4 py-1.5">
              <Sparkles className="mr-1 h-4 w-4" /> Testimonios
            </Badge>
            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Lo que dicen los <span className="bg-gradient-to-r from-primary to-indigo-600  bg-clip-text text-transparent">educadores</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Descubre cómo nuestra plataforma está transformando la experiencia educativa en contextos híbridos
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <TestimonialCard
              name="Sarah Sánchez"
              role="Profesora de Licenciatura en Contabilidad y Finanzas"
              quote="El marco metodológico transformó completamente mi enfoque de la enseñanza híbrida. ¡Mis estudiantes están más comprometidos que nunca!"
              imageSrc="/placeholder.svg?height=80&width=80"
              accentColor="border-l-primary"
            />
            <TestimonialCard
              name="Michael Rodríguez"
              role="Profesor de Ingeniería Mecánica"
              quote="El espacio colaborativo me ahorró horas de trabajo. Poder compartir y recibir feedback de colegas es invaluable."
              imageSrc="/placeholder.svg?height=80&width=80"
              accentColor="border-l-accent"
            />
            <TestimonialCard
              name="Antonio Soto"
              role="Profesor de Licenciatura en Educación Primaria"
              quote="El repositorio de documentos tiene todo lo que necesito en un solo lugar. No más buscar por todo internet recursos de calidad."
              imageSrc="/placeholder.svg?height=80&width=80"
              accentColor="border-l-chart-3"
            />
          </div>
        </div>
      </section>
    );
}

export default TestimonialsSection;
