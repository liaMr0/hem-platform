import {  Brain, Mic, Scale, Shield, Sparkles, TrendingUp, Zap, BookOpen, Users, GraduationCap } from "lucide-react"

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
              <Sparkles className="mr-1 h-4 w-4" /> Recursos MEH
            </Badge>
            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              <span className="bg-gradient-to-r from-primary to-indigo-600  bg-clip-text text-transparent">Recursos para la Formación Continua</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Contenidos especializados basados en la investigación realizada en UCf, UNISS y UCI para implementar 
              exitosamente el Modelo Educativo Híbrido en la educación superior cubana
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center px-8">
              <TabsList className="mb-8 p-1 bg-muted ">
                <TabsTrigger value="all" className="px-6 py-2.5">Todos</TabsTrigger>
                <TabsTrigger value="methodology" className="px-6 py-2.5">Metodología MEH</TabsTrigger>
                <TabsTrigger value="technology" className="px-6 py-2.5">Herramientas Digitales</TabsTrigger>
                <TabsTrigger value="research" className="px-6 py-2.5">Investigación</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <ResourceCard
                  icon={<GraduationCap className="h-6 w-6" />}
                  title="Marco Metodológico MEH"
                  description="Metodología completa para la implementación del Modelo Educativo Híbrido en universidades cubanas, con estrategias pedagógicas validadas."
                  category="Metodología MEH"
                  color="bg-primary"
                />
                <ResourceCard
                  icon={<Zap className="h-6 w-6" />}
                  title="Herramientas de Comunicación"
                  description="Guías para integrar plataformas de comunicación sincrónica y asincrónica en el ecosistema educativo híbrido."
                  category="Herramientas Digitales"
                  color="bg-accent"
                />
                <ResourceCard
                  icon={<Scale className="h-6 w-6" />}
                  title="Estudios de Caso UCf-UNISS-UCI"
                  description="Casos reales de implementación MEH en las tres universidades piloto, con resultados y lecciones aprendidas."
                  category="Investigación"
                  color="bg-chart-3"
                />
                <ResourceCard
                  icon={<Brain className="h-6 w-6" />}
                  title="Estrategias Pedagógicas Híbridas"
                  description="Técnicas innovadoras para combinar efectivamente modalidades presenciales y virtuales en educación superior."
                  category="Metodología MEH"
                  color="bg-primary"
                />
                <ResourceCard
                  icon={<BookOpen className="h-6 w-6" />}
                  title="Repositorio de Recursos Educativos"
                  description="Biblioteca digital con materiales didácticos, plantillas y recursos especializados para docentes universitarios."
                  category="Herramientas Digitales"
                  color="bg-accent"
                />
                <ResourceCard
                  icon={<TrendingUp className="h-6 w-6" />}
                  title="Evaluación del Impacto MEH"
                  description="Instrumentos y metodologías para medir la efectividad de la implementación del modelo híbrido en el contexto cubano."
                  category="Investigación"
                  color="bg-chart-3"
                />
              </div>
            </TabsContent>

            <TabsContent value="methodology">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <ResourceCard
                  icon={<GraduationCap className="h-6 w-6" />}
                  title="Marco Metodológico MEH"
                  description="Metodología completa para la implementación del Modelo Educativo Híbrido en universidades cubanas, con estrategias pedagógicas validadas."
                  category="Metodología MEH"
                  color="bg-primary"
                />
                <ResourceCard
                  icon={<Brain className="h-6 w-6" />}
                  title="Estrategias Pedagógicas Híbridas"
                  description="Técnicas innovadoras para combinar efectivamente modalidades presenciales y virtuales en educación superior."
                  category="Metodología MEH"
                  color="bg-primary"
                />
                <ResourceCard
                  icon={<Users className="h-6 w-6" />}
                  title="Formación Docente Continua"
                  description="Programas estructurados para el desarrollo profesional continuo de docentes universitarios en metodologías híbridas."
                  category="Metodología MEH"
                  color="bg-primary"
                />
              </div>
            </TabsContent>

            <TabsContent value="technology">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <ResourceCard
                  icon={<Zap className="h-6 w-6" />}
                  title="Herramientas de Comunicación"
                  description="Guías para integrar plataformas de comunicación sincrónica y asincrónica en el ecosistema educativo híbrido."
                  category="Herramientas Digitales"
                  color="bg-accent"
                />
                <ResourceCard
                  icon={<BookOpen className="h-6 w-6" />}
                  title="Repositorio de Recursos Educativos"
                  description="Biblioteca digital con materiales didácticos, plantillas y recursos especializados para docentes universitarios."
                  category="Herramientas Digitales"
                  color="bg-accent"
                />
                <ResourceCard
                  icon={<Mic className="h-6 w-6" />}
                  title="Plataformas Colaborativas"
                  description="Configuración y uso de foros, wikis y espacios colaborativos para la construcción colectiva de conocimiento."
                  category="Herramientas Digitales"
                  color="bg-accent"
                />
              </div>
            </TabsContent>

            <TabsContent value="research">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <ResourceCard
                  icon={<Scale className="h-6 w-6" />}
                  title="Estudios de Caso UCf-UNISS-UCI"
                  description="Casos reales de implementación MEH en las tres universidades piloto, con resultados y lecciones aprendidas."
                  category="Investigación"
                  color="bg-chart-3"
                />
                <ResourceCard
                  icon={<TrendingUp className="h-6 w-6" />}
                  title="Evaluación del Impacto MEH"
                  description="Instrumentos y metodologías para medir la efectividad de la implementación del modelo híbrido en el contexto cubano."
                  category="Investigación"
                  color="bg-chart-3"
                />
                <ResourceCard
                  icon={<Shield className="h-6 w-6" />}
                  title="Superación de Limitaciones"
                  description="Estrategias documentadas para superar barreras tecnológicas y organizacionales en la educación superior cubana."
                  category="Investigación"
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