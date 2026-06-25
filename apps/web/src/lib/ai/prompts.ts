import type { BlueprintSection } from "@/lib/constants/sections";

interface PromptContext {
  startupName: string;
  startupIdea: string;
  industry?: string | null;
  startupStage?: string | null;
}

function baseContext(ctx: PromptContext): string {
  let context = `Startup Name: ${ctx.startupName}\nStartup Idea: ${ctx.startupIdea}`;
  if (ctx.industry) context += `\nIndustry: ${ctx.industry}`;
  if (ctx.startupStage) context += `\nStage: ${ctx.startupStage}`;
  return context;
}

const PROMPT_TEMPLATES: Record<BlueprintSection, (ctx: PromptContext) => string> = {
  overview: (ctx) => `You are a senior startup advisor and product strategist.

Analyze this startup idea and generate a comprehensive overview.

${baseContext(ctx)}

Generate the following in well-structured Markdown:

## Product Description
A clear, compelling description of what this product does and why it matters.

## Problem Statement
The specific problem this startup solves. Who experiences it? How painful is it?

## Proposed Solution
How this startup solves the problem. What makes the approach unique?

## Target Audience
Who are the primary users? Include demographics, behaviors, and needs.

## Unique Value Proposition
One clear sentence that explains why this is different and better than alternatives.

## Key Assumptions
List 3-5 critical assumptions that need to be validated.

Be specific, actionable, and tailored to this exact startup idea. Avoid generic advice.`,

  "product-analysis": (ctx) => `You are a senior product manager at a top-tier startup.

Conduct a detailed product analysis for this startup.

${baseContext(ctx)}

Generate the following in well-structured Markdown:

## User Personas
Create 2-3 detailed user personas with goals, pain points, and behaviors.

## Core Features
List the essential features for an MVP, prioritized by impact.

## Competitive Positioning
How does this product differentiate from existing solutions?

## User Journey
Map the key steps from discovery to becoming an active user.

## Feature Prioritization
Categorize features into Must Have, Should Have, Could Have, Won't Have (MoSCoW).

## Success Metrics
What KPIs will indicate product-market fit?

Be specific to this startup. Use concrete examples.`,

  "market-research": (ctx) => `You are a market research analyst at a leading consulting firm.

Conduct comprehensive market research for this startup.

${baseContext(ctx)}

Generate the following in well-structured Markdown:

## Market Size
Estimate TAM, SAM, and SOM with reasoning. Use logical bottom-up estimates.

## Target Demographics
Detailed profile of the target market segments.

## Market Trends
3-5 relevant trends driving demand for this solution.

## Competitor Analysis
Identify 3-5 competitors. For each: name, description, strengths, weaknesses, market positioning.

## SWOT Analysis
### Strengths
### Weaknesses
### Opportunities
### Threats

## Growth Potential
Market growth projections and opportunity assessment.

Use data-driven reasoning. Be specific to the industry.`,

  "business-model": (ctx) => `You are a business strategist who has advised 100+ startups.

Design the business model for this startup.

${baseContext(ctx)}

Generate the following in well-structured Markdown:

## Business Model Canvas
For each of the 9 blocks, provide specific content:
### Customer Segments
### Value Propositions
### Channels
### Customer Relationships
### Revenue Streams
### Key Resources
### Key Activities
### Key Partnerships
### Cost Structure

## Revenue Model
Describe 2-3 monetization strategies with pricing logic.

## Pricing Strategy
Recommend specific pricing tiers with features and price points.

## Unit Economics
Estimate CAC, LTV, and key financial metrics.

## Go-to-Market Strategy
How to acquire the first 100, 1000, and 10000 customers.

Be realistic about the startup stage. Prioritize revenue strategies that work early.`,

  "technical-architecture": (ctx) => `You are a senior technical architect designing systems for startups.

Design the technical architecture for this startup.

${baseContext(ctx)}

Generate the following in well-structured Markdown:

## Recommended Tech Stack
List each technology with justification:
- Frontend
- Backend
- Database
- Authentication
- Hosting/Deployment
- Third-party Services

## System Architecture
Describe the high-level system design: components, data flow, and interactions.

## Database Schema
Design the core database tables with fields, types, and relationships.

## API Design
List 5-10 key API endpoints with method, path, and purpose.

## Scalability Considerations
How the system scales from 100 to 100,000 users.

## Security Considerations
Key security measures to implement.

Match the tech stack to the startup's needs. Prefer proven, maintainable technologies.`,

  "ui-ux": (ctx) => `You are a product designer at a leading design agency.

Design the user experience for this startup.

${baseContext(ctx)}

Generate the following in well-structured Markdown:

## User Flows
Describe 3 core user flows step by step.

## Key Screens
Describe wireframe layouts for 3-5 essential screens including navigation, content areas, and interactions.

## Landing Page Copy
- Headline
- Subheadline
- Call-to-Action
- 3-4 Feature Highlights

## Design System Recommendations
- Color palette suggestions with hex values
- Typography recommendations
- Key UI patterns to use

## Accessibility Considerations
Key accessibility features to implement.

Focus on clarity, usability, and modern SaaS design patterns.`,

  marketing: (ctx) => `You are a growth marketing expert for early-stage startups.

Create a marketing strategy for this startup.

${baseContext(ctx)}

Generate the following in well-structured Markdown:

## Marketing Strategy
Describe 3-5 acquisition channels with tactics for each.

## SEO Strategy
- 10 target keywords with search intent
- Content strategy with topic clusters
- On-page optimization recommendations

## Launch Checklist
### Pre-Launch (2 weeks before)
### Launch Day
### Post-Launch (first 30 days)

List specific, actionable tasks for each phase.

## Social Media Strategy
Recommend platforms and specific tactics. Include content types and posting frequency.

## Content Marketing
Blog topics, lead magnets, and content distribution plan.

Tailor everything to the startup's stage and target audience.`,

  roadmap: (ctx) => `You are a product manager planning the development roadmap.

Create a development roadmap for this startup.

${baseContext(ctx)}

Generate the following in well-structured Markdown:

## Phase 1: MVP (Weeks 1-6)
List 5-8 features to build. For each: feature name, description, and estimated effort (days).

## Phase 2: Growth (Weeks 7-14)
Features to add after validating the MVP.

## Phase 3: Scale (Weeks 15-24)
Advanced features for scaling.

## Milestones
Key milestones with target dates and success criteria.

## Feature Prioritization
Rate each feature by:
- Impact (1-5)
- Effort (1-5)
- Priority score (Impact/Effort)

Order by priority score descending.

## Risk Assessment
Technical and business risks with mitigation strategies.

Be realistic about timelines for a small team (1-3 developers).`,

  "pitch-deck": (ctx) => `You are an investor relations expert helping founders prepare for fundraising.

Create a pitch deck outline for this startup.

${baseContext(ctx)}

Generate the following in well-structured Markdown. Each slide should have bullet points (max 150 words per slide) suitable for a visual presentation.

## Slide 1: Problem
The pain point you're solving. Make it relatable.

## Slide 2: Solution
Your product and how it solves the problem.

## Slide 3: Market Size
TAM, SAM, SOM with growth trajectory.

## Slide 4: Business Model
How you make money. Key revenue streams.

## Slide 5: Traction
Metrics to include once launched (suggest placeholder metrics).

## Slide 6: Competition
Competitive landscape and your differentiation.

## Slide 7: Team
What roles are needed and why this team wins.

## Slide 8: The Ask
Funding amount, use of funds, and milestones.

## Slide 9: Financial Projections
3-year revenue projections with assumptions.

## Speaker Notes
For each slide, provide 3-5 talking points for the presenter.

Keep slides concise and impactful. Investors see hundreds of decks.`,
};

export function getPromptForSection(
  section: BlueprintSection,
  context: PromptContext,
): string {
  const templateFn = PROMPT_TEMPLATES[section];
  return templateFn(context);
}
