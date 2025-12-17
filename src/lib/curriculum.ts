import { Lesson, Level, PlacementTestQuestion, Achievement } from './types'
import { C2_LESSONS_COMPLETE } from './c2-complete-lessons'
import { C1_LESSONS_COMPLETE } from './c1-generator'
import { A1_LESSONS_7_TO_30 } from './a1-lessons'
import { A2_CURRICULUM, B1_CURRICULUM, B2_CURRICULUM } from './complete-curriculum-data'

function generateLessonsFromCurriculum(curriculum: typeof A2_CURRICULUM, level: Level): Lesson[] {
  return curriculum.map((topic, index) => ({
    id: `${level.toLowerCase()}-${index + 1}`,
    level: level,
    order: index + 1,
    title: `${topic.grammarPattern} (C${topic.classNumber})`,
    objective: `Aprender y practicar: ${topic.topicFunction}`,
    vocabulary: generateVocabulary(topic.grammarPattern, topic.topicFunction),
    grammar: generateGrammar(topic.grammarPattern, topic.topicFunction),
    exercises: generateExercises(topic.grammarPattern, index + 1),
    shadowingText: generateShadowingText(topic.grammarPattern, topic.topicFunction),
    shadowingPhrases: generateShadowingPhrases(topic.grammarPattern, topic.topicFunction),
  }))
}

function generateA2Lessons(): Lesson[] {
  return generateLessonsFromCurriculum(A2_CURRICULUM, 'A2')
}

function generateB1Lessons(): Lesson[] {
  return generateLessonsFromCurriculum(B1_CURRICULUM, 'B1')
}

function generateB2Lessons(): Lesson[] {
  return generateLessonsFromCurriculum(B2_CURRICULUM, 'B2')
}

function generateVocabulary(grammar: string, topic: string) {
  const baseVocab = [
    { word: 'Example', translation: 'Ejemplo', example: 'This is an example sentence.', type: 'noun' as const },
    { word: 'Practice', translation: 'Práctica', example: 'I need more practice.', type: 'noun' as const },
    { word: 'Learn', translation: 'Aprender', example: 'I want to learn English.', type: 'verb' as const },
    { word: 'Understand', translation: 'Entender', example: 'I understand the lesson.', type: 'verb' as const },
    { word: 'Remember', translation: 'Recordar', example: 'I remember this rule.', type: 'verb' as const },
    { word: 'Improve', translation: 'Mejorar', example: 'My English is improving.', type: 'verb' as const },
    { word: 'Study', translation: 'Estudiar', example: 'I study every day.', type: 'verb' as const },
    { word: 'Review', translation: 'Repasar', example: 'Let\'s review the grammar.', type: 'verb' as const },
    { word: 'Progress', translation: 'Progreso', example: 'I\'m making progress.', type: 'noun' as const },
    { word: 'Complete', translation: 'Completar', example: 'I completed the exercise.', type: 'verb' as const },
    { word: 'Difficult', translation: 'Difícil', example: 'This is difficult.', type: 'adjective' as const },
    { word: 'Easy', translation: 'Fácil', example: 'This is easy.', type: 'adjective' as const },
    { word: 'Important', translation: 'Importante', example: 'This is important.', type: 'adjective' as const },
    { word: 'Useful', translation: 'Útil', example: 'This is very useful.', type: 'adjective' as const },
    { word: 'Necessary', translation: 'Necesario', example: 'Practice is necessary.', type: 'adjective' as const },
  ]
  return baseVocab
}

function generateGrammar(pattern: string, topic: string) {
  return {
    title: pattern,
    explanation: `En esta lección aprenderás sobre ${pattern.toLowerCase()} para ${topic.toLowerCase()}.`,
    examples: [
      'This is an example sentence showing the grammar pattern.',
      'Here is another example to help you understand.',
      'Practice makes perfect with these examples.',
      'The more you study, the better you become.',
    ],
    rules: [
      'Estudia la estructura del patrón gramatical',
      'Practica con los ejercicios proporcionados',
      'Escucha y repite los ejemplos en voz alta',
      'Aplica lo aprendido en contextos reales',
    ],
  }
}

function generateExercises(pattern: string, lessonNumber: number) {
  return [
    {
      id: `ex1-${lessonNumber}`,
      type: 'multiple-choice' as const,
      question: `Choose the correct form for: ${pattern}`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'Option B',
      explanation: 'Esta es la forma correcta según las reglas del patrón gramatical.',
    },
    {
      id: `ex2-${lessonNumber}`,
      type: 'fill-blank' as const,
      question: 'Complete the sentence with the correct form.',
      correctAnswer: 'correct',
      explanation: 'Recuerda aplicar la regla que acabas de aprender.',
    },
    {
      id: `ex3-${lessonNumber}`,
      type: 'multiple-choice' as const,
      question: 'Select the best option to complete this sentence.',
      options: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'],
      correctAnswer: 'Choice 2',
      explanation: 'Esta opción sigue correctamente el patrón gramatical.',
    },
  ]
}

function generateShadowingText(pattern: string, topic: string) {
  return `This is a shadowing exercise for ${pattern}. Listen carefully and repeat after the audio. Practice speaking naturally and with good pronunciation. The more you practice, the better your English will become. ${topic} is an important skill to master.`
}

function generateShadowingPhrases(pattern: string, topic: string) {
  return [
    { 
      text: `This is a shadowing exercise for ${pattern}. Listen carefully and repeat.`, 
      translation: `Este es un ejercicio de shadowing para ${pattern}. Escucha con atención y repite.` 
    },
    { 
      text: `Practice speaking naturally with good pronunciation and intonation.`, 
      translation: 'Practica hablando naturalmente con buena pronunciación y entonación.' 
    },
    { 
      text: `The more you practice, the better your English will become every day.`, 
      translation: 'Mientras más practiques, mejor será tu inglés cada día.' 
    },
    { 
      text: `${topic} is an important skill that you need to master.`, 
      translation: `${topic} es una habilidad importante que necesitas dominar.` 
    },
    { 
      text: 'Remember to focus on the rhythm and flow of the language.', 
      translation: 'Recuerda enfocarte en el ritmo y fluidez del idioma.' 
    },
  ]
}

export const LEVELS: Level[] = ['Beginner', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export const LEVEL_INFO: Record<Level, { title: string; description: string; lessons: number }> = {
  Beginner: {
    title: 'Principiante',
    description: 'Comienza tu viaje con saludos básicos y frases cotidianas',
    lessons: 5,
  },
  A1: {
    title: 'A1 - Elemental',
    description: 'Construye tu base con oraciones simples y situaciones comunes',
    lessons: 30,
  },
  A2: {
    title: 'A2 - Pre-Intermedio',
    description: 'Exprésate en tareas rutinarias y temas familiares',
    lessons: 40,
  },
  B1: {
    title: 'B1 - Intermedio',
    description: 'Maneja la mayoría de situaciones de viaje y discute temas familiares',
    lessons: 50,
  },
  B2: {
    title: 'B2 - Intermedio Alto',
    description: 'Interactúa con fluidez y comprende textos complejos',
    lessons: 60,
  },
  C1: {
    title: 'C1 - Avanzado',
    description: 'Expresa ideas con fluidez y usa el lenguaje con flexibilidad',
    lessons: 50,
  },
  C2: {
    title: 'C2 - Dominio',
    description: 'Domina el idioma con precisión y sutileza',
    lessons: 40,
  },
}

export const LESSONS: Record<Level, Lesson[]> = {
  Beginner: [
    {
      id: 'beginner-1',
      level: 'Beginner',
      order: 1,
      title: 'Greetings and Introductions',
      objective: 'Aprende cómo saludar a las personas y presentarte',
      vocabulary: [
        { word: 'Hello', translation: 'Hola', example: 'Hello, my name is John.', type: 'phrase' },
        { word: 'Goodbye', translation: 'Adiós', example: 'Goodbye, see you later!', type: 'phrase' },
        { word: 'Thank you', translation: 'Gracias', example: 'Thank you for your help.', type: 'phrase' },
        { word: 'Please', translation: 'Por favor', example: 'Please sit down.', type: 'phrase' },
        { word: 'Name', translation: 'Nombre', example: 'My name is Maria.', type: 'noun' },
      ],
      grammar: {
        title: 'Pronombres Personales y "To Be"',
        explanation: 'Los pronombres personales (I, you, he, she, it, we, they) se usan con el verbo "to be" (am, is, are) para presentarte a ti mismo y a otros.',
        examples: ['I am a student.', 'You are nice.', 'She is my friend.', 'We are learning English.'],
        rules: [
          'Usa "am" con I',
          'Usa "is" con he, she, it',
          'Usa "are" con you, we, they',
        ],
      },
      exercises: [
        {
          id: 'ex1',
          type: 'multiple-choice',
          question: 'How do you greet someone in the morning?',
          options: ['Good night', 'Good morning', 'Goodbye', 'Thank you'],
          correctAnswer: 'Good morning',
          explanation: 'We use "Good morning" to greet people before noon.',
        },
        {
          id: 'ex2',
          type: 'fill-blank',
          question: 'My name ___ John.',
          correctAnswer: 'is',
          explanation: 'We use "is" with singular subjects like "name".',
        },
        {
          id: 'ex3',
          type: 'multiple-choice',
          question: 'What is the correct response to "Thank you"?',
          options: ['Hello', 'You are welcome', 'Goodbye', 'Please'],
          correctAnswer: 'You are welcome',
          explanation: '"You are welcome" (or "You\'re welcome") is the polite response to "Thank you".',
        },
      ],
      shadowingText: 'Hello! My name is Alex. I am happy to meet you. How are you today?',
      shadowingPhrases: [
        { text: 'Hello! My name is Alex and I am very happy to meet you.', translation: '¡Hola! Mi nombre es Alex y estoy muy feliz de conocerte.' },
        { text: 'Good morning! How are you today? I am fine, thank you.', translation: '¡Buenos días! ¿Cómo estás hoy? Estoy bien, gracias.' },
        { text: 'Nice to meet you! What is your name?', translation: '¡Encantado de conocerte! ¿Cuál es tu nombre?' },
        { text: 'Thank you very much for your help. You are welcome.', translation: 'Muchas gracias por tu ayuda. De nada.' },
        { text: 'Goodbye! See you later. Have a nice day!', translation: '¡Adiós! Nos vemos luego. ¡Que tengas un buen día!' },
      ],
    },
    {
      id: 'beginner-2',
      level: 'Beginner',
      order: 2,
      title: 'Numbers and Counting',
      objective: 'Learn numbers from 1 to 100 and how to count',
      vocabulary: [
        { word: 'One', translation: 'Uno', example: 'I have one apple.', type: 'noun' },
        { word: 'Two', translation: 'Dos', example: 'There are two cats.', type: 'noun' },
        { word: 'Ten', translation: 'Diez', example: 'I can count to ten.', type: 'noun' },
        { word: 'Twenty', translation: 'Veinte', example: 'She is twenty years old.', type: 'noun' },
        { word: 'Hundred', translation: 'Cien', example: 'One hundred dollars.', type: 'noun' },
      ],
      grammar: {
        title: 'Numbers and Quantity',
        explanation: 'Numbers are used to count objects and express quantity. Learn cardinal numbers (one, two, three) for counting.',
        examples: ['I have three books.', 'There are five students.', 'She has twenty pencils.'],
        rules: [
          'Numbers 1-12 are unique words',
          'Numbers 13-19 end in -teen',
          'Multiples of 10 end in -ty',
        ],
      },
      exercises: [
        {
          id: 'ex1',
          type: 'multiple-choice',
          question: 'What comes after nineteen?',
          options: ['Eighteen', 'Twenty', 'Thirty', 'Twenty-one'],
          correctAnswer: 'Twenty',
          explanation: 'Twenty (20) comes after nineteen (19).',
        },
        {
          id: 'ex2',
          type: 'fill-blank',
          question: 'I have ___ hands.',
          correctAnswer: 'two',
          explanation: 'Humans have two hands.',
        },
      ],
      shadowingText: 'One, two, three, four, five. I can count from one to five. Six, seven, eight, nine, ten.',
      shadowingPhrases: [
        { text: 'One, two, three, four, five. I can count from one to five easily.', translation: 'Uno, dos, tres, cuatro, cinco. Puedo contar del uno al cinco fácilmente.' },
        { text: 'Six, seven, eight, nine, ten. Now I can count to ten!', translation: 'Seis, siete, ocho, nueve, diez. ¡Ahora puedo contar hasta diez!' },
        { text: 'I have three brothers and two sisters in my family.', translation: 'Tengo tres hermanos y dos hermanas en mi familia.' },
        { text: 'There are twenty students in our English class today.', translation: 'Hay veinte estudiantes en nuestra clase de inglés hoy.' },
        { text: 'This book costs fifteen dollars and fifty cents.', translation: 'Este libro cuesta quince dólares y cincuenta centavos.' },
      ],
    },
    {
      id: 'beginner-3',
      level: 'Beginner',
      order: 3,
      title: 'Colors and Objects',
      objective: 'Identify common colors and everyday objects',
      vocabulary: [
        { word: 'Red', translation: 'Rojo', example: 'The apple is red.', type: 'adjective' },
        { word: 'Blue', translation: 'Azul', example: 'The sky is blue.', type: 'adjective' },
        { word: 'Book', translation: 'Libro', example: 'I read a book.', type: 'noun' },
        { word: 'Table', translation: 'Mesa', example: 'The table is big.', type: 'noun' },
        { word: 'Chair', translation: 'Silla', example: 'Please sit on the chair.', type: 'noun' },
      ],
      grammar: {
        title: 'Articles and Adjectives',
        explanation: 'Articles (a, an, the) come before nouns. Adjectives describe nouns and usually come before them.',
        examples: ['A red car', 'An old book', 'The blue house', 'A beautiful day'],
        rules: [
          'Use "a" before consonant sounds',
          'Use "an" before vowel sounds',
          'Use "the" for specific things',
        ],
      },
      exercises: [
        {
          id: 'ex1',
          type: 'multiple-choice',
          question: 'Choose the correct article: ___ apple is red.',
          options: ['A', 'An', 'The', 'Some'],
          correctAnswer: 'The',
          explanation: 'We use "the" when talking about a specific apple.',
        },
        {
          id: 'ex2',
          type: 'fill-blank',
          question: 'The sky is ___.',
          correctAnswer: 'blue',
          explanation: 'The sky is typically blue in color.',
        },
      ],
      shadowingText: 'This is a red book. That is a blue chair. The table is brown. I like green and yellow.',
      shadowingPhrases: [
        { text: 'This is a red book on the table. It is very interesting.', translation: 'Este es un libro rojo sobre la mesa. Es muy interesante.' },
        { text: 'That is a blue chair in the corner of the room.', translation: 'Esa es una silla azul en la esquina de la habitación.' },
        { text: 'The table is brown and very old, but it is still beautiful.', translation: 'La mesa es marrón y muy vieja, pero todavía es hermosa.' },
        { text: 'I like green and yellow colors because they are bright and cheerful.', translation: 'Me gustan los colores verde y amarillo porque son brillantes y alegres.' },
        { text: 'Look at that white car. It is new and very expensive.', translation: 'Mira ese carro blanco. Es nuevo y muy caro.' },
      ],
    },
    {
      id: 'beginner-4',
      level: 'Beginner',
      order: 4,
      title: 'Family and Relationships',
      objective: 'Talk about family members and relationships',
      vocabulary: [
        { word: 'Mother', translation: 'Madre', example: 'My mother is kind.', type: 'noun' },
        { word: 'Father', translation: 'Padre', example: 'His father works hard.', type: 'noun' },
        { word: 'Sister', translation: 'Hermana', example: 'I have one sister.', type: 'noun' },
        { word: 'Brother', translation: 'Hermano', example: 'My brother is tall.', type: 'noun' },
        { word: 'Friend', translation: 'Amigo/a', example: 'She is my best friend.', type: 'noun' },
      ],
      grammar: {
        title: 'Possessive Adjectives',
        explanation: 'Possessive adjectives (my, your, his, her, its, our, their) show ownership.',
        examples: ['My mother', 'Your sister', 'His father', 'Her brother', 'Our family'],
        rules: [
          'My - belongs to me',
          'Your - belongs to you',
          'His/Her - belongs to him/her',
        ],
      },
      exercises: [
        {
          id: 'ex1',
          type: 'multiple-choice',
          question: 'Choose the correct possessive: This is ___ mother.',
          options: ['I', 'my', 'me', 'mine'],
          correctAnswer: 'my',
          explanation: 'We use "my" as a possessive adjective before a noun.',
        },
        {
          id: 'ex2',
          type: 'fill-blank',
          question: 'She loves ___ family.',
          correctAnswer: 'her',
          explanation: 'We use "her" to show something belongs to a female person.',
        },
      ],
      shadowingText: 'This is my family. My mother is Maria. My father is John. I have one sister and one brother.',
      shadowingPhrases: [
        { text: 'This is my family. We live together in a big house in the city.', translation: 'Esta es mi familia. Vivimos juntos en una casa grande en la ciudad.' },
        { text: 'My mother is Maria. She is a teacher and she loves her job.', translation: 'Mi madre es María. Ella es maestra y ama su trabajo.' },
        { text: 'My father is John. His work is very important and he travels a lot.', translation: 'Mi padre es John. Su trabajo es muy importante y viaja mucho.' },
        { text: 'I have one sister and one brother. They are both younger than me.', translation: 'Tengo una hermana y un hermano. Ambos son menores que yo.' },
        { text: 'Our family is very happy. We spend a lot of time together.', translation: 'Nuestra familia es muy feliz. Pasamos mucho tiempo juntos.' },
      ],
    },
    {
      id: 'beginner-5',
      level: 'Beginner',
      order: 5,
      title: 'Daily Activities',
      objective: 'Describe simple daily activities and routines',
      vocabulary: [
        { word: 'Eat', translation: 'Comer', example: 'I eat breakfast.', type: 'verb' },
        { word: 'Sleep', translation: 'Dormir', example: 'I sleep at night.', type: 'verb' },
        { word: 'Work', translation: 'Trabajar', example: 'She works every day.', type: 'verb' },
        { word: 'Study', translation: 'Estudiar', example: 'We study English.', type: 'verb' },
        { word: 'Play', translation: 'Jugar', example: 'They play soccer.', type: 'verb' },
      ],
      grammar: {
        title: 'Simple Present Tense',
        explanation: 'Use simple present to talk about habits, routines, and general facts.',
        examples: ['I eat breakfast every day.', 'She works at a hospital.', 'They study English.'],
        rules: [
          'Add -s for he, she, it',
          'I/you/we/they + base verb',
          'He/she/it + verb + s',
        ],
      },
      exercises: [
        {
          id: 'ex1',
          type: 'multiple-choice',
          question: 'She ___ every morning.',
          options: ['study', 'studies', 'studying', 'studied'],
          correctAnswer: 'studies',
          explanation: 'With "she", we add -ies to "study".',
        },
        {
          id: 'ex2',
          type: 'fill-blank',
          question: 'I ___ breakfast at 8 AM.',
          correctAnswer: 'eat',
          explanation: 'With "I", we use the base form of the verb.',
        },
      ],
      shadowingText: 'Every day, I wake up at 7 AM. I eat breakfast. Then I go to work. In the evening, I study English.',
      shadowingPhrases: [
        { text: 'Every day, I wake up at 7 AM and start my morning routine.', translation: 'Todos los días, me despierto a las 7 AM y comienzo mi rutina matutina.' },
        { text: 'I eat a healthy breakfast with eggs, toast, and orange juice.', translation: 'Como un desayuno saludable con huevos, tostadas y jugo de naranja.' },
        { text: 'Then I go to work by bus. The trip takes about thirty minutes.', translation: 'Luego voy al trabajo en autobús. El viaje toma alrededor de treinta minutos.' },
        { text: 'In the evening, I study English for one hour at home.', translation: 'Por la tarde, estudio inglés durante una hora en casa.' },
        { text: 'After dinner, I watch TV and then I sleep at 11 PM.', translation: 'Después de cenar, veo TV y luego duermo a las 11 PM.' },
      ],
    },
  ],
  A1: [
    {
      id: 'a1-1',
      level: 'A1',
      order: 1,
      title: 'Asking Questions',
      objective: 'Form and answer basic questions',
      vocabulary: [
        { word: 'What', translation: 'Qué', example: 'What is your name?', type: 'phrase' },
        { word: 'Where', translation: 'Dónde', example: 'Where do you live?', type: 'phrase' },
        { word: 'When', translation: 'Cuándo', example: 'When is your birthday?', type: 'phrase' },
        { word: 'Why', translation: 'Por qué', example: 'Why are you happy?', type: 'phrase' },
        { word: 'How', translation: 'Cómo', example: 'How are you?', type: 'phrase' },
      ],
      grammar: {
        title: 'Question Formation',
        explanation: 'Questions start with question words (what, where, when, why, how) or auxiliary verbs (do, does, is, are).',
        examples: ['What is your name?', 'Where do you live?', 'Are you happy?', 'Do you like pizza?'],
        rules: [
          'Question word + verb + subject',
          'Use "do/does" for present simple questions',
          'Invert subject and "be" for "be" questions',
        ],
      },
      exercises: [
        {
          id: 'ex1',
          type: 'multiple-choice',
          question: '___ is your name?',
          options: ['What', 'Where', 'When', 'Why'],
          correctAnswer: 'What',
          explanation: 'We use "What" to ask about things, including names.',
        },
        {
          id: 'ex2',
          type: 'fill-blank',
          question: '___ do you live?',
          correctAnswer: 'Where',
          explanation: 'We use "Where" to ask about locations.',
        },
      ],
      shadowingText: 'What is your name? Where are you from? How old are you? When is your birthday?',
      shadowingPhrases: [
        { text: 'What is your name? My name is Carlos and I am from Mexico.', translation: '¿Cuál es tu nombre? Mi nombre es Carlos y soy de México.' },
        { text: 'Where are you from? I am from Spain, but I live in the United States now.', translation: '¿De dónde eres? Soy de España, pero vivo en Estados Unidos ahora.' },
        { text: 'How old are you? I am twenty-five years old and I work as a teacher.', translation: '¿Cuántos años tienes? Tengo veinticinco años y trabajo como maestro.' },
        { text: 'When is your birthday? My birthday is in December, on the tenth.', translation: '¿Cuándo es tu cumpleaños? Mi cumpleaños es en diciembre, el día diez.' },
        { text: 'Why do you study English? Because I need it for my job and I love learning languages.', translation: '¿Por qué estudias inglés? Porque lo necesito para mi trabajo y amo aprender idiomas.' },
      ],
    },
    {
      id: 'a1-2',
      level: 'A1',
      order: 2,
      title: 'Shopping and Prices',
      objective: 'Learn vocabulary for shopping and discussing prices',
      vocabulary: [
        { word: 'Buy', translation: 'Comprar', example: 'I want to buy shoes.', type: 'verb' },
        { word: 'Price', translation: 'Precio', example: 'What is the price?', type: 'noun' },
        { word: 'Money', translation: 'Dinero', example: 'I need more money.', type: 'noun' },
        { word: 'Expensive', translation: 'Caro', example: 'This car is expensive.', type: 'adjective' },
        { word: 'Cheap', translation: 'Barato', example: 'These shoes are cheap.', type: 'adjective' },
      ],
      grammar: {
        title: 'Want and Need',
        explanation: 'Use "want" for desires and "need" for necessities, followed by "to" + verb or a noun.',
        examples: ['I want to buy a book.', 'She needs a new phone.', 'They want coffee.'],
        rules: [
          'Want/need + to + verb',
          'Want/need + noun',
          'How much is/are...? for prices',
        ],
      },
      exercises: [
        {
          id: 'ex1',
          type: 'multiple-choice',
          question: 'I ___ to buy a new phone.',
          options: ['want', 'wants', 'wanting', 'wanted'],
          correctAnswer: 'want',
          explanation: 'With "I", we use "want" (base form).',
        },
        {
          id: 'ex2',
          type: 'fill-blank',
          question: 'How much ___ this shirt?',
          correctAnswer: 'is',
          explanation: 'We use "is" with singular items when asking about price.',
        },
      ],
      shadowingText: 'I want to buy a new shirt. How much is it? Is it expensive? No, it is cheap. I will buy it.',
      shadowingPhrases: [
        { text: 'I want to buy a new shirt for the party next week.', translation: 'Quiero comprar una camisa nueva para la fiesta la próxima semana.' },
        { text: 'Excuse me, how much is this beautiful jacket?', translation: 'Disculpe, ¿cuánto cuesta esta chaqueta hermosa?' },
        { text: 'Is it expensive? No, it is cheap. It only costs thirty dollars.', translation: '¿Es cara? No, es barata. Solo cuesta treinta dólares.' },
        { text: 'I will buy it. Do you accept credit cards?', translation: 'La compraré. ¿Aceptan tarjetas de crédito?' },
        { text: 'These shoes are on sale. I need to buy two pairs.', translation: 'Estos zapatos están en oferta. Necesito comprar dos pares.' },
      ],
    },
    {
      id: 'a1-3',
      level: 'A1',
      order: 3,
      title: 'Food and Meals',
      objective: 'Talk about food preferences and meals',
      vocabulary: [
        { word: 'Food', translation: 'Comida', example: 'I love Italian food.', type: 'noun' },
        { word: 'Drink', translation: 'Bebida', example: 'Water is a healthy drink.', type: 'noun' },
        { word: 'Delicious', translation: 'Delicioso', example: 'This pizza is delicious.', type: 'adjective' },
        { word: 'Hungry', translation: 'Hambriento', example: 'I am hungry.', type: 'adjective' },
        { word: 'Thirsty', translation: 'Sediento', example: 'She is thirsty.', type: 'adjective' },
      ],
      grammar: {
        title: 'Like, Love, Prefer',
        explanation: 'Use these verbs to express preferences about food and other things.',
        examples: ['I like apples.', 'She loves chocolate.', 'We prefer tea to coffee.'],
        rules: [
          'Like/love/prefer + noun',
          'Like/love/prefer + verb-ing',
          'Prefer A to B',
        ],
      },
      exercises: [
        {
          id: 'ex1',
          type: 'multiple-choice',
          question: 'I ___ pizza very much.',
          options: ['like', 'likes', 'liking', 'liked'],
          correctAnswer: 'like',
          explanation: 'With "I", we use "like" without -s.',
        },
        {
          id: 'ex2',
          type: 'fill-blank',
          question: 'She ___ chocolate cake.',
          correctAnswer: 'loves',
          explanation: 'With "she", we add -s to "love".',
        },
      ],
      shadowingText: 'I like pizza and pasta. My favorite food is sushi. I love chocolate. Do you prefer tea or coffee?',
      shadowingPhrases: [
        { text: 'I like pizza and pasta because they are delicious Italian foods.', translation: 'Me gustan la pizza y la pasta porque son deliciosas comidas italianas.' },
        { text: 'My favorite food is sushi. I eat it every weekend at a Japanese restaurant.', translation: 'Mi comida favorita es el sushi. Lo como cada fin de semana en un restaurante japonés.' },
        { text: 'I love chocolate, especially dark chocolate with almonds.', translation: 'Amo el chocolate, especialmente el chocolate oscuro con almendras.' },
        { text: 'Do you prefer tea or coffee? I prefer coffee in the morning.', translation: '¿Prefieres té o café? Prefiero el café por la mañana.' },
        { text: 'My sister is hungry. Let\'s go to a restaurant for dinner.', translation: 'Mi hermana tiene hambre. Vamos a un restaurante a cenar.' },
      ],
    },
    {
      id: 'a1-4',
      level: 'A1',
      order: 4,
      title: 'Time and Schedules',
      objective: 'Tell time and talk about schedules',
      vocabulary: [
        { word: 'Time', translation: 'Tiempo/Hora', example: 'What time is it?', type: 'noun' },
        { word: 'Clock', translation: 'Reloj', example: 'Look at the clock.', type: 'noun' },
        { word: 'Morning', translation: 'Mañana', example: 'I wake up in the morning.', type: 'noun' },
        { word: 'Afternoon', translation: 'Tarde', example: 'We meet in the afternoon.', type: 'noun' },
        { word: 'Night', translation: 'Noche', example: 'Good night!', type: 'noun' },
      ],
      grammar: {
        title: 'Telling Time',
        explanation: 'Use "It is" or "It\'s" followed by the time. Use "at" for specific times.',
        examples: ['It is 3 o\'clock.', 'It\'s half past two.', 'I wake up at 7 AM.'],
        rules: [
          'Use o\'clock for exact hours',
          'Use "past" for minutes after the hour',
          'Use "to" for minutes before the hour',
        ],
      },
      exercises: [
        {
          id: 'ex1',
          type: 'multiple-choice',
          question: 'What time is it? It\'s three ___.',
          options: ['o\'clock', 'clock', 'hours', 'time'],
          correctAnswer: 'o\'clock',
          explanation: 'We use "o\'clock" for exact hours.',
        },
        {
          id: 'ex2',
          type: 'fill-blank',
          question: 'I go to bed ___ 10 PM.',
          correctAnswer: 'at',
          explanation: 'We use "at" for specific times.',
        },
      ],
      shadowingText: 'What time is it? It is eight o\'clock. I wake up at seven in the morning. I go to bed at ten at night.',
      shadowingPhrases: [
        { text: 'What time is it now? It is eight o\'clock in the morning.', translation: '¿Qué hora es ahora? Son las ocho de la mañana.' },
        { text: 'I wake up at seven every morning and take a shower.', translation: 'Me despierto a las siete todas las mañanas y me ducho.' },
        { text: 'My English class starts at half past nine and finishes at eleven.', translation: 'Mi clase de inglés comienza a las nueve y media y termina a las once.' },
        { text: 'I go to bed at ten at night because I am very tired.', translation: 'Me acuesto a las diez de la noche porque estoy muy cansado.' },
        { text: 'The meeting is at quarter past three in the afternoon.', translation: 'La reunión es a las tres y cuarto de la tarde.' },
      ],
    },
    {
      id: 'a1-5',
      level: 'A1',
      order: 5,
      title: 'Weather and Seasons',
      objective: 'Describe weather conditions and seasons',
      vocabulary: [
        { word: 'Weather', translation: 'Clima', example: 'The weather is nice today.', type: 'noun' },
        { word: 'Sunny', translation: 'Soleado', example: 'It is sunny outside.', type: 'adjective' },
        { word: 'Rain', translation: 'Lluvia', example: 'I like the rain.', type: 'noun' },
        { word: 'Cold', translation: 'Frío', example: 'It is cold in winter.', type: 'adjective' },
        { word: 'Hot', translation: 'Caliente', example: 'Summer is hot.', type: 'adjective' },
      ],
      grammar: {
        title: 'Weather Expressions',
        explanation: 'Use "It is" or "It\'s" to describe weather. Weather is always singular.',
        examples: ['It is sunny.', 'It is raining.', 'It is cold today.', 'The weather is nice.'],
        rules: [
          'It is + adjective (sunny, cold, hot)',
          'It is + verb-ing (raining, snowing)',
          'The weather is + adjective',
        ],
      },
      exercises: [
        {
          id: 'ex1',
          type: 'multiple-choice',
          question: '___ is sunny today.',
          options: ['It', 'This', 'There', 'Weather'],
          correctAnswer: 'It',
          explanation: 'We use "It" to talk about weather.',
        },
        {
          id: 'ex2',
          type: 'fill-blank',
          question: 'It is ___ outside. I need a jacket.',
          correctAnswer: 'cold',
          explanation: 'When we need a jacket, it means the weather is cold.',
        },
      ],
      shadowingText: 'How is the weather today? It is sunny and warm. I love spring. In winter, it is very cold and sometimes it snows.',
      shadowingPhrases: [
        { text: 'How is the weather today? It is sunny and warm, perfect for a walk in the park.', translation: '¿Cómo está el clima hoy? Está soleado y cálido, perfecto para un paseo en el parque.' },
        { text: 'I love spring because the flowers bloom and the weather is beautiful.', translation: 'Amo la primavera porque las flores florecen y el clima es hermoso.' },
        { text: 'In winter, it is very cold and sometimes it snows heavily.', translation: 'En invierno, hace mucho frío y a veces nieva mucho.' },
        { text: 'Summer is my favorite season. It is hot and I can go to the beach.', translation: 'El verano es mi estación favorita. Hace calor y puedo ir a la playa.' },
        { text: 'It is raining outside. Don\'t forget to take your umbrella!', translation: 'Está lloviendo afuera. ¡No olvides llevar tu paraguas!' },
      ],
    },
    {
      id: 'a1-6',
      level: 'A1',
      order: 6,
      title: 'Places in the City',
      objective: 'Name and locate places in a city',
      vocabulary: [
        { word: 'Bank', translation: 'Banco', example: 'The bank is on Main Street.', type: 'noun' },
        { word: 'Hospital', translation: 'Hospital', example: 'She works at a hospital.', type: 'noun' },
        { word: 'Restaurant', translation: 'Restaurante', example: 'Let\'s eat at a restaurant.', type: 'noun' },
        { word: 'Park', translation: 'Parque', example: 'Children play in the park.', type: 'noun' },
        { word: 'Store', translation: 'Tienda', example: 'I buy food at the store.', type: 'noun' },
      ],
      grammar: {
        title: 'Prepositions of Place',
        explanation: 'Use prepositions (in, on, at, next to, near, between) to describe locations.',
        examples: ['The bank is on Main Street.', 'The park is next to the school.', 'I am at home.'],
        rules: [
          'Use "at" for specific locations',
          'Use "on" for streets',
          'Use "in" for cities/countries',
        ],
      },
      exercises: [
        {
          id: 'ex1',
          type: 'multiple-choice',
          question: 'The restaurant is ___ the bank.',
          options: ['next to', 'next', 'to next', 'near to'],
          correctAnswer: 'next to',
          explanation: 'We use "next to" to show something is beside something else.',
        },
        {
          id: 'ex2',
          type: 'fill-blank',
          question: 'I live ___ New York.',
          correctAnswer: 'in',
          explanation: 'We use "in" for cities.',
        },
      ],
      shadowingText: 'There is a bank on Main Street. The hospital is next to the park. The restaurant is near my house. I go to the store every day.',
      shadowingPhrases: [
        { text: 'There is a bank on Main Street, between the post office and the pharmacy.', translation: 'Hay un banco en la Calle Principal, entre la oficina de correos y la farmacia.' },
        { text: 'The hospital is next to the park. It is a very large and modern building.', translation: 'El hospital está al lado del parque. Es un edificio muy grande y moderno.' },
        { text: 'The restaurant is near my house, so I can walk there in five minutes.', translation: 'El restaurante está cerca de mi casa, así que puedo caminar hasta allí en cinco minutos.' },
        { text: 'I go to the store every day to buy fresh bread and milk.', translation: 'Voy a la tienda todos los días para comprar pan y leche frescos.' },
        { text: 'There is a beautiful park in the center of the city where families go on weekends.', translation: 'Hay un parque hermoso en el centro de la ciudad donde las familias van los fines de semana.' },
      ],
    },
    ...A1_LESSONS_7_TO_30,
  ],
  A2: generateA2Lessons(),
  B1: generateB1Lessons(),
  B2: generateB2Lessons(),
  C1: C1_LESSONS_COMPLETE,
  C2: C2_LESSONS_COMPLETE,
}

export const PLACEMENT_TEST_QUESTIONS: PlacementTestQuestion[] = [
  {
    id: 'pt-1',
    question: 'Hello! My name ___ Maria.',
    options: ['am', 'is', 'are', 'be'],
    correctAnswer: 'is',
    level: 'Beginner',
    difficultyScore: 1,
  },
  {
    id: 'pt-2',
    question: 'I ___ to the store yesterday.',
    options: ['go', 'goes', 'went', 'going'],
    correctAnswer: 'went',
    level: 'A1',
    difficultyScore: 2,
  },
  {
    id: 'pt-3',
    question: 'She ___ tennis every Sunday.',
    options: ['play', 'plays', 'playing', 'played'],
    correctAnswer: 'plays',
    level: 'A1',
    difficultyScore: 2,
  },
  {
    id: 'pt-4',
    question: 'This book is ___ than that one.',
    options: ['good', 'better', 'best', 'more good'],
    correctAnswer: 'better',
    level: 'A2',
    difficultyScore: 3,
  },
  {
    id: 'pt-5',
    question: 'I ___ to Paris last year.',
    options: ['have been', 'was', 'been', 'am'],
    correctAnswer: 'was',
    level: 'A2',
    difficultyScore: 3,
  },
  {
    id: 'pt-6',
    question: 'If I ___ time, I would travel more.',
    options: ['have', 'had', 'will have', 'would have'],
    correctAnswer: 'had',
    level: 'B1',
    difficultyScore: 4,
  },
  {
    id: 'pt-7',
    question: 'The report ___ by the team yesterday.',
    options: ['completed', 'was completed', 'is completed', 'completes'],
    correctAnswer: 'was completed',
    level: 'B1',
    difficultyScore: 4,
  },
  {
    id: 'pt-8',
    question: 'I wish I ___ more languages.',
    options: ['speak', 'spoke', 'spoken', 'speaking'],
    correctAnswer: 'spoke',
    level: 'B2',
    difficultyScore: 5,
  },
  {
    id: 'pt-9',
    question: 'By next year, I ___ here for ten years.',
    options: ['work', 'worked', 'will have worked', 'have worked'],
    correctAnswer: 'will have worked',
    level: 'B2',
    difficultyScore: 5,
  },
  {
    id: 'pt-10',
    question: 'Had I known about the meeting, I ___ attended.',
    options: ['would have', 'will have', 'had', 'have'],
    correctAnswer: 'would have',
    level: 'C1',
    difficultyScore: 6,
  },
]

export const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'unlockedAt'>[] = [
  {
    id: 'first-lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: 'Book',
  },
  {
    id: 'week-streak',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'Flame',
  },
  {
    id: 'month-streak',
    title: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: 'Fire',
  },
  {
    id: 'level-complete',
    title: 'Level Up!',
    description: 'Complete all lessons in a level',
    icon: 'Trophy',
  },
  {
    id: 'perfect-score',
    title: 'Perfectionist',
    description: 'Score 100% on a lesson',
    icon: 'Star',
  },
  {
    id: 'ten-lessons',
    title: 'Dedicated Learner',
    description: 'Complete 10 lessons',
    icon: 'Target',
  },
  {
    id: 'fifty-lessons',
    title: 'Learning Champion',
    description: 'Complete 50 lessons',
    icon: 'Medal',
  },
]