import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { 
  GraduationCap, 
  Trophy, 
  TrendUp, 
  Users, 
  Lightning, 
  Check,
  BookOpen,
  ChartLineUp,
  Fire,
  Medal
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import NexusFluentLogo from './NexusFluentLogo'

interface LandingPageProps {
  onGetStarted: () => void
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: GraduationCap,
      title: 'Aprendizaje Estructurado',
      description: '7 niveles desde Principiante hasta C2, diseñados para llevarte paso a paso hacia la fluidez'
    },
    {
      icon: Trophy,
      title: 'Sistema de Logros',
      description: 'Gana badges, mantén rachas diarias y celebra cada hito en tu camino'
    },
    {
      icon: Lightning,
      title: 'Práctica Interactiva',
      description: 'Ejercicios variados con retroalimentación inmediata y técnicas de shadowing'
    },
    {
      icon: ChartLineUp,
      title: 'Progreso Personalizado',
      description: 'Tu avance se guarda automáticamente y se adapta a tu ritmo de aprendizaje'
    }
  ]

  const levels = [
    { name: 'Beginner', color: 'bg-green-500', description: 'Fundamentos básicos' },
    { name: 'A1', color: 'bg-emerald-500', description: 'Principiante' },
    { name: 'A2', color: 'bg-teal-500', description: 'Elemental' },
    { name: 'B1', color: 'bg-blue-500', description: 'Intermedio' },
    { name: 'B2', color: 'bg-indigo-500', description: 'Intermedio alto' },
    { name: 'C1', color: 'bg-purple-500', description: 'Avanzado' },
    { name: 'C2', color: 'bg-pink-500', description: 'Maestría' }
  ]

  const benefits = [
    'Más de 270 lecciones completas',
    'Audio de pronunciación nativa',
    'Ejercicios adaptativos',
    'Certificados de nivel',
    'Seguimiento de progreso',
    'Práctica de vocabulario'
  ]

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(120,119,198,0.15),transparent_50%),radial-gradient(circle_at_70%_60%,_rgba(255,122,122,0.12),transparent_60%),radial-gradient(circle_at_50%_80%,_rgba(255,185,94,0.1),transparent_50%)]" />
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <nav className="flex justify-between items-center mb-12 sm:mb-16">
            <div className="flex items-center">
              <NexusFluentLogo size={180} className="scale-75 sm:scale-100" />
            </div>
            <Button onClick={onGetStarted} variant="outline" size="default" className="shadow-sm hover:shadow-md transition-all text-sm sm:text-base">
              Iniciar Sesión
            </Button>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-16 sm:mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4 sm:space-y-6"
            >
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-1.5">
                <Fire size={16} weight="fill" className="mr-1 sm:hidden" />
                <Fire size={18} weight="fill" className="mr-1 hidden sm:inline" />
                Plataforma de Aprendizaje de Inglés
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                Domina el inglés
                <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mt-2">
                  a tu propio ritmo
                </span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Una plataforma integral que te guía desde los fundamentos hasta la maestría completa del idioma inglés, 
                con lecciones estructuradas, ejercicios interactivos y seguimiento personalizado.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <Button 
                  onClick={onGetStarted}
                  size="lg" 
                  className="text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <Lightning size={20} weight="fill" className="mr-2 sm:hidden" />
                  <Lightning size={24} weight="fill" className="mr-2 hidden sm:inline" />
                  Comenzar Gratis
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8 shadow-sm hover:shadow-md transition-all"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <BookOpen size={20} className="mr-2 sm:hidden" />
                  <BookOpen size={24} className="mr-2 hidden sm:inline" />
                  Explorar Niveles
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 pt-4 sm:pt-6 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background" />
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-secondary to-accent border-2 border-background" />
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-accent to-primary border-2 border-background" />
                  </div>
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">1000+</strong> estudiantes activos
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Medal size={18} weight="fill" className="text-accent sm:hidden" />
                  <Medal size={20} weight="fill" className="text-accent hidden sm:inline" />
                  <span><strong className="text-foreground">270+</strong> lecciones</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 backdrop-blur-sm border border-primary/20 shadow-2xl">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-2xl blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-2xl blur-2xl" />
                
                <div className="relative space-y-4">
                  <div className="flex items-center justify-between p-4 bg-card rounded-xl shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                        <Check size={20} weight="bold" className="text-success" />
                      </div>
                      <div>
                        <p className="font-semibold">Lección Completada</p>
                        <p className="text-sm text-muted-foreground">+50 puntos</p>
                      </div>
                    </div>
                    <Trophy size={24} weight="fill" className="text-accent" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-card rounded-xl shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center animate-streak-pulse">
                        <Fire size={20} weight="fill" className="text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Racha de 15 días</p>
                        <p className="text-sm text-muted-foreground">¡Sigue así!</p>
                      </div>
                    </div>
                    <TrendUp size={24} weight="bold" className="text-primary" />
                  </div>

                  <div className="p-4 bg-card rounded-xl shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold">Progreso del Nivel B1</p>
                      <span className="text-sm text-muted-foreground">68%</span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-secondary w-[68%] rounded-full" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-card rounded-lg shadow-md text-center">
                      <p className="text-2xl font-bold text-primary">34</p>
                      <p className="text-xs text-muted-foreground">Lecciones</p>
                    </div>
                    <div className="p-3 bg-card rounded-lg shadow-md text-center">
                      <p className="text-2xl font-bold text-secondary">1,250</p>
                      <p className="text-xs text-muted-foreground">Puntos</p>
                    </div>
                    <div className="p-3 bg-card rounded-lg shadow-md text-center">
                      <p className="text-2xl font-bold text-accent">12</p>
                      <p className="text-xs text-muted-foreground">Logros</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div id="features" className="mb-16 sm:mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-8 sm:mb-12"
            >
              <Badge className="bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20 mb-3 sm:mb-4 text-xs sm:text-sm">
                Características
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-4">
                Todo lo que necesitas para
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  aprender inglés
                </span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                Una plataforma completa con herramientas diseñadas científicamente para acelerar tu aprendizaje
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1 border-2 hover:border-primary/20">
                    <CardContent className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <feature.icon size={20} weight="bold" className="text-primary sm:hidden" />
                        <feature.icon size={24} weight="bold" className="text-primary hidden sm:inline" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold">{feature.title}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-16 sm:mb-24"
          >
            <div className="text-center mb-8 sm:mb-12">
              <Badge className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 mb-3 sm:mb-4 text-xs sm:text-sm">
                7 Niveles de Dominio
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-4">
                Desde cero hasta la
                <span className="block bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                  maestría completa
                </span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                Progresa a través de niveles estructurados basados en el Marco Común Europeo de Referencia
              </p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-pink-500 rounded-full -translate-y-1/2 hidden lg:block" />
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
                {levels.map((level, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <Card className="hover:shadow-xl transition-all hover:-translate-y-2 border-2 hover:border-primary/30 bg-card/80 backdrop-blur">
                      <CardContent className="p-3 sm:p-4 text-center space-y-1 sm:space-y-2">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full ${level.color} mx-auto flex items-center justify-center shadow-lg`}>
                          <span className="text-white font-bold text-base sm:text-lg">{level.name.charAt(0)}</span>
                        </div>
                        <h3 className="font-bold text-sm sm:text-base">{level.name}</h3>
                        <p className="text-xs text-muted-foreground">{level.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-16 sm:mb-24"
          >
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20 shadow-2xl overflow-hidden">
              <CardContent className="p-6 sm:p-8 lg:p-12">
                <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                  <div className="space-y-4 sm:space-y-6">
                    <Badge className="bg-success/10 text-success border-success/20 text-xs sm:text-sm">
                      Todo Incluido
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                      ¿Qué incluye la plataforma?
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground">
                      Acceso completo a todas las herramientas y recursos que necesitas para alcanzar la fluidez en inglés.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-card rounded-lg shadow-sm"
                      >
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                          <Check size={12} weight="bold" className="text-success sm:hidden" />
                          <Check size={14} weight="bold" className="text-success hidden sm:inline" />
                        </div>
                        <span className="font-medium text-sm sm:text-base">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center space-y-4 sm:space-y-6 py-8 sm:py-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold px-4">
              ¿Listo para empezar tu
              <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mt-2">
                viaje hacia la fluidez?
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Únete a miles de estudiantes que están transformando su futuro dominando el inglés.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4 px-4">
              <Button 
                onClick={onGetStarted}
                size="lg" 
                className="text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <Users size={20} weight="bold" className="mr-2 sm:hidden" />
                <Users size={24} weight="bold" className="mr-2 hidden sm:inline" />
                Crear Cuenta Gratis
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <footer className="relative z-10 border-t bg-card/50 backdrop-blur-sm mt-16 sm:mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <GraduationCap size={16} weight="bold" className="text-white sm:hidden" />
                <GraduationCap size={20} weight="bold" className="text-white hidden sm:inline" />
              </div>
              <span className="font-bold text-base sm:text-lg">Nexus Fluent</span>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm text-center">
              © 2024 Nexus Fluent. Plataforma de aprendizaje de inglés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
