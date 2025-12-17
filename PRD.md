# English Learning Platform

A progressive English learning platform that guides students from Beginner through C2 levels with structured lessons, interactive exercises, and achievement tracking.

**Experience Qualities**:
1. **Encouraging** - Creates a supportive environment that celebrates small wins and maintains motivation through streaks and achievements
2. **Structured** - Provides clear learning paths with sequential lessons that build upon each other logically
3. **Interactive** - Engages learners with varied exercise types and immediate feedback to reinforce understanding

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This platform requires sophisticated state management for user progress, multi-step lesson flows, adaptive testing, achievement systems, and role-based access. It orchestrates multiple interconnected features including lesson progression, exercise evaluation, streak tracking, and level advancement.

## Essential Features

### User Authentication & Onboarding
- **Functionality**: User login/registration with role assignment (student/teacher)
- **Purpose**: Personalizes the learning experience and tracks individual progress
- **Trigger**: App launch or logout
- **Progression**: Landing page → Login/Register form → Placement test (new users) → Dashboard
- **Success criteria**: User can create account, login persists, placement test assigns appropriate starting level

### Placement Test
- **Functionality**: Adaptive assessment that determines starting level based on vocabulary and grammar knowledge
- **Purpose**: Places students at the appropriate difficulty level to maximize learning efficiency
- **Trigger**: First-time user after registration
- **Progression**: Welcome screen → Multiple choice questions (increasing difficulty) → Score calculation → Level assignment → Dashboard
- **Success criteria**: Test adapts to user responses, accurately assigns level, results persist

### Level-Based Curriculum
- **Functionality**: Seven levels (Beginner, A1, A2, B1, B2, C1, C2) each with sequential lessons
- **Purpose**: Structures learning journey from basic to advanced proficiency
- **Trigger**: User selects current level from dashboard
- **Progression**: Dashboard → Level overview → Lesson list → Individual lesson → Completion → Next lesson unlocked
- **Success criteria**: Lessons unlock sequentially, completion tracked, level advancement requires finishing all lessons

### Interactive Lessons
- **Functionality**: Multi-section lessons covering vocabulary, grammar, comprehension, and production
- **Purpose**: Teaches language skills through varied content and exercise types
- **Trigger**: User clicks on available lesson
- **Progression**: Lesson intro (objective) → Vocabulary section → Grammar explanation → Practice exercises → Shadowing exercise → Quiz → Results & progress update
- **Success criteria**: Content displays correctly, exercises accept input, scoring works, progress saves

### Exercise Types
- **Functionality**: Multiple choice, fill-in-the-blank, matching, sentence construction, pronunciation practice
- **Purpose**: Reinforces learning through active practice and immediate feedback
- **Trigger**: During lesson flow or practice mode
- **Progression**: Exercise prompt → User input → Validation → Feedback (correct/incorrect with explanation) → Next exercise or summary
- **Success criteria**: All exercise types function, validation accurate, feedback helpful

### Progress Tracking
- **Functionality**: Displays lessons completed, current level, percentage progress, daily streak, total points
- **Purpose**: Motivates continued learning by visualizing advancement and consistency
- **Trigger**: Accessible from dashboard at any time
- **Progression**: Dashboard overview → Detailed stats → Achievement gallery → Level history
- **Success criteria**: Metrics update in real-time, streak increments daily, visual progress indicators accurate

### Achievement System
- **Functionality**: Unlocks badges for milestones (first lesson, 7-day streak, level completion, perfect scores)
- **Purpose**: Gamifies learning to increase engagement and celebrate accomplishments
- **Trigger**: Automatically when criteria met
- **Progression**: Achievement unlocked notification → Badge added to profile → Display in achievement gallery
- **Success criteria**: Achievements trigger correctly, notifications appear, badges persist

### Daily Streak
- **Functionality**: Counts consecutive days with at least one completed lesson
- **Purpose**: Builds consistent learning habit
- **Trigger**: Completes any lesson
- **Progression**: Lesson completion → Streak check → Increment or reset → Dashboard update → Milestone notification (if 7, 30, 100 days)
- **Success criteria**: Streak increments only once per calendar day, resets after 24hr gap, survives page refresh

### Teacher Dashboard (Simplified)
- **Functionality**: View all student progress, completion rates, and activity
- **Purpose**: Enables monitoring and support
- **Trigger**: Teacher role login
- **Progression**: Login → Teacher dashboard → Student list → Individual student detail → Progress charts
- **Success criteria**: Displays aggregated data, shows recent activity, filters by level

## Edge Case Handling

- **Incomplete Lessons** - Save progress mid-lesson, allow resume from last completed section
- **Streak Breaks** - Show "streak at risk" warning if no activity in 20+ hours, display broken streak with recovery encouragement
- **Level Misplacement** - Allow manual level change by teacher or retake placement test option
- **No Internet During Exercise** - Queue answers locally, sync when reconnected with visual indicator
- **Rapid Clicking** - Debounce submission buttons, disable during processing
- **Empty States** - Show motivational messages when no lessons completed yet, achievement gallery empty, or student list empty
- **Exercise Timeouts** - Auto-save partial progress if user navigates away
- **Concurrent Sessions** - Use KV store as single source of truth, latest write wins

## Design Direction

The design should feel like a personal language tutor - encouraging, organized, and accessible. It should balance professionalism with warmth, using color to indicate progress and success while maintaining clarity. The interface should reduce anxiety around language learning by feeling spacious and uncluttered, with clear visual hierarchies that guide attention to the current learning task. Subtle celebratory moments (achievement unlocks, streak milestones) should feel rewarding without being distracting.

## Color Selection

A calm, education-focused palette that uses green to represent growth and progress, blue for trust and structure, with warm accents for celebration.

- **Primary Color**: Deep Teal `oklch(0.55 0.12 200)` - Communicates learning, growth, and forward progress; used for primary CTAs and progress indicators
- **Secondary Colors**: 
  - Soft Blue `oklch(0.70 0.10 230)` - Supportive background for lesson cards and secondary information
  - Sage Green `oklch(0.75 0.08 150)` - Success states, completed lessons, streak indicators
- **Accent Color**: Warm Coral `oklch(0.70 0.15 35)` - Achievement celebrations, milestone notifications, and important CTAs
- **Foreground/Background Pairings**: 
  - Primary Teal `oklch(0.55 0.12 200)`: White text `oklch(1 0 0)` - Ratio 5.2:1 ✓
  - Accent Coral `oklch(0.70 0.15 35)`: White text `oklch(1 0 0)` - Ratio 4.9:1 ✓
  - Background `oklch(0.98 0.01 200)`: Dark text `oklch(0.25 0.02 220)` - Ratio 12.4:1 ✓
  - Card `oklch(1 0 0)`: Dark text `oklch(0.25 0.02 220)` - Ratio 14.1:1 ✓

## Font Selection

Typography should feel modern, approachable, and highly legible for extended reading - crucial for language learning content.

- **Primary**: Outfit (headings, UI elements) - A friendly geometric sans with excellent clarity
- **Secondary**: Inter (body text, lesson content) - Optimized for screen reading with clear letterforms

- **Typographic Hierarchy**:
  - H1 (Page Titles): Outfit Bold / 36px / -0.02em letter spacing / 1.1 line height
  - H2 (Section Headers): Outfit Semibold / 28px / -0.01em letter spacing / 1.2 line height
  - H3 (Lesson Titles): Outfit Medium / 20px / 0em letter spacing / 1.3 line height
  - Body (Lesson Content): Inter Regular / 16px / 0em letter spacing / 1.6 line height
  - Caption (Metadata): Inter Medium / 14px / 0.01em letter spacing / 1.4 line height
  - Button: Outfit Semibold / 15px / 0.02em letter spacing / 1

## Animations

Animations should reinforce learning moments and guide attention without creating distraction. Use motion to celebrate achievements (bouncy scales, confetti), smooth transitions between lesson sections (gentle slides), and subtle feedback on interactions (button presses, correct/incorrect indicators). Progress bars should animate fills to make advancement feel tangible. Keep durations quick (200-300ms) except for celebrations (500ms). Reduce motion for accessibility preferences.

## Component Selection

- **Components**: 
  - Navigation: Tabs for level selection, Breadcrumb for lesson navigation
  - Content: Card for lesson containers, Accordion for collapsible grammar explanations, Progress for lesson/level completion
  - Forms: Input for text exercises, RadioGroup for multiple choice, Button for submissions and navigation
  - Feedback: Alert for instructions, Badge for achievements, Sonner toast for success/error notifications
  - Layout: Sheet for mobile menu, Dialog for achievement celebrations and level-up moments
  - Data: Table for teacher dashboard student lists
  
- **Customizations**:
  - LessonCard: Card with progress bar footer, locked/unlocked states, level difficulty indicator
  - ExerciseContainer: Custom component with question counter, timer, skip/hint buttons
  - StreakDisplay: Flame icon with count, pulsing animation, "at risk" warning state
  - AchievementBadge: Custom SVG badges with metallic gradient fills, unlock animation

- **States**:
  - Buttons: Default teal, hover with slight scale and brightness increase, active with pressed shadow, disabled at 40% opacity
  - Inputs: Default with subtle border, focus with primary ring and slight elevation, error with red border and shake animation, success with green border
  - Cards: Default flat, hover with subtle lift shadow, active with border highlight, locked with grayscale filter and lock icon overlay

- **Icon Selection**:
  - Lessons: Book, BookOpen for active lesson
  - Progress: ChartBar, Target for goals
  - Achievements: Trophy, Medal, Star for different badge types
  - Streak: Flame, Fire
  - Levels: TrendingUp, GraduationCap
  - Navigation: House, User, Gear
  - Exercise actions: Check, X, ArrowRight, Lightbulb for hints
  - Social: Chat, Users for teacher view

- **Spacing**:
  - Page padding: p-6 (24px) on mobile, p-8 (32px) on desktop
  - Card internal padding: p-4 (16px) standard, p-6 (24px) for lesson content
  - Section gaps: gap-4 (16px) for related items, gap-6 (24px) between sections, gap-8 (32px) between major page areas
  - Form spacing: space-y-4 for form fields, gap-2 for inline labels
  - Grid spacing: grid with gap-4 for lesson cards

- **Mobile**:
  - Navigation becomes bottom tab bar on mobile with icons only
  - Lesson cards stack vertically in single column
  - Exercise layouts simplify to full-width single-column
  - Teacher dashboard table becomes accordion list with expandable rows
  - Sheet component for settings and profile on mobile vs sidebar on desktop
  - Font sizes reduce slightly (H1: 28px, body: 15px) below 640px
  - Reduce padding to p-4 on mobile for more content space
