import { Lesson } from './types'
import { C1_CURRICULUM } from './complete-curriculum-data'

const C1_VOCABULARY_SETS = {
  inversion: [
    { word: 'Seldom', translation: 'Raramente', example: 'Seldom have I seen such dedication.', type: 'adverb' as const },
    { word: 'Rarely', translation: 'Raramente', example: 'Rarely do we encounter this problem.', type: 'adverb' as const },
    { word: 'Never', translation: 'Nunca', example: 'Never have I witnessed such incompetence.', type: 'adverb' as const },
    { word: 'Hardly', translation: 'Apenas', example: 'Hardly had we begun when it started.', type: 'adverb' as const },
    { word: 'Scarcely', translation: 'Apenas', example: 'Scarcely had I arrived when the phone rang.', type: 'adverb' as const },
    { word: 'Barely', translation: 'Apenas', example: 'Barely had we finished when the alarm sounded.', type: 'adverb' as const },
    { word: 'Not only', translation: 'No solo', example: 'Not only is she talented, but also hardworking.', type: 'phrase' as const },
    { word: 'Little', translation: 'Poco', example: 'Little did I know what would happen.', type: 'adverb' as const },
    { word: 'Under no circumstances', translation: 'Bajo ninguna circunstancia', example: 'Under no circumstances should you reveal this.', type: 'phrase' as const },
    { word: 'At no time', translation: 'En ningún momento', example: 'At no time was I informed.', type: 'phrase' as const },
    { word: 'On no account', translation: 'Bajo ningún concepto', example: 'On no account must you be late.', type: 'phrase' as const },
    { word: 'Nowhere', translation: 'En ninguna parte', example: 'Nowhere can you find better service.', type: 'adverb' as const },
    { word: 'Not until', translation: 'No hasta que', example: 'Not until recently did we understand.', type: 'phrase' as const },
    { word: 'No sooner', translation: 'Tan pronto como', example: 'No sooner had I left than it rained.', type: 'phrase' as const },
    { word: 'In no way', translation: 'De ninguna manera', example: 'In no way can this be justified.', type: 'phrase' as const },
  ],
  discourse: [
    { word: 'Nevertheless', translation: 'Sin embargo', example: 'The task was difficult; nevertheless, we succeeded.', type: 'adverb' as const },
    { word: 'Nonetheless', translation: 'No obstante', example: 'It was risky; nonetheless, we proceeded.', type: 'adverb' as const },
    { word: 'Furthermore', translation: 'Además', example: 'Furthermore, this approach saves time.', type: 'adverb' as const },
    { word: 'Moreover', translation: 'Es más', example: 'Moreover, the results were impressive.', type: 'adverb' as const },
    { word: 'Consequently', translation: 'Por consiguiente', example: 'Consequently, we changed our strategy.', type: 'adverb' as const },
    { word: 'Hence', translation: 'Por ende', example: 'Hence, the need for reform.', type: 'adverb' as const },
    { word: 'Thus', translation: 'Así pues', example: 'Thus, we concluded the project.', type: 'adverb' as const },
    { word: 'Whereas', translation: 'Mientras que', example: 'I prefer tea, whereas she likes coffee.', type: 'phrase' as const },
    { word: 'Conversely', translation: 'A la inversa', example: 'Conversely, this method is slower.', type: 'adverb' as const },
    { word: 'Likewise', translation: 'De igual manera', example: 'Likewise, we must consider the costs.', type: 'adverb' as const },
    { word: 'Subsequently', translation: 'Posteriormente', example: 'Subsequently, measures were implemented.', type: 'adverb' as const },
    { word: 'Whereby', translation: 'Por el cual', example: 'A system whereby complaints are handled.', type: 'adverb' as const },
    { word: 'Notwithstanding', translation: 'A pesar de', example: 'Notwithstanding the obstacles.', type: 'adverb' as const },
    { word: 'Henceforth', translation: 'De ahora en adelante', example: 'Henceforth, this will be the policy.', type: 'adverb' as const },
    { word: 'Hitherto', translation: 'Hasta ahora', example: 'Hitherto unexplored territories.', type: 'adverb' as const },
  ],
  academic: [
    { word: 'Allege', translation: 'Alegar', example: 'He alleged that the documents were forged.', type: 'verb' as const },
    { word: 'Assert', translation: 'Aseverar', example: 'The expert asserted that the theory was sound.', type: 'verb' as const },
    { word: 'Contend', translation: 'Sostener', example: 'Critics contend that the policy is flawed.', type: 'verb' as const },
    { word: 'Refute', translation: 'Refutar', example: 'She refuted the allegations firmly.', type: 'verb' as const },
    { word: 'Concede', translation: 'Conceder', example: 'He conceded that mistakes had been made.', type: 'verb' as const },
    { word: 'Acknowledge', translation: 'Reconocer', example: 'They acknowledged the problem existed.', type: 'verb' as const },
    { word: 'Emphasize', translation: 'Enfatizar', example: 'She emphasized the urgency of the situation.', type: 'verb' as const },
    { word: 'Underscore', translation: 'Subrayar', example: 'The report underscored the need for reform.', type: 'verb' as const },
    { word: 'Advocate', translation: 'Abogar', example: 'He advocates for stronger regulations.', type: 'verb' as const },
    { word: 'Denounce', translation: 'Denunciar', example: 'They denounced the decision as unfair.', type: 'verb' as const },
    { word: 'Implementation', translation: 'Implementación', example: 'The implementation of the policy.', type: 'noun' as const },
    { word: 'Manifestation', translation: 'Manifestación', example: 'A clear manifestation of the problem.', type: 'noun' as const },
    { word: 'Significance', translation: 'Significancia', example: 'The significance of this discovery.', type: 'noun' as const },
    { word: 'Complexity', translation: 'Complejidad', example: 'The complexity of the issue.', type: 'noun' as const },
    { word: 'Deterioration', translation: 'Deterioro', example: 'The deterioration of conditions.', type: 'noun' as const },
  ],
  formal: [
    { word: 'Arguably', translation: 'Posiblemente', example: 'This is arguably the best solution.', type: 'adverb' as const },
    { word: 'Presumably', translation: 'Presumiblemente', example: 'Presumably, this will resolve the issue.', type: 'adverb' as const },
    { word: 'Tentatively', translation: 'Tentativamente', example: 'I would tentatively suggest...', type: 'adverb' as const },
    { word: 'Somewhat', translation: 'Algo', example: 'The results were somewhat unexpected.', type: 'adverb' as const },
    { word: 'To some extent', translation: 'Hasta cierto punto', example: 'To some extent, this is true.', type: 'phrase' as const },
    { word: 'Viable', translation: 'Viable', example: 'A viable solution to the problem.', type: 'adjective' as const },
    { word: 'Feasible', translation: 'Factible', example: 'A feasible alternative approach.', type: 'adjective' as const },
    { word: 'Comprehensive', translation: 'Integral', example: 'A comprehensive analysis.', type: 'adjective' as const },
    { word: 'Substantial', translation: 'Sustancial', example: 'Substantial evidence supports this.', type: 'adjective' as const },
    { word: 'Rigorous', translation: 'Riguroso', example: 'Rigorous testing is required.', type: 'adjective' as const },
    { word: 'Precedent', translation: 'Precedente', example: 'This sets a dangerous precedent.', type: 'noun' as const },
    { word: 'Framework', translation: 'Marco', example: 'A theoretical framework.', type: 'noun' as const },
    { word: 'Paradigm', translation: 'Paradigma', example: 'A paradigm shift in thinking.', type: 'noun' as const },
    { word: 'Criterion', translation: 'Criterio', example: 'The main criterion for selection.', type: 'noun' as const },
    { word: 'Dimension', translation: 'Dimensión', example: 'Multiple dimensions of the problem.', type: 'noun' as const },
  ],
}

function generateC1Vocabulary(classNumber: number): Array<{ word: string; translation: string; example: string; type: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase' }> {
  if (classNumber <= 185) return C1_VOCABULARY_SETS.inversion
  if (classNumber <= 195) return C1_VOCABULARY_SETS.discourse
  if (classNumber <= 210) return C1_VOCABULARY_SETS.academic
  return C1_VOCABULARY_SETS.formal
}

function generateC1Grammar(topic: { grammarPattern: string, topicFunction: string }) {
  return {
    title: topic.grammarPattern,
    explanation: `Esta lección de nivel C1 se enfoca en ${topic.grammarPattern.toLowerCase()}. El objetivo es dominar ${topic.topicFunction.toLowerCase()}, una habilidad esencial para comunicación avanzada en contextos académicos, profesionales y formales. Este nivel requiere precisión, sofisticación y control total del idioma.`,
    examples: [
      `Ejemplo 1: Demonstración práctica de ${topic.grammarPattern.toLowerCase()}.`,
      `Ejemplo 2: Aplicación en contexto académico y formal.`,
      `Ejemplo 3: Uso en escritura sofisticada y argumentación.`,
      `Ejemplo 4: Integración con otras estructuras avanzadas.`,
    ],
    rules: [
      `Regla 1: Estructura y formación de ${topic.grammarPattern.toLowerCase()}`,
      `Regla 2: Contextos apropiados para uso formal`,
      `Regla 3: Matices de significado y registro`,
      `Regla 4: Combinación con otras estructuras C1`,
    ],
  }
}

function generateC1Exercises(lessonNumber: number, topic: string): any[] {
  return [
    {
      id: `ex1-${lessonNumber}`,
      type: 'multiple-choice' as const,
      question: `Completa la oración usando ${topic}:`,
      options: ['Opción A (correcta)', 'Opción B', 'Opción C', 'Opción D'],
      correctAnswer: 'Opción A (correcta)',
      explanation: `Esta es la respuesta correcta porque aplica correctamente las reglas de ${topic}.`,
    },
    {
      id: `ex2-${lessonNumber}`,
      type: 'fill-blank' as const,
      question: `Completa con la forma correcta:`,
      correctAnswer: 'respuesta',
      explanation: `La respuesta correcta demuestra dominio de ${topic}.`,
    },
    {
      id: `ex3-${lessonNumber}`,
      type: 'multiple-choice' as const,
      question: `Identifica el uso correcto en contexto formal:`,
      options: ['Formal correcto', 'Informal', 'Incorrecto', 'Poco natural'],
      correctAnswer: 'Formal correcto',
      explanation: 'Esta opción mantiene el registro formal apropiado.',
    },
    {
      id: `ex4-${lessonNumber}`,
      type: 'fill-blank' as const,
      question: 'Transforma la oración al nivel C1:',
      correctAnswer: 'transformación',
      explanation: 'Esta transformación muestra sofisticación lingüística.',
    },
    {
      id: `ex5-${lessonNumber}`,
      type: 'multiple-choice' as const,
      question: 'Selecciona la expresión más sofisticada:',
      options: ['Sofisticada (correcta)', 'Simple', 'Informal', 'Básica'],
      correctAnswer: 'Sofisticada (correcta)',
      explanation: 'Esta expresión demuestra dominio de nivel C1.',
    },
    {
      id: `ex6-${lessonNumber}`,
      type: 'fill-blank' as const,
      question: 'Aplica la estructura avanzada:',
      correctAnswer: 'aplicación',
      explanation: 'Correcta aplicación de estructura C1.',
    },
    {
      id: `ex7-${lessonNumber}`,
      type: 'multiple-choice' as const,
      question: 'Identifica el matiz de significado correcto:',
      options: ['Matiz preciso', 'Matiz incorrecto', 'Ambiguo', 'Poco claro'],
      correctAnswer: 'Matiz preciso',
      explanation: 'Este matiz transmite el significado exacto.',
    },
    {
      id: `ex8-${lessonNumber}`,
      type: 'fill-blank' as const,
      question: 'Completa con vocabulario académico:',
      correctAnswer: 'vocabulario',
      explanation: 'Vocabulario académico apropiado para nivel C1.',
    },
    {
      id: `ex9-${lessonNumber}`,
      type: 'multiple-choice' as const,
      question: 'Elige la construcción más formal:',
      options: ['Formal avanzada', 'Neutral', 'Informal', 'Coloquial'],
      correctAnswer: 'Formal avanzada',
      explanation: 'Esta construcción es apropiada para discurso formal.',
    },
    {
      id: `ex10-${lessonNumber}`,
      type: 'fill-blank' as const,
      question: 'Integra múltiples estructuras avanzadas:',
      correctAnswer: 'integración',
      explanation: 'Integración exitosa de estructuras complejas.',
    },
    {
      id: `ex11-${lessonNumber}`,
      type: 'multiple-choice' as const,
      question: 'Selecciona el registro apropiado:',
      options: ['Registro C1 correcto', 'Demasiado simple', 'Incorrecto', 'No apropiado'],
      correctAnswer: 'Registro C1 correcto',
      explanation: 'Este registro es apropiado para el contexto.',
    },
    {
      id: `ex12-${lessonNumber}`,
      type: 'fill-blank' as const,
      question: 'Demuestra dominio de colocaciones:',
      correctAnswer: 'colocación',
      explanation: 'Colocación natural de nivel avanzado.',
    },
    {
      id: `ex13-${lessonNumber}`,
      type: 'multiple-choice' as const,
      question: 'Identifica la expresión idiomática formal:',
      options: ['Idiomática formal', 'Literal', 'Coloquial', 'Básica'],
      correctAnswer: 'Idiomática formal',
      explanation: 'Expresión idiomática apropiada para contexto formal.',
    },
    {
      id: `ex14-${lessonNumber}`,
      type: 'fill-blank' as const,
      question: 'Aplica principios de cohesión textual:',
      correctAnswer: 'cohesión',
      explanation: 'Cohesión textual de nivel C1.',
    },
    {
      id: `ex15-${lessonNumber}`,
      type: 'multiple-choice' as const,
      question: 'Demuestra fluidez en contexto académico:',
      options: ['Fluidez académica', 'Inadecuado', 'Muy simple', 'Incorrecto'],
      correctAnswer: 'Fluidez académica',
      explanation: 'Esta respuesta demuestra fluidez y precisión académica.',
    },
  ]
}

function generateC1ShadowingText(topic: { grammarPattern: string, topicFunction: string }): string {
  return `Texto de práctica para shadowing de nivel C1: Este ejercicio integra ${topic.grammarPattern.toLowerCase()} para ${topic.topicFunction.toLowerCase()}. Notwithstanding the inherent complexity of this grammatical structure, mastery of these elements is fundamental to achieving true fluency at the C1 level. Seldom have linguistic challenges proven so rewarding once conquered. Not only does this enhance written communication, but it also significantly elevates spoken discourse. It is precisely through such deliberate practice that learners transcend intermediate plateaus and attain advanced proficiency.`
}

function generateC1ShadowingPhrases(topic: { grammarPattern: string, topicFunction: string }) {
  return [
    { 
      text: `This advanced shadowing exercise focuses on mastering ${topic.grammarPattern.toLowerCase()} for ${topic.topicFunction.toLowerCase()}.`, 
      translation: `Este ejercicio avanzado de shadowing se enfoca en dominar ${topic.grammarPattern.toLowerCase()} para ${topic.topicFunction.toLowerCase()}.` 
    },
    { 
      text: 'Notwithstanding the inherent complexity of this grammatical structure, mastery is entirely achievable through dedicated practice.', 
      translation: 'A pesar de la complejidad inherente de esta estructura gramatical, el dominio es totalmente alcanzable mediante práctica dedicada.' 
    },
    { 
      text: 'Seldom have linguistic challenges proven so rewarding once conquered, particularly at this advanced level.', 
      translation: 'Raramente los desafíos lingüísticos han demostrado ser tan gratificantes una vez conquistados, particularmente en este nivel avanzado.' 
    },
    { 
      text: 'Not only does this enhance your written communication, but it also significantly elevates your spoken discourse and overall fluency.', 
      translation: 'Esto no solo mejora tu comunicación escrita, sino que también eleva significativamente tu discurso hablado y fluidez general.' 
    },
    { 
      text: 'It is precisely through such deliberate and consistent practice that learners transcend intermediate plateaus and attain truly advanced proficiency.', 
      translation: 'Es precisamente a través de esta práctica deliberada y consistente que los estudiantes trascienden las mesetas intermedias y alcanzan una competencia verdaderamente avanzada.' 
    },
  ]
}

export function generateAllC1Lessons(): Lesson[] {
  return C1_CURRICULUM.map((topic, index) => ({
    id: `c1-${index + 1}`,
    level: 'C1' as const,
    order: index + 1,
    title: `${topic.grammarPattern} (C${topic.classNumber})`,
    objective: `Dominar ${topic.grammarPattern} para ${topic.topicFunction}`,
    vocabulary: generateC1Vocabulary(topic.classNumber),
    grammar: generateC1Grammar(topic),
    exercises: generateC1Exercises(topic.classNumber, topic.grammarPattern),
    shadowingText: generateC1ShadowingText(topic),
    shadowingPhrases: generateC1ShadowingPhrases(topic),
  }))
}

export const C1_LESSONS_COMPLETE = generateAllC1Lessons()
