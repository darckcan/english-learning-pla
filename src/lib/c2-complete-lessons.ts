import { Lesson } from './types'
import { C2_CURRICULUM } from './complete-curriculum-data'

const C2_VOCABULARY_SETS = {
  periphrastic: [
    { word: 'Such is', translation: 'Tal es', example: 'Such is the nature of progress.', type: 'phrase' as const },
    { word: 'Little did I know', translation: 'Poco sabía yo', example: 'Little did I know what awaited me.', type: 'phrase' as const },
    { word: 'So it is', translation: 'Así es', example: 'So it is with all great discoveries.', type: 'phrase' as const },
    { word: 'Far be it from me', translation: 'Lejos de mí', example: 'Far be it from me to criticize.', type: 'phrase' as const },
    { word: 'Be that as it may', translation: 'Sea como fuere', example: 'Be that as it may, we must proceed.', type: 'phrase' as const },
    { word: 'Suffice it to say', translation: 'Baste decir', example: 'Suffice it to say, the results were extraordinary.', type: 'phrase' as const },
    { word: 'That said', translation: 'Dicho esto', example: 'That said, we should remain cautious.', type: 'phrase' as const },
    { word: 'Needless to say', translation: 'Huelga decir', example: 'Needless to say, the impact was profound.', type: 'phrase' as const },
    { word: 'All things being equal', translation: 'En igualdad de condiciones', example: 'All things being equal, this is the best option.', type: 'phrase' as const },
    { word: 'As luck would have it', translation: 'Como quiso la suerte', example: 'As luck would have it, we found a solution.', type: 'phrase' as const },
    { word: 'For all intents and purposes', translation: 'A todos los efectos', example: 'For all intents and purposes, the project is complete.', type: 'phrase' as const },
    { word: 'In the final analysis', translation: 'En último análisis', example: 'In the final analysis, it comes down to trust.', type: 'phrase' as const },
    { word: 'When all is said and done', translation: 'Al fin y al cabo', example: 'When all is said and done, character matters most.', type: 'phrase' as const },
    { word: 'To all intents and purposes', translation: 'Prácticamente', example: 'To all intents and purposes, the matter is settled.', type: 'phrase' as const },
    { word: 'If truth be told', translation: 'A decir verdad', example: 'If truth be told, I was somewhat apprehensive.', type: 'phrase' as const },
  ],
  lowFrequency: [
    { word: 'Ineffable', translation: 'Inefable', example: 'The ineffable beauty of the sunset.', type: 'adjective' as const },
    { word: 'Ubiquitous', translation: 'Ubicuo', example: 'Technology has become ubiquitous.', type: 'adjective' as const },
    { word: 'Ephemeral', translation: 'Efímero', example: 'The ephemeral nature of fame.', type: 'adjective' as const },
    { word: 'Propensity', translation: 'Propensión', example: 'A propensity for exaggeration.', type: 'noun' as const },
    { word: 'Inexorable', translation: 'Inexorable', example: 'The inexorable march of time.', type: 'adjective' as const },
    { word: 'Proclivity', translation: 'Proclividad', example: 'His proclivity toward perfectionism.', type: 'noun' as const },
    { word: 'Perspicacious', translation: 'Perspicaz', example: 'A perspicacious analysis of the situation.', type: 'adjective' as const },
    { word: 'Quintessential', translation: 'Quintaesencial', example: 'The quintessential example of excellence.', type: 'adjective' as const },
    { word: 'Quixotic', translation: 'Quijotesco', example: 'A quixotic pursuit of perfection.', type: 'adjective' as const },
    { word: 'Sagacious', translation: 'Sagaz', example: 'Sagacious advice from a mentor.', type: 'adjective' as const },
    { word: 'Verisimilitude', translation: 'Verosimilitud', example: 'The verisimilitude of the narrative.', type: 'noun' as const },
    { word: 'Zeitgeist', translation: 'Espíritu de la época', example: 'Capturing the zeitgeist of the era.', type: 'noun' as const },
    { word: 'Vicissitude', translation: 'Vicisitud', example: 'The vicissitudes of fortune.', type: 'noun' as const },
    { word: 'Redolent', translation: 'Evocador', example: 'Redolent of bygone days.', type: 'adjective' as const },
    { word: 'Plethora', translation: 'Plétora', example: 'A plethora of options.', type: 'noun' as const },
  ],
  sophisticated: [
    { word: 'Erudite', translation: 'Erudito', example: 'An erudite discussion of philosophy.', type: 'adjective' as const },
    { word: 'Sagacity', translation: 'Sagacidad', example: 'Her sagacity was widely admired.', type: 'noun' as const },
    { word: 'Circumlocution', translation: 'Circunloquio', example: 'Avoiding circumlocution in speech.', type: 'noun' as const },
    { word: 'Obfuscate', translation: 'Ofuscar', example: 'Don\'t obfuscate the issue.', type: 'verb' as const },
    { word: 'Parsimony', translation: 'Parsimonia', example: 'The parsimony of his explanations.', type: 'noun' as const },
    { word: 'Tautology', translation: 'Tautología', example: 'Avoiding tautological statements.', type: 'noun' as const },
    { word: 'Didactic', translation: 'Didáctico', example: 'A didactic approach to teaching.', type: 'adjective' as const },
    { word: 'Pedantic', translation: 'Pedante', example: 'Overly pedantic corrections.', type: 'adjective' as const },
    { word: 'Laconic', translation: 'Lacónico', example: 'His laconic response spoke volumes.', type: 'adjective' as const },
    { word: 'Verbose', translation: 'Verboso', example: 'Unnecessarily verbose prose.', type: 'adjective' as const },
    { word: 'Grandiloquent', translation: 'Grandilocuente', example: 'Grandiloquent rhetoric.', type: 'adjective' as const },
    { word: 'Mellifluous', translation: 'Melifluo', example: 'A mellifluous voice.', type: 'adjective' as const },
    { word: 'Pellucid', translation: 'Diáfano', example: 'Pellucid prose.', type: 'adjective' as const },
    { word: 'Recondite', translation: 'Recóndito', example: 'Recondite knowledge.', type: 'adjective' as const },
    { word: 'Abstruse', translation: 'Abstruso', example: 'Abstruse philosophical concepts.', type: 'adjective' as const },
  ],
  collocations: [
    { word: 'Vested interest', translation: 'Interés creado', example: 'They have a vested interest in the outcome.', type: 'phrase' as const },
    { word: 'Foregone conclusion', translation: 'Conclusión inevitable', example: 'The result was a foregone conclusion.', type: 'phrase' as const },
    { word: 'Mitigating circumstances', translation: 'Circunstancias atenuantes', example: 'There were mitigating circumstances.', type: 'phrase' as const },
    { word: 'Unequivocal support', translation: 'Apoyo inequívoco', example: 'She gave her unequivocal support.', type: 'phrase' as const },
    { word: 'Categorical denial', translation: 'Negación categórica', example: 'A categorical denial of the allegations.', type: 'phrase' as const },
    { word: 'Tacit approval', translation: 'Aprobación tácita', example: 'His silence implied tacit approval.', type: 'phrase' as const },
    { word: 'Implicit assumption', translation: 'Suposición implícita', example: 'The implicit assumption underlying the theory.', type: 'phrase' as const },
    { word: 'Inextricably linked', translation: 'Inextricablemente ligado', example: 'The issues are inextricably linked.', type: 'phrase' as const },
    { word: 'Intrinsic value', translation: 'Valor intrínseco', example: 'The intrinsic value of education.', type: 'phrase' as const },
    { word: 'Pervasive influence', translation: 'Influencia omnipresente', example: 'The pervasive influence of technology.', type: 'phrase' as const },
    { word: 'Salient feature', translation: 'Característica destacada', example: 'The most salient feature of the proposal.', type: 'phrase' as const },
    { word: 'Unmitigated disaster', translation: 'Desastre absoluto', example: 'The event was an unmitigated disaster.', type: 'phrase' as const },
    { word: 'Unequivocal evidence', translation: 'Evidencia inequívoca', example: 'There is unequivocal evidence.', type: 'phrase' as const },
    { word: 'Unassailable logic', translation: 'Lógica irrefutable', example: 'His unassailable logic convinced everyone.', type: 'phrase' as const },
    { word: 'Irrefutable proof', translation: 'Prueba irrefutable', example: 'Irrefutable proof of the theorem.', type: 'phrase' as const },
  ],
  rhetorical: [
    { word: 'Anaphora', translation: 'Anáfora', example: 'We shall fight... We shall never surrender.', type: 'noun' as const },
    { word: 'Antithesis', translation: 'Antítesis', example: 'Ask not what your country can do for you...', type: 'noun' as const },
    { word: 'Chiasmus', translation: 'Quiasmo', example: 'Ask not... do for you; ask what you... for your country.', type: 'noun' as const },
    { word: 'Hyperbole', translation: 'Hipérbole', example: 'I\'ve told you a million times.', type: 'noun' as const },
    { word: 'Litotes', translation: 'Lítote', example: 'Not bad = quite good.', type: 'noun' as const },
    { word: 'Metonymy', translation: 'Metonimia', example: 'The Crown decided = the monarch.', type: 'noun' as const },
    { word: 'Synecdoche', translation: 'Sinécdoque', example: 'All hands on deck = all people.', type: 'noun' as const },
    { word: 'Oxymoron', translation: 'Oxímoron', example: 'Deafening silence, cruel kindness.', type: 'noun' as const },
    { word: 'Paradox', translation: 'Paradoja', example: 'Less is more.', type: 'noun' as const },
    { word: 'Euphemism', translation: 'Eufemismo', example: 'Passed away = died.', type: 'noun' as const },
    { word: 'Apostrophe', translation: 'Apóstrofe', example: 'O Death, where is thy sting?', type: 'noun' as const },
    { word: 'Rhetorical question', translation: 'Pregunta retórica', example: 'Is this not obvious?', type: 'phrase' as const },
    { word: 'Parallelism', translation: 'Paralelismo', example: 'I came, I saw, I conquered.', type: 'noun' as const },
    { word: 'Alliteration', translation: 'Aliteración', example: 'Peter Piper picked...', type: 'noun' as const },
    { word: 'Assonance', translation: 'Asonancia', example: 'Fleet feet sweep...', type: 'noun' as const },
  ],
}

function generateC2Vocabulary(classNumber: number): Array<{ word: string; translation: string; example: string; type: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase' }> {
  if (classNumber <= 235) return C2_VOCABULARY_SETS.periphrastic
  if (classNumber <= 245) return C2_VOCABULARY_SETS.lowFrequency
  if (classNumber <= 255) return C2_VOCABULARY_SETS.sophisticated
  if (classNumber <= 265) return C2_VOCABULARY_SETS.collocations
  return C2_VOCABULARY_SETS.rhetorical
}

function generateC2Grammar(topic: { grammarPattern: string, topicFunction: string }) {
  return {
    title: topic.grammarPattern,
    explanation: `Esta lección de nivel C2 representa el dominio maestro del inglés. Te enfocarás en ${topic.grammarPattern.toLowerCase()}, una competencia que define ${topic.topicFunction.toLowerCase()}. En este nivel, no solo comprendes el idioma, sino que lo manipulas con la precisión de un nativo educado, adaptándote sin esfuerzo a cualquier contexto, desde el más coloquial hasta el más académico o literario.`,
    examples: [
      `Ejemplo 1: Demostración magistral de ${topic.grammarPattern.toLowerCase()} en contexto literario.`,
      `Ejemplo 2: Aplicación en discurso académico de alto nivel.`,
      `Ejemplo 3: Uso en contexto profesional con máxima sofisticación.`,
      `Ejemplo 4: Variación estilística mostrando dominio completo.`,
    ],
    rules: [
      `Regla 1: Estructura y formación perfecta de ${topic.grammarPattern.toLowerCase()}`,
      `Regla 2: Contextos apropiados y matices sutiles de uso`,
      `Regla 3: Diferencias de registro y adecuación al contexto`,
      `Regla 4: Integración natural con otras estructuras de nivel maestro`,
    ],
  }
}

function generateC2Exercises(lessonNumber: number, topic: string): any[] {
  return [
    {
      id: `ex1-${lessonNumber}`,
      type: 'multiple-choice' as const,
      question: `Identifica el uso más sofisticado y natural de ${topic}:`,
      options: ['Opción básica', 'Opción intermedia', 'Opción avanzada', 'Opción de nivel maestro (correcta)'],
      correctAnswer: 'Opción de nivel maestro (correcta)',
      explanation: `Esta opción demuestra dominio completo de ${topic} con naturalidad y sofisticación.`,
    },
    {
      id: `ex2-${lessonNumber}`,
      type: 'fill-blank' as const,
      question: `Completa con la expresión más refinada y precisa:`,
      correctAnswer: 'respuesta',
      explanation: `La respuesta correcta muestra el nivel de precisión esperado en C2.`,
    },
    {
      id: `ex3-${lessonNumber}`,
      type: 'multiple-choice' as const,
      question: `¿Cuál refleja mejor el registro apropiado para contexto académico formal?`,
      options: ['Demasiado informal', 'Apropiado pero simple', 'Formal y sofisticado (correcto)', 'Artificialmente rebuscado'],
      correctAnswer: 'Formal y sofisticado (correcto)',
      explanation: 'Esta opción equilibra sofisticación con naturalidad.',
    },
    {
      id: `ex4-${lessonNumber}`,
      type: 'fill-blank' as const,
      question: 'Transforma al nivel de dominio maestro:',
      correctAnswer: 'transformación',
      explanation: 'Esta transformación demuestra manipulación experta del idioma.',
    },
    {
      id: `ex5-${lessonNumber}`,
      type: 'multiple-choice' as const,
      question: 'Selecciona la variación estilística más efectiva:',
      options: ['Monótona', 'Variada pero inconsistente', 'Elegantemente variada (correcta)', 'Excesivamente compleja'],
      correctAnswer: 'Elegantemente variada (correcta)',
      explanation: 'Esta opción muestra dominio de la variación estilística natural.',
    },
    {
      id: `ex6-${lessonNumber}`,
      type: 'fill-blank' as const,
      question: 'Aplica el matiz semántico preciso:',
      correctAnswer: 'aplicación',
      explanation: 'La respuesta refleja comprensión de matices sutiles.',
    },
    {
      id: `ex7-${lessonNumber}`,
      type: 'multiple-choice' as const,
      question: 'Identifica la colocación más natural:',
      options: ['Gramaticalmente correcta pero no natural', 'Común pero simple', 'Naturalmente idiomática (correcta)', 'Poco común'],
      correctAnswer: 'Naturalmente idiomática (correcta)',
      explanation: 'Esta colocación es la que usaría un hablante nativo educado.',
    },
    {
      id: `ex8-${lessonNumber}`,
      type: 'fill-blank' as const,
      question: 'Emplea el dispositivo retórico apropiado:',
      correctAnswer: 'dispositivo',
      explanation: 'El uso correcto de este dispositivo añade impacto retórico.',
    },
    {
      id: `ex9-${lessonNumber}`,
      type: 'multiple-choice' as const,
      question: 'Evalúa la connotación más apropiada para el contexto:',
      options: ['Neutral', 'Ligeramente negativa', 'Precisamente apropiada (correcta)', 'Ambigua'],
      correctAnswer: 'Precisamente apropiada (correcta)',
      explanation: 'La connotación debe ser exacta para el contexto dado.',
    },
    {
      id: `ex10-${lessonNumber}`,
      type: 'fill-blank' as const,
      question: 'Sintetiza con la expresión más económica y precisa:',
      correctAnswer: 'síntesis',
      explanation: 'La economía lingüística es marca de dominio maestro.',
    },
    {
      id: `ex11-${lessonNumber}`,
      type: 'multiple-choice' as const,
      question: 'Determina el registro más apropiado:',
      options: ['Formal', 'Informal', 'Precisamente calibrado (correcto)', 'Inconsistente'],
      correctAnswer: 'Precisamente calibrado (correcto)',
      explanation: 'El dominio del registro es esencial en nivel C2.',
    },
    {
      id: `ex12-${lessonNumber}`,
      type: 'fill-blank' as const,
      question: 'Demuestra dominio de la ambigüedad intencional:',
      correctAnswer: 'ambigüedad',
      explanation: 'La ambigüedad controlada es una habilidad sofisticada.',
    },
    {
      id: `ex13-${lessonNumber}`,
      type: 'multiple-choice' as const,
      question: 'Selecciona la estructura que mejor integra múltiples elementos:',
      options: ['Simple', 'Compuesta básica', 'Magistralmente integrada (correcta)', 'Confusamente compleja'],
      correctAnswer: 'Magistralmente integrada (correcta)',
      explanation: 'La integración fluida muestra verdadero dominio.',
    },
    {
      id: `ex14-${lessonNumber}`,
      type: 'fill-blank' as const,
      question: 'Aplica la variación léxica sin repetición:',
      correctAnswer: 'variación',
      explanation: 'Evitar repetición mientras se mantiene claridad es arte.',
    },
    {
      id: `ex15-${lessonNumber}`,
      type: 'multiple-choice' as const,
      question: 'Identifica el uso que mejor equilibra sofisticación y claridad:',
      options: ['Demasiado simple', 'Oscuramente complejo', 'Perfectamente equilibrado (correcto)', 'Pretenciosamente rebuscado'],
      correctAnswer: 'Perfectamente equilibrado (correcto)',
      explanation: 'El equilibrio entre sofisticación y claridad define la maestría.',
    },
  ]
}

function generateC2ShadowingText(topic: string, classNumber: number): string {
  const texts = [
    'Notwithstanding the multifaceted challenges inherent in such an undertaking, the inexorable march toward progress demands our unwavering commitment. Indeed, it is through the synthesis of disparate perspectives that we illuminate the path forward, eschewing facile solutions in favor of nuanced understanding.',
    'The verisimilitude of the narrative was such that it transcended mere storytelling, becoming a pellucid window into the human condition. Herein lies the quintessential power of literature: its capacity to render the ineffable tangible, the abstract concrete.',
    'Be that as it may, the preponderance of evidence suggests an inextricable link between these phenomena. Far be it from me to engage in unwarranted speculation; suffice it to say that the implications are both profound and far-reaching.',
    'In the final analysis, when all is said and done, the vicissitudes of fortune notwithstanding, we find ourselves confronting questions that have vexed philosophers throughout the ages. Such is the nature of inquiry at its most fundamental level.',
    'The discourse surrounding this issue has been characterized by a regrettable paucity of nuance. What is needed is not grandiloquent rhetoric but rather a perspicacious examination of the underlying assumptions that inform our collective understanding.',
  ]
  return texts[classNumber % texts.length]
}

export const C2_LESSONS_COMPLETE: Lesson[] = C2_CURRICULUM.map((topic, index) => ({
  id: `c2-${index + 1}`,
  level: 'C2' as const,
  order: index + 1,
  title: `${topic.grammarPattern} (C${topic.classNumber})`,
  objective: `Dominar ${topic.topicFunction.toLowerCase()} con nivel de maestría C2`,
  vocabulary: generateC2Vocabulary(topic.classNumber),
  grammar: generateC2Grammar(topic),
  exercises: generateC2Exercises(topic.classNumber, topic.grammarPattern),
  shadowingText: generateC2ShadowingText(topic.grammarPattern, topic.classNumber),
}))
