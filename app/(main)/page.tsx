import Image from "next/image"
import { Clipboard, Users, TrendingUp, Shield, Mic, Scale, BookOpen, Lightbulb, Zap, Brain, ChevronRight, Sparkles, Monitor, Globe, PenTool } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function Home() {
  return (
    <div className="min-h-screen ">
      {/* Hero Section con gradiente mejorado */}
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
              <Button size="lg" className="w-full sm:w-auto text-base font-medium px-8 py-6">
                Únete Gratis
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base font-medium px-8 py-6">
                Saber Más <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Features Section con nuevos colores */}
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

      {/* Resources Section - Rediseñado */}
      <section id="resources" className="bg-gradient-to-br from-muted/50 via-muted/30 to-background py-24 md:py-32 relative overflow-hidden">
        <div className="absolute -top-40 right-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="container relative z-10 px-8">
          <div className="mb-16 text-center">
            <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30 font-medium px-4 py-1.5">
              <Sparkles className="mr-1 h-4 w-4" /> Recursos
            </Badge>
            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              <span className="bg-gradient-to-r from-primary to-indigo-600  bg-clip-text text-transparent">A qué tendrás acceso</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Explora nuestra biblioteca de recursos diseñados para potenciar tu enseñanza híbrida
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center">
              <TabsList className="mb-8 p-1 bg-muted">
                <TabsTrigger value="all" className="px-6 py-2.5">Todos</TabsTrigger>
                <TabsTrigger value="methodology" className="px-6 py-2.5">Metodología</TabsTrigger>
                <TabsTrigger value="technology" className="px-6 py-2.5">Tecnología</TabsTrigger>
                <TabsTrigger value="cases" className="px-6 py-2.5">Casos de Estudio</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <ResourceCard
                  icon={<Shield className="h-6 w-6" />}
                  title="Marco de Enseñanza Híbrida"
                  description="Nuestra metodología completa para la instrucción híbrida efectiva, incluyendo plantillas de planificación de clases y estrategias de evaluación."
                  category="Metodología"
                  color="bg-primary"
                />
                <ResourceCard
                  icon={<Mic className="h-6 w-6" />}
                  title="Guías de Integración Tecnológica"
                  description="Tutoriales paso a paso para incorporar herramientas digitales en tu práctica docente de manera efectiva."
                  category="Tecnología"
                  color="bg-accent"
                />
                <ResourceCard
                  icon={<Scale className="h-6 w-6" />}
                  title="Casos de Estudio & Ejemplos"
                  description="Ejemplos del mundo real de implementaciones híbridas exitosas en diferentes materias y niveles escolares."
                  category="Casos de Estudio"
                  color="bg-chart-3"
                />
                <ResourceCard
                  icon={<Brain className="h-6 w-6" />}
                  title="Estrategias de Aprendizaje Activo"
                  description="Técnicas innovadoras para mantener a los estudiantes comprometidos tanto en entornos presenciales como virtuales."
                  category="Metodología"
                  color="bg-primary"
                />
                <ResourceCard
                  icon={<Zap className="h-6 w-6" />}
                  title="Herramientas de Evaluación Digital"
                  description="Plataformas y métodos para evaluar el aprendizaje de los estudiantes en entornos híbridos y a distancia."
                  category="Tecnología"
                  color="bg-accent"
                />
                <ResourceCard
                  icon={<TrendingUp className="h-6 w-6" />}
                  title="Análisis de Resultados Académicos"
                  description="Estudios comparativos sobre el impacto de diferentes enfoques de enseñanza híbrida en el rendimiento estudiantil."
                  category="Casos de Estudio"
                  color="bg-chart-3"
                />
              </div>
            </TabsContent>

            {/* Manteniendo estructura similar para otros tabs */}
            <TabsContent value="methodology">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <ResourceCard
                  icon={<Shield className="h-6 w-6" />}
                  title="Marco de Enseñanza Híbrida"
                  description="Nuestra metodología completa para la instrucción híbrida efectiva, incluyendo plantillas de planificación de clases y estrategias de evaluación."
                  category="Metodología"
                  color="bg-primary"
                />
                <ResourceCard
                  icon={<Brain className="h-6 w-6" />}
                  title="Estrategias de Aprendizaje Activo"
                  description="Técnicas innovadoras para mantener a los estudiantes comprometidos tanto en entornos presenciales como virtuales."
                  category="Metodología"
                  color="bg-primary"
                />
              </div>
            </TabsContent>

            <TabsContent value="technology">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <ResourceCard
                  icon={<Mic className="h-6 w-6" />}
                  title="Guías de Integración Tecnológica"
                  description="Tutoriales paso a paso para incorporar herramientas digitales en tu práctica docente de manera efectiva."
                  category="Tecnología"
                  color="bg-accent"
                />
                <ResourceCard
                  icon={<Zap className="h-6 w-6" />}
                  title="Herramientas de Evaluación Digital"
                  description="Plataformas y métodos para evaluar el aprendizaje de los estudiantes en entornos híbridos y a distancia."
                  category="Tecnología"
                  color="bg-accent"
                />
              </div>
            </TabsContent>

            <TabsContent value="cases">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <ResourceCard
                  icon={<Scale className="h-6 w-6" />}
                  title="Casos de Estudio & Ejemplos"
                  description="Ejemplos del mundo real de implementaciones híbridas exitosas en diferentes materias y niveles escolares."
                  category="Casos de Estudio"
                  color="bg-chart-3"
                />
                <ResourceCard
                  icon={<TrendingUp className="h-6 w-6" />}
                  title="Análisis de Resultados Académicos"
                  description="Estudios comparativos sobre el impacto de diferentes enfoques de enseñanza híbrida en el rendimiento estudiantil."
                  category="Casos de Estudio"
                  color="bg-chart-3"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      

      {/* Testimonials Section rediseñado */}
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
              name="David Soto"
              role="Profesor de Licenciatura en Educación Primaria"
              quote="El repositorio de documentos tiene todo lo que necesito en un solo lugar. No más buscar por todo internet recursos de calidad."
              imageSrc="/placeholder.svg?height=80&width=80"
              accentColor="border-l-chart-3"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section rediseñado */}
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

    </div>
  )
}

function FeatureCard({ icon, title, description, color }) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-background p-8 shadow-md transition-all hover:shadow-lg">
      <div
        className={`absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 transform rounded-full ${color} opacity-10 blur-2xl transition-all group-hover:opacity-20`}
      ></div>
      <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-xl ${color} text-white`}>{icon}</div>
      <h3 className="mb-3 text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function ResourceCard({ icon, title, description, category }) {
  return (
    <Card className="group h-full overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="mb-2">
          <Badge variant="outline" className="bg-primary/5 text-primary">
            {category}
          </Badge>
        </div>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
        <div className="mt-4 flex items-center text-sm font-medium text-primary">
          <span>Explorar recurso</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
          >
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}

function TestimonialCard({ name, role, quote, imageSrc }) {
  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-full">
            <Image src={imageSrc || "/placeholder.svg"} alt={name} fill className="object-cover" />
          </div>
          <div>
            <h3 className="text-lg font-bold">{name}</h3>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
        <div className="relative">
          <svg
            className="absolute -left-2 -top-2 h-8 w-8 text-primary/20"
            fill="currentColor"
            viewBox="0 0 32 32"
            aria-hidden="true"
          >
            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
          </svg>
          <p className="relative text-lg text-muted-foreground">"{quote}"</p>
        </div>
      </CardContent>
    </Card>
  )
}
