# Implementation Plan: FounderOS AI

## Overview

FounderOS AI is an AI-powered SaaS platform that generates complete startup blueprints from a single sentence idea. This implementation plan is organized into 27 epics spanning 5 sprints, covering project setup through production deployment. Each task is independently implementable, testable, reviewable, and mergeable by a single engineer in one day.

**Technology Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, shadcn/ui, Prisma ORM, PostgreSQL (Supabase), Upstash Redis, Clerk Auth, Stripe, Vercel AI SDK + Google Gemini, Inngest, Vitest + Playwright + fast-check, Tiptap, Zustand + React Query.

**Sprint Plan:**
- Sprint 1 (Epics 1–6): Foundation — Project setup, database, auth, landing page, dashboard, workspace shell
- Sprint 2 (Epics 7–12): AI Core — AI infrastructure, Product Analyst, Market Researcher, Business Strategist, Technical Architect, Database Designer
- Sprint 3 (Epics 13–18): AI Agents + Content — API Planner, UI/UX Designer, Marketing, Roadmap, Investor, Content Editing
- Sprint 4 (Epics 19–23): Features — AI Chat, Billing, File Management, Data Export, Notes
- Sprint 5 (Epics 24–27): Polish — Responsive UI, Testing, Deployment, Documentation

## Tasks

### Epic 1: Project Setup

- [ ] 1. Initialize monorepo and core configuration
  - [-] 1.1 Initialize Turborepo monorepo with pnpm workspaces
    - Create root `package.json`, `turbo.json`, `pnpm-workspace.yaml`
    - Create `apps/web/` Next.js 14 app with App Router (`npx create-next-app`)
    - Create `packages/config/` for shared ESLint, TypeScript, Tailwind configs
    - Configure path aliases (`@/` for `apps/web/src`)
    - _Requirements: N/A (infrastructure)_

  - [-] 1.2 Configure TypeScript, ESLint, and Prettier
    - Create shared `tsconfig.base.json` in `packages/config/`
    - Configure ESLint with `@typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-next`
    - Set up Prettier with Tailwind plugin for consistent class ordering
    - Add `lint` and `format` scripts to root `package.json`
    - _Requirements: N/A (infrastructure)_

  - [~] 1.3 Configure Tailwind CSS and design tokens
    - Install Tailwind CSS 3.4 with PostCSS and Autoprefixer
    - Create `tailwind.config.ts` with custom colors, spacing, radius from design tokens
    - Set up dark theme as default with CSS variables
    - Create `styles/globals.css` with base layer customizations
    - Files: `apps/web/tailwind.config.ts`, `apps/web/styles/globals.css`
    - _Requirements: 15.1_

  - [~] 1.4 Set up shadcn/ui component library
    - Initialize shadcn/ui with `npx shadcn-ui@latest init`
    - Configure component output to `apps/web/components/ui/`
    - Install base components: Button, Card, Input, Dialog, Dropdown, Toast, Skeleton
    - Create `components/ui/index.ts` barrel export
    - _Requirements: 15.2_

  - [~] 1.5 Configure environment variables and Docker Compose for local dev
    - Create `.env.example` with all required environment variables
    - Create `docker-compose.yml` with PostgreSQL 16 and Redis services
    - Create `.env.local` template for Clerk, Stripe, Gemini, Supabase keys
    - Add environment variable validation with `@t3-oss/env-nextjs` + Zod
    - Files: `docker-compose.yml`, `.env.example`, `apps/web/lib/env.ts`
    - _Requirements: N/A (infrastructure)_

  - [~] 1.6 Set up CI/CD pipeline with GitHub Actions
    - Create `.github/workflows/ci.yml` for lint, type-check, test on PR
    - Create `.github/workflows/deploy-preview.yml` for Vercel preview deploys
    - Create `.github/workflows/deploy-production.yml` for main branch deploys
    - Configure caching for pnpm and Next.js build
    - _Requirements: N/A (infrastructure)_

- [~] 2. Checkpoint - Verify project setup
  - Ensure `pnpm dev` starts the Next.js app successfully
  - Ensure `pnpm lint` and `pnpm type-check` pass
  - Ensure Docker Compose starts PostgreSQL and Redis
  - Ensure all tests pass, ask the user if questions arise.

### Epic 2: Database & ORM

- [ ] 3. Set up Prisma and database schema
  - [~] 3.1 Initialize Prisma with PostgreSQL and create base schema
    - Install Prisma and `@prisma/client`
    - Create `prisma/schema.prisma` with User, Workspace, Section models
    - Configure Prisma to use Supabase connection string from env
    - Create `lib/db/client.ts` singleton Prisma client
    - Files: `apps/web/prisma/schema.prisma`, `apps/web/lib/db/client.ts`
    - _Requirements: 2.1, 13.1_

  - [~] 3.2 Complete Prisma schema with all models
    - Add SectionVersion, GenerationLog, ChatMessage, File, Subscription, CreditTransaction, Plan models
    - Define all relations, indexes, enums, and constraints
    - Add CHECK constraints via `@@map` and raw SQL migrations
    - Files: `apps/web/prisma/schema.prisma`
    - _Requirements: 2.1, 11.5, 14.1, 16.2_

  - [~] 3.3 Create initial migration and seed data
    - Run `prisma migrate dev --name init` to generate migration
    - Create `prisma/seed.ts` with plan data (Free, Pro, Team, Enterprise)
    - Add section type enum values and default workspace settings
    - Configure `prisma db seed` script
    - Files: `apps/web/prisma/migrations/`, `apps/web/prisma/seed.ts`
    - _Requirements: 14.1_

  - [~] 3.4 Create database service layer and query helpers
    - Create `lib/db/queries/workspace.queries.ts` (CRUD operations)
    - Create `lib/db/queries/section.queries.ts` (section CRUD, version management)
    - Create `lib/db/queries/user.queries.ts` (user sync, credit operations)
    - Implement tenant isolation middleware for Prisma
    - Files: `apps/web/lib/db/queries/`, `apps/web/lib/db/middleware/`
    - _Requirements: 13.3, 2.2, 2.4_

  - [ ]* 3.5 Write property tests for workspace and section invariants
    - **Property 2: Workspace Initialization Completeness** — verify 15 sections created
    - **Property 4: Workspace Name Validation** — verify 1-100 char acceptance
    - **Property 5: Workspace Deletion Cascade** — verify no orphaned records
    - **Validates: Requirements 2.1, 2.4, 2.5, 2.7**

- [~] 4. Checkpoint - Verify database layer
  - Ensure migrations apply cleanly to Docker PostgreSQL
  - Ensure seed data populates plans table correctly
  - Ensure all tests pass, ask the user if questions arise.

### Epic 3: Authentication

- [ ] 5. Integrate Clerk authentication
  - [~] 5.1 Install and configure Clerk with Next.js
    - Install `@clerk/nextjs`
    - Configure `ClerkProvider` in root layout
    - Create middleware.ts with `authMiddleware` protecting `/(dashboard)` routes
    - Set up sign-in and sign-up pages at `app/(auth)/sign-in/` and `app/(auth)/sign-up/`
    - Files: `apps/web/middleware.ts`, `apps/web/app/(auth)/`, `apps/web/app/layout.tsx`
    - _Requirements: 13.1, 13.5_

  - [~] 5.2 Create Clerk webhook for user sync
    - Create `app/api/webhooks/clerk/route.ts` to handle `user.created` and `user.updated`
    - Sync Clerk user data to local `users` table (clerkId, email, name, avatar)
    - Initialize new users with Free plan and 10 credits
    - Add webhook signature verification with `svix`
    - Files: `apps/web/app/api/webhooks/clerk/route.ts`
    - _Requirements: 13.1, 13.2, 14.1_

  - [~] 5.3 Create auth helpers and workspace authorization
    - Create `lib/auth/helpers.ts` with `getCurrentUser()`, `requireAuth()`, `authorizeWorkspace()`
    - Implement workspace ownership check middleware
    - Create session timeout configuration (30-minute inactivity)
    - Files: `apps/web/lib/auth/helpers.ts`, `apps/web/lib/auth/authorize.ts`
    - _Requirements: 13.3, 13.5, 13.7_

  - [ ]* 5.4 Write property tests for auth invariants
    - **Property 14: Workspace Access Authorization** — verify non-owner gets 403
    - **Property 15: Unauthenticated Request Redirect** — verify redirect preserves URL
    - **Validates: Requirements 13.3, 13.5**

### Epic 4: Landing Page

- [ ] 6. Build landing page
  - [~] 6.1 Create hero section with idea input CTA
    - Create `app/page.tsx` as the landing page with RSC
    - Build hero section with headline, subheadline, animated gradient background
    - Add startup idea input with character counter and submit button
    - Implement Framer Motion entrance animations
    - Files: `apps/web/app/page.tsx`, `apps/web/components/landing/hero.tsx`
    - _Requirements: 1.1, 15.1_

  - [~] 6.2 Create features section and social proof
    - Build feature cards grid showcasing AI modules (Product Analyst, Market Research, etc.)
    - Add animated icons with Lucide React
    - Create testimonials/social proof section (placeholder content)
    - Implement scroll-triggered animations with Framer Motion
    - Files: `apps/web/components/landing/features.tsx`, `apps/web/components/landing/social-proof.tsx`
    - _Requirements: 15.1_

  - [~] 6.3 Create pricing preview and footer
    - Build pricing cards showing Free, Pro, Team plans with feature comparison
    - Create footer with navigation links, legal links, social media
    - Add FAQ accordion section using shadcn Accordion
    - Files: `apps/web/components/landing/pricing.tsx`, `apps/web/components/landing/footer.tsx`
    - _Requirements: 14.1, 15.1_

  - [~] 6.4 Create shared navigation header
    - Build responsive navigation with logo, nav links, sign-in/sign-up buttons
    - Implement mobile hamburger menu with slide-out drawer
    - Add Clerk UserButton for authenticated users
    - Files: `apps/web/components/shared/header.tsx`, `apps/web/components/shared/mobile-nav.tsx`
    - _Requirements: 15.1, 15.3_

### Epic 5: Dashboard

- [ ] 7. Build workspace dashboard
  - [~] 7.1 Create dashboard layout and workspace list page
    - Create `app/(dashboard)/layout.tsx` with top navigation bar
    - Create `app/(dashboard)/dashboard/page.tsx` as server component
    - Fetch user workspaces sorted by `updatedAt` DESC
    - Implement workspace cards with name, idea preview, dates, status badge
    - Files: `apps/web/app/(dashboard)/layout.tsx`, `apps/web/app/(dashboard)/dashboard/page.tsx`
    - _Requirements: 2.2, 13.3_

  - [~] 7.2 Create workspace card and empty states
    - Build `WorkspaceCard` component with hover effects and action menu
    - Create empty state illustration for new users (no workspaces)
    - Add "Create new workspace" CTA card with idea input dialog
    - Implement workspace archive/delete actions with confirmation dialog
    - Files: `apps/web/components/workspace/workspace-card.tsx`, `apps/web/components/workspace/empty-state.tsx`
    - _Requirements: 2.2, 2.4, 2.5, 2.6_

  - [~] 7.3 Create workspace search, filter, and credits display
    - Add search input with debounced filtering on workspace name/idea
    - Create filter tabs for Active/Archived workspaces
    - Display remaining credits badge in dashboard header
    - Add workspace rename inline editing
    - Files: `apps/web/components/workspace/workspace-filters.tsx`, `apps/web/components/workspace/credits-badge.tsx`
    - _Requirements: 2.2, 2.4, 2.6, 14.2_

  - [~] 7.4 Create workspace creation flow (idea submission)
    - Create `CreateWorkspaceDialog` with idea text input (10-500 chars)
    - Implement Zod validation with error messages for too short/too long
    - Add server action to create workspace and initialize 15 sections
    - Redirect to new workspace on success
    - Files: `apps/web/components/workspace/create-workspace-dialog.tsx`, `apps/web/app/api/workspaces/route.ts`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6, 2.1_

  - [ ]* 7.5 Write property tests for workspace list and idea validation
    - **Property 1: Startup Idea Input Validation** — verify 10-500 char acceptance/rejection
    - **Property 3: Workspace List Sorting Invariant** — verify descending order by updatedAt
    - **Property 6: Archive State Transition** — verify archive/unarchive visibility
    - **Validates: Requirements 1.1, 1.3, 1.4, 2.2, 2.6**

- [~] 8. Checkpoint - Verify dashboard and workspace creation
  - Ensure workspace creation works end-to-end
  - Ensure workspace list displays correctly sorted
  - Ensure all tests pass, ask the user if questions arise.

### Epic 6: Workspace Shell

- [ ] 9. Build workspace layout and navigation
  - [~] 9.1 Create workspace layout with sidebar
    - Create `app/(dashboard)/workspace/[id]/layout.tsx`
    - Build collapsible sidebar with section navigation links
    - Implement active section highlighting based on current route
    - Add workspace name display and settings gear icon
    - Files: `apps/web/app/(dashboard)/workspace/[id]/layout.tsx`, `apps/web/components/workspace/sidebar.tsx`
    - _Requirements: 2.3, 15.3_

  - [~] 9.2 Create section navigation and breadcrumbs
    - Build breadcrumb component showing Dashboard > Workspace > Section
    - Create section route pages for all 15 sections as placeholder pages
    - Implement keyboard shortcut navigation (Cmd+K palette)
    - Add mobile bottom navigation for section switching
    - Files: `apps/web/components/shared/breadcrumbs.tsx`, `apps/web/app/(dashboard)/workspace/[id]/*/page.tsx`
    - _Requirements: 2.3, 15.1, 15.3_

  - [~] 9.3 Create workspace settings page
    - Build settings page with workspace rename form
    - Add danger zone with archive and delete workspace actions
    - Implement confirmation dialogs for destructive actions
    - Files: `apps/web/app/(dashboard)/workspace/[id]/settings/page.tsx`
    - _Requirements: 2.4, 2.5, 2.6, 2.7_

  - [~] 9.4 Set up Zustand stores and React Query configuration
    - Create workspace store (active section, sidebar state, generation status)
    - Configure React Query provider with default options
    - Create query keys factory for workspace, sections, chat
    - Implement optimistic update patterns for workspace mutations
    - Files: `apps/web/stores/workspace.store.ts`, `apps/web/lib/api/query-client.ts`, `apps/web/lib/api/query-keys.ts`
    - _Requirements: 2.2, 2.3_

### Epic 7: AI Infrastructure

- [ ] 10. Build AI provider abstraction layer
  - [~] 10.1 Create AI provider interface and Gemini implementation
    - Define `AIProvider` interface with `generateStream()` and `generateJSON()`
    - Implement `GeminiProvider` class using `@google/generative-ai` SDK
    - Add token estimation and model configuration
    - Create provider factory with environment-based initialization
    - Files: `apps/web/lib/ai/providers/base.provider.ts`, `apps/web/lib/ai/providers/gemini.provider.ts`
    - _Requirements: 3.1, 3.3_

  - [~] 10.2 Create AI Provider Registry and configuration
    - Implement `AIProviderRegistry` class with register/getProvider/setDefault
    - Create provider initialization in `lib/ai/index.ts`
    - Add environment variable validation for API keys
    - Create mock provider for testing
    - Files: `apps/web/lib/ai/provider-registry.ts`, `apps/web/lib/ai/index.ts`, `apps/web/lib/ai/providers/mock.provider.ts`
    - _Requirements: 3.1_

  - [~] 10.3 Create Context Builder service
    - Implement `ContextBuilder` class that fetches workspace data
    - Build `AgentContext` interface with startup idea, existing sections, metadata
    - Add context dependency graph (which agents need which prior sections)
    - Implement context caching with Redis (5-minute TTL)
    - Files: `apps/web/lib/ai/context-builder.ts`
    - _Requirements: 3.1, 3.2, 12.1_

  - [~] 10.4 Create Prompt Engine with template system
    - Implement `PromptEngine` class with template registration
    - Create `PromptTemplate` interface (system prompt, user prompt builder, temperature, tokens)
    - Add model selection logic (pro vs flash based on agent complexity)
    - Create prompt sanitization for injection prevention
    - Files: `apps/web/lib/ai/prompt-engine.ts`, `apps/web/lib/ai/safety/input-sanitizer.ts`
    - _Requirements: 3.1, 3.2_

  - [~] 10.5 Create Retry Manager with exponential backoff
    - Implement `RetryManager` with configurable retry count and backoff
    - Add retryable error classification (rate limit, timeout, server error)
    - Implement exponential backoff with jitter
    - Create retry status emission for streaming feedback
    - Files: `apps/web/lib/ai/retry-manager.ts`
    - _Requirements: 3.4, 3.5_

  - [~] 10.6 Create Stream Manager and SSE utilities
    - Implement `createSSEStream()` function producing ReadableStream
    - Define `StreamChunk` types (content, status, retry, metadata)
    - Create client-side SSE hook `useSSEGeneration()`
    - Add stream cleanup and error boundary handling
    - Files: `apps/web/lib/ai/stream-manager.ts`, `apps/web/hooks/use-sse-generation.ts`
    - _Requirements: 3.3, 15.5_

  - [~] 10.7 Create Credit Gate service
    - Implement `CreditService` with check/deduct/refund/getBalance/resetMonthly
    - Add atomic credit deduction (check + deduct in transaction)
    - Implement credit refund on generation failure
    - Create credit balance caching in Redis
    - Files: `apps/web/lib/billing/credit.service.ts`
    - _Requirements: 14.2, 14.3, 14.6, 14.8_

  - [~] 10.8 Create AI Orchestrator (core coordinator)
    - Implement `AIOrchestrator` class composing all AI services
    - Add section-to-agent mapping logic
    - Create orchestration flow: credit gate → context → prompt → stream → save
    - Implement generation status tracking in database
    - Files: `apps/web/lib/ai/orchestrator.ts`
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ]* 10.9 Write property tests for AI infrastructure
    - **Property 8: Retry Bounded Termination** — verify max 4 total attempts
    - **Property 16: Credit Deduction Arithmetic** — verify B-N balance or rejection
    - **Property 17: Credit Reset Idempotence** — verify reset sets exact plan credits
    - **Validates: Requirements 1.5, 3.4, 3.5, 14.3, 14.5, 14.6, 14.8**

- [~] 11. Checkpoint - Verify AI infrastructure
  - Ensure provider registry works with mock and real Gemini provider
  - Ensure credit deduction/refund logic is correct
  - Ensure retry manager respects max attempts
  - Ensure all tests pass, ask the user if questions arise.

### Epic 8: Product Analyst Agent

- [ ] 12. Implement Product Analyst AI agent
  - [~] 12.1 Create Product Analyst prompt template and output schema
    - Define Zod output schema for overview (description, problem, solution, targetAudience, valueProposition, assumptions[])
    - Create system prompt: "You are a product analyst at a top-tier VC firm"
    - Implement user prompt builder with startup idea context
    - Register template with PromptEngine (temperature 0.7, model gemini-1.5-flash)
    - Files: `apps/web/lib/ai/agents/product-analyst.ts`, `apps/web/lib/validators/overview.schema.ts`
    - _Requirements: 3.2_

  - [~] 12.2 Create Overview section generation API route
    - Create `app/api/generate/route.ts` POST handler
    - Implement auth → validate → authorize → credit check → generate → stream flow
    - Save generated content to sections table on stream completion
    - Update section `generationStatus` throughout lifecycle
    - Files: `apps/web/app/api/generate/route.ts`
    - _Requirements: 3.1, 3.3, 14.6_

  - [~] 12.3 Create Overview section UI with streaming display
    - Create `app/(dashboard)/workspace/[id]/overview/page.tsx`
    - Build `GenerationPanel` component with generate button and loading states
    - Implement streaming text display with typewriter effect
    - Add error boundary with retry button
    - Files: `apps/web/app/(dashboard)/workspace/[id]/overview/page.tsx`, `apps/web/components/ai/generation-panel.tsx`
    - _Requirements: 3.3, 3.4, 15.5_

  - [~] 12.4 Create generation error handling and retry UI
    - Implement retry button with attempt counter (max 3 retries)
    - Show persistent error after exhausted retries with support link
    - Add skeleton loading state during generation
    - Announce generation status to screen readers via ARIA live region
    - Files: `apps/web/components/ai/generation-error.tsx`, `apps/web/components/ai/generation-skeleton.tsx`
    - _Requirements: 3.4, 3.5, 15.5, 15.6_

  - [ ]* 12.5 Write property test for AI output validation
    - **Property 7: AI Output Structure Validation** — verify Product Analyst output has all required fields with minimum content
    - **Validates: Requirements 3.2**

### Epic 9: Market Researcher Agent

- [ ] 13. Implement Market Researcher AI agent
  - [~] 13.1 Create Market Researcher prompt template and output schema
    - Define Zod schema for market research (marketSize, demographics, trends, growth, competitors[], swot{})
    - Create system prompt: "You are a market research analyst"
    - Implement user prompt builder including overview context as dependency
    - Register template (temperature 0.5, model gemini-1.5-flash)
    - Files: `apps/web/lib/ai/agents/market-researcher.ts`, `apps/web/lib/validators/market-research.schema.ts`
    - _Requirements: 4.1, 4.2, 4.3_

  - [~] 13.2 Create Market Research section UI with collapsible sub-sections
    - Create `app/(dashboard)/workspace/[id]/market-research/page.tsx`
    - Build collapsible sections: Market Size, Competitors, SWOT, Growth Potential
    - Display competitor cards with strengths/weaknesses/positioning
    - Show SWOT matrix in 2x2 grid layout
    - Files: `apps/web/app/(dashboard)/workspace/[id]/market-research/page.tsx`, `apps/web/components/workspace/market-research/`
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [~] 13.3 Create Competitors section page
    - Create `app/(dashboard)/workspace/[id]/competitors/page.tsx`
    - Display competitor analysis with detailed cards
    - Add competitor comparison table
    - Implement generate/regenerate flow with streaming
    - Files: `apps/web/app/(dashboard)/workspace/[id]/competitors/page.tsx`
    - _Requirements: 4.2, 4.5_

  - [ ]* 13.4 Write property test for Market Researcher output validation
    - **Property 7: AI Output Structure Validation** — verify ≥3 competitors, ≥2 items per SWOT category
    - **Validates: Requirements 4.2, 4.3**

### Epic 10: Business Strategist Agent

- [ ] 14. Implement Business Strategist AI agent
  - [~] 14.1 Create Business Strategist prompt template and output schema
    - Define Zod schema for business model (canvas: 9 blocks, revenueModels: 2-5, pricingTiers: 2+)
    - Create system prompt: "You are a business strategist who has advised 100+ startups"
    - Implement user prompt builder including overview + market research context
    - Register template (temperature 0.6, model gemini-1.5-pro)
    - Files: `apps/web/lib/ai/agents/business-strategist.ts`, `apps/web/lib/validators/business-model.schema.ts`
    - _Requirements: 5.1, 5.2, 5.3_

  - [~] 14.2 Create Business Model section UI with card-based layout
    - Create `app/(dashboard)/workspace/[id]/business-model/page.tsx`
    - Build Business Model Canvas as 9-block grid layout
    - Create revenue model cards with description and mechanism
    - Display pricing tiers with comparison table
    - Files: `apps/web/app/(dashboard)/workspace/[id]/business-model/page.tsx`, `apps/web/components/workspace/business-model/`
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 14.3 Write property test for Business Strategist output validation
    - **Property 7: AI Output Structure Validation** — verify 9 canvas blocks, 2-5 revenue models, 2+ pricing tiers
    - **Validates: Requirements 5.1, 5.2, 5.3**

### Epic 11: Technical Architect Agent

- [ ] 15. Implement Technical Architect AI agent
  - [~] 15.1 Create Technical Architect prompt template and output schema
    - Define Zod schema for architecture (techStack: 3-8 items with justifications, architecture description, assumptions[])
    - Create system prompt: "You are a senior technical architect"
    - Implement user prompt builder with overview context
    - Register template (temperature 0.4, model gemini-1.5-pro)
    - Files: `apps/web/lib/ai/agents/technical-architect.ts`, `apps/web/lib/validators/architecture.schema.ts`
    - _Requirements: 6.1, 6.2, 6.5_

  - [~] 15.2 Create Architecture section UI
    - Create `app/(dashboard)/workspace/[id]/architecture/page.tsx`
    - Build tech stack display as categorized cards with justification tooltips
    - Display architecture diagram description in formatted markdown
    - Show assumptions section if present
    - Files: `apps/web/app/(dashboard)/workspace/[id]/architecture/page.tsx`, `apps/web/components/workspace/architecture/`
    - _Requirements: 6.1, 6.2, 6.5, 6.6_

  - [ ]* 15.3 Write property test for Technical Architect output validation
    - **Property 7: AI Output Structure Validation** — verify 3-8 tech stack items each with justification
    - **Validates: Requirements 6.1, 6.2**

### Epic 12: Database Designer Agent

- [ ] 16. Implement Database Designer AI agent
  - [~] 16.1 Create Database Designer prompt template and output schema
    - Define Zod schema for database (tables: 3+ with names, fields[], relationships[])
    - Create system prompt: "You are a database architect. Use PostgreSQL conventions."
    - Implement user prompt builder including architecture context
    - Register template (temperature 0.3, model gemini-1.5-flash)
    - Files: `apps/web/lib/ai/agents/database-designer.ts`, `apps/web/lib/validators/database.schema.ts`
    - _Requirements: 6.3_

  - [~] 16.2 Create Database section UI with schema visualization
    - Create `app/(dashboard)/workspace/[id]/database/page.tsx`
    - Display tables with field names, types, and constraints
    - Show relationships between tables with visual connectors
    - Add generate/regenerate flow with streaming
    - Files: `apps/web/app/(dashboard)/workspace/[id]/database/page.tsx`, `apps/web/components/workspace/database/`
    - _Requirements: 6.3, 6.6_

  - [ ]* 16.3 Write property test for Database Designer output validation
    - **Property 7: AI Output Structure Validation** — verify ≥3 tables with field definitions
    - **Validates: Requirements 6.3**

- [~] 17. Checkpoint - Verify AI agents (Product Analyst through Database Designer)
  - Ensure all 5 agents generate valid structured output
  - Ensure streaming works end-to-end in browser
  - Ensure credit deduction occurs correctly
  - Ensure all tests pass, ask the user if questions arise.

### Epic 13: API Planner Agent

- [ ] 18. Implement API Planner AI agent
  - [~] 18.1 Create API Planner prompt template and output schema
    - Define Zod schema for API design (endpoints: 5+ with path, method, description, request, response)
    - Create system prompt: "You are a backend API designer. Follow REST conventions."
    - Implement user prompt builder including database + architecture context
    - Register template (temperature 0.3, model gemini-1.5-flash)
    - Files: `apps/web/lib/ai/agents/api-planner.ts`, `apps/web/lib/validators/api-design.schema.ts`
    - _Requirements: 6.4_

  - [~] 18.2 Create API Design section UI
    - Create `app/(dashboard)/workspace/[id]/api-design/page.tsx`
    - Display endpoints in tabular format with method badges (GET, POST, etc.)
    - Show request/response structure in collapsible code blocks
    - Add generate/regenerate flow
    - Files: `apps/web/app/(dashboard)/workspace/[id]/api-design/page.tsx`, `apps/web/components/workspace/api-design/`
    - _Requirements: 6.4, 6.6_

  - [ ]* 18.3 Write property test for API Planner output validation
    - **Property 7: AI Output Structure Validation** — verify ≥5 endpoints with required fields
    - **Validates: Requirements 6.4**

### Epic 14: UI/UX Designer Agent

- [ ] 19. Implement UI/UX Designer AI agent
  - [~] 19.1 Create UI/UX Designer prompt template and output schema
    - Define Zod schema for UI/UX (userFlows: 3+, landingPage copy, wireframes: 3+, designSystem with colors and typography)
    - Create system prompt: "You are a product designer at a top design agency"
    - Implement user prompt builder including overview + target audience context
    - Register template (temperature 0.7, model gemini-1.5-flash)
    - Files: `apps/web/lib/ai/agents/ui-designer.ts`, `apps/web/lib/validators/ui-ux.schema.ts`
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [~] 19.2 Create UI/UX section UI with structured display
    - Create `app/(dashboard)/workspace/[id]/ui-ux/page.tsx`
    - Display user flows as step-by-step sequences
    - Show landing page copy in preview format
    - Display wireframe descriptions and design system (color swatches, typography)
    - Files: `apps/web/app/(dashboard)/workspace/[id]/ui-ux/page.tsx`, `apps/web/components/workspace/ui-ux/`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [ ]* 19.3 Write property test for UI/UX Designer output validation
    - **Property 7: AI Output Structure Validation** — verify ≥3 user flows, ≥3 wireframes, ≥5 colors, ≥2 typography pairs
    - **Validates: Requirements 7.1, 7.3, 7.4**

### Epic 15: Marketing Strategist Agent

- [ ] 20. Implement Marketing Strategist AI agent
  - [~] 20.1 Create Marketing Strategist prompt template and output schema
    - Define Zod schema (channels: 3+, seo: keywords 5+, launchChecklist: 3 tasks/phase, socialMedia: 3+ platforms with 2+ tactics)
    - Create system prompt: "You are a growth marketing expert"
    - Implement user prompt builder with overview + market + business model context
    - Register template (temperature 0.6, model gemini-1.5-flash)
    - Files: `apps/web/lib/ai/agents/marketing-strategist.ts`, `apps/web/lib/validators/marketing.schema.ts`
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [~] 20.2 Create Marketing section UI
    - Create `app/(dashboard)/workspace/[id]/marketing/page.tsx`
    - Display channels as strategy cards
    - Show SEO keywords in tag format, content strategy as list
    - Display launch checklist with phase tabs (pre-launch, launch-day, post-launch)
    - Show social media strategy per platform
    - Files: `apps/web/app/(dashboard)/workspace/[id]/marketing/page.tsx`, `apps/web/components/workspace/marketing/`
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ]* 20.3 Write property test for Marketing Strategist output validation
    - **Property 7: AI Output Structure Validation** — verify ≥3 channels, ≥5 keywords, ≥3 tasks per phase, ≥3 platforms
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4**

### Epic 16: Roadmap Planner Agent

- [ ] 21. Implement Roadmap Planner AI agent
  - [~] 21.1 Create Roadmap Planner prompt template and output schema
    - Define Zod schema (phases: MVP/Phase2/Phase3, milestones: 3+/phase, timelineWeeks: 2-26, features with impact/effort 1-5)
    - Create system prompt: "You are a product manager with startup experience"
    - Implement user prompt builder with architecture + database + API + business model context
    - Register template (temperature 0.5, model gemini-1.5-flash)
    - Files: `apps/web/lib/ai/agents/roadmap-planner.ts`, `apps/web/lib/validators/roadmap.schema.ts`
    - _Requirements: 9.1, 9.2, 9.3_

  - [~] 21.2 Create Roadmap section UI with timeline display
    - Create `app/(dashboard)/workspace/[id]/roadmap/page.tsx`
    - Display phases as timeline with milestone markers
    - Show features within each phase sorted by impact/effort ratio
    - Display estimated weeks per phase
    - Files: `apps/web/app/(dashboard)/workspace/[id]/roadmap/page.tsx`, `apps/web/components/workspace/roadmap/`
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ]* 21.3 Write property test for Roadmap feature priority ordering
    - **Property 18: Roadmap Feature Priority Ordering** — verify features ordered by descending impact/effort ratio
    - **Validates: Requirements 9.3**

### Epic 17: Investor Assistant Agent

- [ ] 22. Implement Investor Assistant AI agent
  - [~] 22.1 Create Investor Assistant prompt template and output schema
    - Define Zod schema (slides: 8 required types, content ≤150 words/slide, speakerNotes: 3-5/slide)
    - Create system prompt: "You are an investor relations expert"
    - Implement user prompt builder with ALL workspace sections as context
    - Register template (temperature 0.5, model gemini-1.5-pro)
    - Files: `apps/web/lib/ai/agents/investor-assistant.ts`, `apps/web/lib/validators/pitch-deck.schema.ts`
    - _Requirements: 10.1, 10.2, 10.3_

  - [~] 22.2 Create Pitch Deck section UI with slide cards
    - Create `app/(dashboard)/workspace/[id]/pitch-deck/page.tsx`
    - Display slides as card carousel with content and speaker notes toggle
    - Show word count indicator per slide
    - Mark placeholder content with visual indicator (assumptions badge)
    - Files: `apps/web/app/(dashboard)/workspace/[id]/pitch-deck/page.tsx`, `apps/web/components/workspace/pitch-deck/`
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ]* 22.3 Write property test for Investor Assistant output validation
    - **Property 7: AI Output Structure Validation** — verify 8 slides, ≤150 words/slide, 3-5 speaker notes/slide
    - **Validates: Requirements 10.1, 10.2, 10.3**

- [~] 23. Checkpoint - Verify all AI agents
  - Ensure all 10 AI agents produce valid structured output
  - Ensure context dependency chain works (later agents use earlier outputs)
  - Ensure all tests pass, ask the user if questions arise.

### Epic 18: Content Editing & Regeneration

- [ ] 24. Implement content editing with Tiptap
  - [~] 24.1 Set up Tiptap rich text editor component
    - Install Tiptap with extensions (StarterKit, Markdown, Placeholder, CharacterCount)
    - Create `ContentEditor` component wrapping Tiptap
    - Configure toolbar with formatting options (bold, italic, headings, lists, links)
    - Add markdown import/export capability
    - Files: `apps/web/components/editor/content-editor.tsx`, `apps/web/components/editor/toolbar.tsx`
    - _Requirements: 11.1_

  - [~] 24.2 Implement auto-save with debounce and version history
    - Add 3-second debounced auto-save on content change
    - Save changes to section table and create version entry
    - Implement version history panel (drawer) showing timestamp and source
    - Add version restore with confirmation
    - Files: `apps/web/hooks/use-auto-save.ts`, `apps/web/components/editor/version-history.tsx`, `apps/web/app/api/sections/[id]/versions/route.ts`
    - _Requirements: 11.2, 11.5, 11.6_

  - [~] 24.3 Implement content locking and selective regeneration
    - Add block-level lock toggle (lock icon on each content block)
    - Implement regeneration API that preserves locked content blocks
    - Show locked blocks with visual indicator (lock badge, slight opacity change)
    - Files: `apps/web/components/editor/lockable-block.tsx`, `apps/web/app/api/regenerate/route.ts`
    - _Requirements: 11.3, 11.4_

  - [ ]* 24.4 Write property tests for content editing invariants
    - **Property 9: Failure Preserves Existing Content** — verify content unchanged on failed regeneration
    - **Property 10: Locked Content Preservation Through Regeneration** — verify locked blocks unchanged
    - **Property 11: Version History Bounded Append** — verify max 50 entries with eviction
    - **Property 12: Version Restore Creates New Entry** — verify version count increments on restore
    - **Validates: Requirements 11.2, 11.3, 11.4, 11.5, 11.6**

- [~] 25. Checkpoint - Verify content editing
  - Ensure inline editing works with auto-save
  - Ensure version history displays correctly
  - Ensure locked blocks survive regeneration
  - Ensure all tests pass, ask the user if questions arise.

### Epic 19: AI Chat

- [ ] 26. Implement context-aware AI chat
  - [~] 26.1 Create AI Chat API route with workspace context
    - Create `app/api/workspaces/[id]/chat/route.ts` (POST for send, GET for history)
    - Implement context injection: fetch all workspace sections as chat context
    - Use Vercel AI SDK's `streamText()` for streaming responses
    - Deduct 1 credit per chat message
    - Files: `apps/web/app/api/workspaces/[id]/chat/route.ts`
    - _Requirements: 12.1, 12.2, 14.6_

  - [~] 26.2 Create AI Chat UI panel
    - Create `app/(dashboard)/workspace/[id]/chat/page.tsx`
    - Build message list with user/assistant message bubbles
    - Implement streaming response display with typing indicator
    - Add message input with 2000 character limit and send button
    - Persist and display chat history (most recent 200 messages)
    - Files: `apps/web/app/(dashboard)/workspace/[id]/chat/page.tsx`, `apps/web/components/ai/chat-panel.tsx`, `apps/web/components/ai/message-list.tsx`
    - _Requirements: 12.2, 12.4, 12.7_

  - [~] 26.3 Implement section change preview from chat
    - When AI suggests section changes, show preview modal with diff
    - Require user confirmation before applying changes
    - Apply confirmed changes and create version history entry
    - Handle clarifying questions when intent is unclear
    - Files: `apps/web/components/ai/change-preview-modal.tsx`, `apps/web/lib/ai/chat-section-updater.ts`
    - _Requirements: 12.3, 12.5_

  - [ ]* 26.4 Write property test for chat message validation
    - **Property 13: Chat Message Validation and Bounded History** — verify 1-2000 char acceptance, 200 message cap
    - **Validates: Requirements 12.2, 12.4, 12.7**

### Epic 20: Subscription & Billing

- [ ] 27. Implement Stripe subscription and credit system
  - [~] 27.1 Create Stripe integration and checkout flow
    - Install `stripe` and `@stripe/stripe-js`
    - Create `lib/billing/stripe.ts` with Stripe client initialization
    - Implement `app/api/billing/checkout/route.ts` for creating checkout sessions
    - Create billing/pricing page with plan selection
    - Files: `apps/web/lib/billing/stripe.ts`, `apps/web/app/api/billing/checkout/route.ts`, `apps/web/app/(dashboard)/billing/page.tsx`
    - _Requirements: 14.1, 14.4_

  - [~] 27.2 Create Stripe webhook handler for subscription events
    - Create `app/api/webhooks/stripe/route.ts`
    - Handle events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
    - Update user plan, credits, and subscription status in database
    - Handle upgrade (immediate) and downgrade (next cycle) logic
    - Files: `apps/web/app/api/webhooks/stripe/route.ts`
    - _Requirements: 14.4, 14.7_

  - [~] 27.3 Create credit display and management UI
    - Build credits badge showing remaining/total in dashboard header
    - Create credits usage history page with transaction log
    - Implement upgrade prompt when credits exhausted (no dead ends)
    - Add plan comparison modal for upgrade decisions
    - Files: `apps/web/components/billing/credits-display.tsx`, `apps/web/components/billing/upgrade-prompt.tsx`
    - _Requirements: 14.2, 14.3, 14.8_

  - [~] 27.4 Implement monthly credit reset with Inngest
    - Create Inngest function triggered on billing cycle anniversary
    - Reset credits to plan's `monthlyCredits` value (no carry-over)
    - Log credit reset in `credit_transactions` table
    - Files: `apps/web/lib/jobs/credit-reset.job.ts`
    - _Requirements: 14.5_

  - [ ]* 27.5 Write property tests for credit system
    - **Property 16: Credit Deduction Arithmetic** — verify exact B-N after deduction
    - **Property 17: Credit Reset Idempotence** — verify reset sets exact plan amount
    - **Validates: Requirements 14.3, 14.5, 14.6, 14.8**

### Epic 21: File Management

- [ ] 28. Implement file upload and management
  - [~] 28.1 Create file upload API and storage integration
    - Create `app/api/workspaces/[id]/files/route.ts` (POST upload, GET list, DELETE)
    - Implement Supabase Storage upload with path: `workspaces/{id}/files/{fileId}`
    - Validate file size (≤10MB), format (PDF, PNG, JPG, DOCX, TXT), count (≤50/workspace)
    - Files: `apps/web/app/api/workspaces/[id]/files/route.ts`, `apps/web/lib/services/file.service.ts`
    - _Requirements: 16.2, 16.4_

  - [~] 28.2 Create Files section UI
    - Create `app/(dashboard)/workspace/[id]/files/page.tsx`
    - Build file upload dropzone with drag-and-drop support
    - Display file list with filename, size, upload date, download button
    - Add delete confirmation dialog
    - Show clear error messages for validation failures (size, format, count)
    - Files: `apps/web/app/(dashboard)/workspace/[id]/files/page.tsx`, `apps/web/components/workspace/files/`
    - _Requirements: 16.2, 16.3, 16.4, 16.5_

  - [ ]* 28.3 Write property test for file upload validation
    - **Property 19: File Upload Validation** — verify size/format/count constraints and specific error messages
    - **Validates: Requirements 16.2, 16.4**

### Epic 22: Data Export

- [ ] 29. Implement workspace export (PDF and Markdown)
  - [~] 29.1 Create export API and PDF generation
    - Create `app/api/workspaces/[id]/export/route.ts` (POST to start export)
    - Implement PDF generation using `@react-pdf/renderer` or `puppeteer`
    - Include workspace name and export timestamp in header
    - Handle empty sections (heading only, no body content)
    - Upload generated file to Supabase Storage with 24h signed URL
    - Files: `apps/web/app/api/workspaces/[id]/export/route.ts`, `apps/web/lib/export/pdf-generator.ts`
    - _Requirements: 17.1, 17.3, 17.4, 17.5_

  - [~] 29.2 Create Markdown export and download UI
    - Implement Markdown export: concatenate all sections with proper headings
    - Create export modal with format selection (PDF/Markdown)
    - Show export progress indicator and download link on completion
    - Handle export timeout with error message and retry
    - Files: `apps/web/lib/export/markdown-generator.ts`, `apps/web/components/workspace/export-modal.tsx`
    - _Requirements: 17.2, 17.3, 17.4, 17.5, 17.6_

  - [ ]* 29.3 Write property test for export integrity
    - **Property 20: Export Document Integrity** — verify N section headings, workspace name, timestamp, empty section handling
    - **Validates: Requirements 17.2, 17.4, 17.5**

### Epic 23: Notes

- [ ] 30. Implement Notes section
  - [~] 30.1 Create Notes section with rich text editor
    - Create `app/(dashboard)/workspace/[id]/notes/page.tsx`
    - Reuse Tiptap `ContentEditor` component from Epic 18
    - Support: bold, italic, underline, headings, bulleted/numbered lists, hyperlinks
    - Implement auto-save with 3-second debounce
    - Files: `apps/web/app/(dashboard)/workspace/[id]/notes/page.tsx`
    - _Requirements: 16.1_

- [~] 31. Checkpoint - Verify features (Chat, Billing, Files, Export, Notes)
  - Ensure AI chat responds with workspace context
  - Ensure Stripe webhook updates plan and credits
  - Ensure file upload/download works end-to-end
  - Ensure export generates valid PDF and Markdown
  - Ensure all tests pass, ask the user if questions arise.

### Epic 24: Responsive UI & Accessibility

- [ ] 32. Implement responsive design and accessibility
  - [~] 32.1 Implement responsive layouts for all pages
    - Audit and fix all pages for viewport widths 320px to 2560px
    - Implement responsive sidebar (collapsible on mobile, drawer pattern)
    - Create mobile-optimized workspace navigation (bottom tabs)
    - Ensure no horizontal scrolling or content overlap at any viewport
    - _Requirements: 15.1_

  - [~] 32.2 Implement keyboard navigation and focus management
    - Add visible focus indicators to all interactive elements
    - Implement keyboard shortcuts: Tab navigation, Enter to submit, Escape to close
    - Add skip-to-content link
    - Ensure all primary workflows keyboard-accessible (idea submission, navigation, editing, chat, export)
    - _Requirements: 15.3, 15.4_

  - [~] 32.3 Implement ARIA attributes and screen reader support
    - Add ARIA live regions for AI generation status announcements
    - Ensure all interactive elements have accessible labels
    - Add ARIA landmarks (navigation, main, complementary)
    - Implement loading state announcements for assistive technologies
    - Verify color contrast meets WCAG AA (4.5:1 text, 3:1 UI components)
    - _Requirements: 15.2, 15.5, 15.6_

### Epic 25: Testing

- [ ] 33. Implement comprehensive test suite
  - [~] 33.1 Configure Vitest and testing infrastructure
    - Install Vitest, `@testing-library/react`, `fast-check`
    - Create `vitest.config.ts` with path aliases and coverage configuration
    - Create test utilities: mock Prisma client, mock AI provider, test fixtures
    - Set up test database with Docker for integration tests
    - Files: `apps/web/vitest.config.ts`, `apps/web/tests/setup.ts`, `apps/web/tests/utils/`
    - _Requirements: N/A (infrastructure)_

  - [~] 33.2 Write unit tests for validators and utilities
    - Test all Zod validators: idea, workspace name, chat message, file upload
    - Test credit arithmetic: deduction, refund, reset, balance check
    - Test prompt engine: template building, context assembly
    - Test stream chunk parsing and SSE serialization
    - Files: `apps/web/tests/unit/validators/`, `apps/web/tests/unit/services/`
    - _Requirements: 1.1, 1.3, 1.4, 2.4, 2.7, 14.6_

  - [~] 33.3 Write integration tests for API routes and services
    - Test workspace CRUD with real database operations
    - Test AI generation pipeline with mocked AI provider
    - Test credit deduction atomicity under concurrent requests
    - Test webhook processing (Clerk user sync, Stripe subscription events)
    - Test file upload validation and storage
    - Files: `apps/web/tests/integration/`
    - _Requirements: 2.1, 2.5, 3.1, 14.6, 16.2_

  - [ ]* 33.4 Write all property-based tests
    - Consolidate and run all 20 correctness properties with fast-check
    - Property 1: Idea input validation (10-500 chars)
    - Property 2: Workspace initialization (15 sections)
    - Property 3: Workspace list sorting (descending updatedAt)
    - Property 4: Workspace name validation (1-100 chars)
    - Property 5: Workspace deletion cascade (no orphans)
    - Property 6: Archive state transition
    - Property 7: AI output structure validation (all agents)
    - Property 8: Retry bounded termination (max 4 attempts)
    - Property 9: Failure preserves content
    - Property 10: Locked content preservation
    - Property 11: Version history bounded append (max 50)
    - Property 12: Version restore creates new entry
    - Property 13: Chat message validation and bounded history
    - Property 14: Workspace access authorization
    - Property 15: Unauthenticated request redirect
    - Property 16: Credit deduction arithmetic
    - Property 17: Credit reset idempotence
    - Property 18: Roadmap feature priority ordering
    - Property 19: File upload validation
    - Property 20: Export document integrity
    - Files: `apps/web/tests/properties/`
    - **Validates: All 20 correctness properties from design**

  - [~] 33.5 Configure Playwright and write E2E tests
    - Install Playwright with chromium browser
    - Create E2E tests for critical paths:
      - Signup → idea submission → workspace creation → overview generation
      - Navigate sections → trigger generation → view streaming content
      - Edit content → auto-save → version history → restore
      - Upgrade plan → verify credits → generate
    - Files: `apps/web/tests/e2e/`, `apps/web/playwright.config.ts`
    - _Requirements: 1.2, 3.3, 11.2, 14.4_

### Epic 26: Deployment & Monitoring

- [ ] 34. Set up production deployment and monitoring
  - [~] 34.1 Configure Vercel deployment and environment
    - Set up Vercel project linked to GitHub repository
    - Configure environment variables for production (Clerk, Stripe, Gemini, Supabase, Upstash keys)
    - Set up preview deployments for PRs
    - Configure custom domain and SSL
    - Files: `vercel.json`
    - _Requirements: N/A (infrastructure)_

  - [~] 34.2 Set up Supabase production database and migrations
    - Create Supabase production project
    - Configure database connection pooling (PgBouncer)
    - Run initial migrations against production database
    - Set up Supabase Storage buckets with RLS policies
    - Seed production plans data
    - _Requirements: N/A (infrastructure)_

  - [~] 34.3 Configure Sentry error tracking and Axiom logging
    - Install `@sentry/nextjs` and configure DSN
    - Create Sentry project with source maps upload
    - Install Axiom logger and configure structured logging
    - Add request ID tracking across API routes
    - Set up alert rules: error rate >5%, AI failure rate >10%
    - Files: `apps/web/sentry.client.config.ts`, `apps/web/sentry.server.config.ts`, `apps/web/lib/logging.ts`
    - _Requirements: N/A (infrastructure)_

  - [~] 34.4 Configure Inngest for production background jobs
    - Set up Inngest account and connect to Vercel deployment
    - Register all background functions (generation, credit reset, export)
    - Configure retry policies and concurrency limits
    - Files: `apps/web/app/api/inngest/route.ts`, `apps/web/lib/jobs/`
    - _Requirements: 3.1, 14.5_

  - [~] 34.5 Set up Upstash Redis for production caching
    - Create Upstash Redis instance with global replication
    - Configure rate limiting with Upstash Ratelimit
    - Implement caching for credit balance, workspace metadata, section content
    - Add cache invalidation on mutations
    - Files: `apps/web/lib/cache/redis.ts`, `apps/web/lib/middleware/rate-limit.ts`
    - _Requirements: 14.2_

### Epic 27: Documentation

- [ ] 35. Create project documentation
  - [~] 35.1 Create README and setup documentation
    - Write comprehensive README.md with project overview, architecture diagram, and tech stack
    - Create `docs/setup.md` with local development setup instructions
    - Document all environment variables with descriptions
    - Add `CONTRIBUTING.md` with code style, PR process, and branch strategy
    - Files: `README.md`, `docs/setup.md`, `CONTRIBUTING.md`
    - _Requirements: N/A (documentation)_

  - [~] 35.2 Create API documentation
    - Document all API endpoints with request/response examples
    - Create OpenAPI/Swagger specification file
    - Document webhook payload formats (Clerk, Stripe)
    - Document rate limiting policies and error codes
    - Files: `docs/api.md`, `docs/openapi.yaml`
    - _Requirements: N/A (documentation)_

  - [~] 35.3 Create architecture and deployment documentation
    - Document system architecture with diagrams
    - Create deployment guide for Vercel + Supabase + services
    - Document database schema and migration process
    - Create runbook for common operations (credit reset, data migration, provider swap)
    - Files: `docs/architecture.md`, `docs/deployment.md`, `docs/runbook.md`
    - _Requirements: N/A (documentation)_

- [~] 36. Final Checkpoint - Production readiness
  - Ensure all critical paths work in production environment
  - Ensure error tracking is capturing errors correctly
  - Ensure all 20 correctness properties pass
  - Ensure E2E tests pass against preview deployment
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout development
- Property tests validate the 20 universal correctness properties defined in the design document
- Unit tests validate specific examples and edge cases
- The dependency graph below determines which tasks can run in parallel
- Sprint 1 (Epics 1–6) establishes foundation; no AI features depend on it being incomplete
- Sprint 2 (Epics 7–12) can begin once database and auth are functional
- All AI agent epics (8–17) follow the same pattern and can be parallelized after Epic 7 completes

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3", "1.4", "1.5", "1.6"] },
    { "id": 2, "tasks": ["3.1", "3.2"] },
    { "id": 3, "tasks": ["3.3", "3.4", "3.5"] },
    { "id": 4, "tasks": ["5.1", "5.2", "5.3", "5.4"] },
    { "id": 5, "tasks": ["6.1", "6.2", "6.3", "6.4"] },
    { "id": 6, "tasks": ["7.1", "7.2", "7.3", "7.4", "7.5"] },
    { "id": 7, "tasks": ["9.1", "9.2", "9.3", "9.4"] },
    { "id": 8, "tasks": ["10.1", "10.2", "10.3", "10.4", "10.5", "10.6", "10.7"] },
    { "id": 9, "tasks": ["10.8", "10.9"] },
    { "id": 10, "tasks": ["12.1", "12.2", "12.3", "12.4", "12.5"] },
    { "id": 11, "tasks": ["13.1", "13.2", "13.3", "13.4", "14.1", "14.2", "14.3", "15.1", "15.2", "15.3"] },
    { "id": 12, "tasks": ["16.1", "16.2", "16.3"] },
    { "id": 13, "tasks": ["18.1", "18.2", "18.3", "19.1", "19.2", "19.3", "20.1", "20.2", "20.3"] },
    { "id": 14, "tasks": ["21.1", "21.2", "21.3", "22.1", "22.2", "22.3"] },
    { "id": 15, "tasks": ["24.1", "24.2", "24.3", "24.4"] },
    { "id": 16, "tasks": ["26.1", "26.2", "26.3", "26.4", "27.1", "27.2", "27.3", "27.4", "27.5"] },
    { "id": 17, "tasks": ["28.1", "28.2", "28.3", "29.1", "29.2", "29.3", "30.1"] },
    { "id": 18, "tasks": ["32.1", "32.2", "32.3"] },
    { "id": 19, "tasks": ["33.1"] },
    { "id": 20, "tasks": ["33.2", "33.3", "33.4", "33.5"] },
    { "id": 21, "tasks": ["34.1", "34.2", "34.3", "34.4", "34.5"] },
    { "id": 22, "tasks": ["35.1", "35.2", "35.3"] }
  ]
}
```
