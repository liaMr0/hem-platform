
import {  Brain, Mic, Scale, Shield, Sparkles, TrendingUp, Zap } from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ResourceCard } from "./resource-card";
const ResourcesSection = () => {
    return (
        <section id="resources" className="px-8 bg-gradient-to-br from-muted/50 via-muted/30 to-background py-24 md:py-32 relative overflow-hidden">
        <div className="absolute -top-40 right-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="container relative z-10 ">
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
            <div className="flex justify-center px-8">
              <TabsList className="mb-8 p-1 bg-muted ">
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
    );
}

export default ResourcesSection;
