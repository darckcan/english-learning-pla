# Planning Guide

A streamlined build configuration panel that allows developers to select their preferred compilation method for deploying applications.

**Experience Qualities**:
1. **Clear** - Options are immediately understandable with helpful descriptions
2. **Professional** - Clean, technical aesthetic appropriate for developer tools
3. **Efficient** - Quick selection process with minimal friction

**Complexity Level**: Micro Tool (single-purpose application)
This is a focused interface for selecting a build method - a single decision point with clear options.

## Essential Features

### Build Method Selection
- **Functionality**: User selects one of three build methods (Dockerfile, Buildpacks, or Nixpacks)
- **Purpose**: Determines how the application will be compiled and deployed
- **Trigger**: User clicks on a radio button option
- **Progression**: View panel → Read options → Select method → (Optional) Click documentation link
- **Success criteria**: User can clearly identify differences between options and make an informed selection

### Documentation Links
- **Functionality**: Clickable links that open relevant documentation
- **Purpose**: Provides additional context for users unfamiliar with build methods
- **Trigger**: User clicks underlined "docs" or "documentación" links
- **Progression**: Click link → Opens documentation in new tab
- **Success criteria**: Links are visually distinct and open correct documentation

### Visual Feedback
- **Functionality**: Selected option is visually highlighted
- **Purpose**: Confirms user's selection
- **Trigger**: Clicking a radio button
- **Progression**: Hover over option → Click → See selection highlight
- **Success criteria**: Clear visual distinction between selected and unselected states

## Edge Case Handling
- **No Selection**: Panel can display without a pre-selected option
- **External Links**: Documentation links handle cases where they might be unavailable
- **Long Descriptions**: Text wraps appropriately on narrow screens

## Design Direction

Professional and minimal, evoking a sense of technical precision and clarity. The design should feel like a modern developer tool - clean, efficient, and distraction-free.

## Color Selection

A neutral, technical palette with subtle purple/blue accents for interactive elements.

- **Primary Color**: oklch(0.50 0.08 270) - Muted purple-blue for headings and primary text, communicates professionalism and technical focus
- **Secondary Colors**: 
  - oklch(0.65 0.05 270) - Lighter purple-gray for secondary text
  - oklch(0.45 0.12 270) - Deeper purple for interactive elements
- **Accent Color**: oklch(0.55 0.15 270) - Rich purple for links and selected states
- **Foreground/Background Pairings**: 
  - Background (Light Gray oklch(0.98 0.005 270)): Dark text oklch(0.25 0.01 270) - Ratio 14.2:1 ✓
  - Card (White oklch(1 0 0)): Primary text oklch(0.50 0.08 270) - Ratio 7.8:1 ✓
  - Accent (Purple oklch(0.55 0.15 270)): White text oklch(1 0 0) - Ratio 5.2:1 ✓

## Font Selection

Clean, technical sans-serif fonts that prioritize readability and modern aesthetics - Inter for body text (excellent legibility) and JetBrains Mono for technical terms.

- **Typographic Hierarchy**:
  - H1 (Panel Title): Inter SemiBold/24px/normal spacing
  - Radio Option Title: Inter Medium/16px/tight spacing
  - Description Text: Inter Regular/14px/relaxed spacing/leading-relaxed
  - Links: Inter Regular/14px/underlined

## Animations

Animations should be subtle and functional - enhancing usability without calling attention to themselves. Gentle hover states on interactive elements and smooth selection transitions create a polished feel.

- Hover transitions on cards and radio buttons (200ms ease)
- Radio button selection with smooth border color change (150ms)
- Link underline slide-in effect on hover (200ms)

## Component Selection

- **Components**: 
  - Card (shadcn) for the main panel container
  - RadioGroup (shadcn) for build method selection
  - Label (shadcn) for option titles and descriptions
- **Customizations**: 
  - Custom card styling with radio options that expand to show full descriptions
  - Inline link styling that matches documentation link patterns
- **States**: 
  - Radio buttons: default (outlined circle), hover (subtle border highlight), selected (filled with accent color)
  - Cards: default (white bg), hover (subtle shadow increase)
  - Links: default (underlined), hover (color shift to brighter purple)
- **Icon Selection**: 
  - FileCode for Dockerfile option
  - Package for Buildpacks option
  - Cube for Nixpacks option
- **Spacing**: 
  - Card padding: p-6
  - Option spacing: gap-4 between radio options
  - Text spacing: mb-1 between title and description
- **Mobile**: 
  - Stack vertically with full-width cards
  - Maintain comfortable touch targets (min 44px)
  - Reduce padding slightly on mobile (p-4)
