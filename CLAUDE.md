# General CLAUDE.md Startfile

A modern SvelteKit application template using Svelte 5 with TypeScript and Tailwind CSS 4.0. This template provides a solid foundation for building scalable web applications with the latest Svelte features and modern styling capabilities, optimized.

## Technology Stack

### Core Framework

- **Svelte 5** with SvelteKit
  - MANDATORY: Use Svelte 5 syntax exclusively (e.g., `onclick` not `on:click`)
  - MANDATORY: Use runes for reactivity (`$state`, `$derived`, `$effect`)
  - MANDATORY: Reference https://svelte.dev/llms-medium.txt for latest syntax

### Language & Styling

- **TypeScript** (strict mode enabled)
  - All `.svelte` files must use `<script lang="ts">`
  - Define interfaces for all component props
- **Tailwind CSS 4.0** for styling
  - MANDATORY: Use Tailwind CSS 4.0 utility classes exclusively for all styling
  - FORBIDDEN: Custom CSS files or `<style>` blocks (except for global base styles)
  - MANDATORY: Leverage Tailwind's design system and utility-first approach
  - MANDATORY: Use Tailwind's color palette, spacing, and typography scales
- **Prettier** for code formatting
- **ESLint** for code quality

## Development Guidelines

### Code Standards

- **Svelte 5 Event Syntax** (MANDATORY):
  - ✅ Use: `<button onclick={handleClick}>Click me</button>`
  - ❌ Never: `<button on:click={handleClick}>Click me</button>`
- **Svelte 5 Reactivity** (MANDATORY):
  - ✅ Use: `let count = $state(0)`
  - ❌ Never: `let count = 0` with reactive statements
- **TypeScript Interfaces** (MANDATORY):
  ```typescript
  interface Props {
  	title: string;
  	count?: number;
  }
  ```
- **Component Structure** (MANDATORY):

  ```svelte
  <script lang="ts">
  	interface Props {
  		// Define all props here
  	}

  	let { propName }: Props = $props();
  </script>
  ```

- **Naming Convention**: Use descriptive names, avoid comments when possible

## UI Component Standards

### Tailwind CSS 4.0 Implementation

This project uses **Tailwind CSS 4.0** exclusively for all styling. All UI elements must be styled using Tailwind's utility classes and design system.

### Key Requirements

1. **Utility-First Styling**:
   - Use Tailwind utility classes for all styling needs
   - Follow Tailwind's design system and naming conventions
   - Leverage Tailwind's responsive design utilities
   - Use Tailwind's color palette and spacing scale

2. **Available Styling Approaches**:
   - **Layout**: Flexbox (`flex`, `grid`) and positioning utilities
   - **Typography**: Font families, sizes, weights, and text utilities
   - **Colors**: Background, text, and border color utilities
   - **Spacing**: Margin, padding, and gap utilities
   - **Effects**: Shadows, transitions, and hover states
   - **Responsive**: Mobile-first responsive design utilities

### Styling Guidelines

- **Colors**: Use Tailwind's semantic color palette (`blue-600`, `gray-100`, `red-500`, etc.)
- **Spacing**: Follow Tailwind's spacing scale (`p-4`, `m-6`, `space-x-2`)
- **Typography**: Use Tailwind's typography utilities (`text-lg`, `font-semibold`, `leading-6`)
- **Responsive Design**: Leverage responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`)
- **State Variants**: Use hover, focus, and active state utilities (`hover:bg-blue-700`, `focus:ring-2`)

### Custom Component Creation

When creating new components:

1. Follow Tailwind's utility-first methodology
2. Use consistent spacing and color schemes
3. Implement proper responsive behavior
4. Include hover and focus states for int# Svelte Project Template

### Svelte 5 Component Patterns (MANDATORY)

#### Event Handling

```svelte
<!-- ✅ CORRECT: Svelte 5 -->
<button onclick={() => count++}>Click me</button>
<form onsubmit={handleSubmit}>

<!-- ❌ FORBIDDEN: Svelte 4 -->
<button on:click={() => count++}>Click me</button>
<form on:submit={handleSubmit}>
```


### Documentation Access

Check docs folder for any documentation.


## Form Standards

### Required Form Integration: Web3Forms

Use Web3Forms API (https://api.web3forms.com/submit) for all contact forms, feedback forms, and user input forms. Never implement custom backend form handlers or use other form services. Access key placeholder: YOUR_ACCESS_KEY_HERE (to be replaced with actual key).

### Svelte 5 Form Requirements

- Use $state rune for reactive form state management
- Use onsubmit event handler (not on:submit)
- Include proper loading states and error handling
- Always prevent default form submission behavior
- Use FormData API to collect form inputs

### Form Implementation Rules

- All forms must submit to Web3Forms endpoint
- Include access_key as hidden input
- Use JSON content-type for API requests
- Handle success/error states appropriately
- Provide user feedback during submission
- Reset form on successful submission

Reference the docs/web3forms-svelte5.md file for complete implementation examples.

## Claude Code Instructions

### UI/UX Development Requirements (MANDATORY)

**Screenshot-Driven Development Process:**

1. **Always use Puppeteer MCP** for taking screenshots during UI development
2. **Screenshot Evaluation**: After each UI change, take a screenshot and evaluate:
   - Visual design quality and modern aesthetics
   - Component spacing and alignment
   - Color scheme and contrast
   - Typography hierarchy and readability
   - User experience flow and intuitiveness
3. **Iterative Improvement**: Based on screenshot analysis, iterate to improve:
   - Design consistency across components
   - Visual appeal and professional appearance
   - Accessibility considerations
   - Mobile responsiveness verification```

### Responsive Design Verification (MANDATORY)

**MUST verify responsiveness across:**
- **Small devices** (320px-768px): Mobile phones
- **Medium devices** (768px-1024px): Tablets
- **Large devices** (1024px+): Desktops

### Code Generation Rules

1. **Svelte 5 Compliance**: Every component MUST use Svelte 5 syntax
2. **Screenshot Validation**: Take and analyze screenshots after significant UI changes

### Quality Assurance

### Forbidden Practices

- ❌ Svelte 4 syntax (`on:click`, reactive statements)
- ❌ Creating files unnecessarily
- ❌ TypeScript `any` type usage
- ❌ Custom form backends (use Web3Forms only)
- ❌ ShadCN/UI, DaisyUI or other UI libraries 
- ❌ Exceeding deployment provider (Vercel or Cloudflare)'s resource limits
- ❌ Non-responsive designs or layouts
- ❌ Skipping screenshot evaluation during UI development

---

## Environment Variables

- Real API keys go in `.env` files (never commit these)


## Project Documentation

- Product Requirements: See `docs/PRD.md`
- Authentication Doc: See `docs/lucia-auth.md`
- Form Submission Doc: See 'web3forms-svelte5.md'

```