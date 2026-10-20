# .agent — Workspace Agent Customizations

This directory contains workspace configurations, automated skills, operational runbooks, commands, and architectural plans for **Parallax Machine Inc**.

---

## Directory Overview

```text
.agent/
├── README.md               # Overview of workspace customizations and guidelines
├── AGENTS.md               # Workspace-level guidelines and critical pair-programming rules
├── rules/                  # Directory and behavioral rules enforced across the project
│   ├── code-style.md       # Vanilla CSS, Next.js App Router, and TypeScript conventions
│   ├── git-workflow.md     # Git rules, safety protocols, and push confirmation policy
│   └── performance.md      # 60fps animations, WebGL/CSS3D performance, image optimization
├── skills/                 # On-demand modular procedural skills (SKILL.md)
│   ├── component-generator/
│   │   ├── SKILL.md        # Procedure for creating creative 3D and interactive components
│   │   └── references/     # Design tokens and styling guidelines
│   └── site-audit/
│       └── SKILL.md        # Comprehensive quality, build, and accessibility audit workflow
├── commands/               # Project commands and development script documentation
│   ├── dev.md              # Running local development with Turbopack
│   ├── build.md            # Production build and static export verification
│   └── test.md             # Type checking and linting routines
├── plans/                  # Project roadmaps, migration records, and architectural plans
│   ├── roadmap.md          # Full website feature overview and backlog
│   └── concave-carousel-migration.md # Spec and implementation notes for the Section 04 3D Carousel
├── hooks.json              # Optional agent lifecycle hooks
└── mcp_config.json         # Model Context Protocol (MCP) tool configurations
```

---

## Adding Customizations

### Skills (`skills/<skill_name>/SKILL.md`)
Skills are on-demand runbooks loaded dynamically by the agent when relevant to a task. Each skill must contain a `SKILL.md` file with YAML frontmatter:
```markdown
---
name: my-skill-name
description: Clear third-person description of what this skill does and when to activate it.
---
# Instructions here...
```

### Rules (`rules/*.md` and `AGENTS.md`)
Rules define constraints, style guides, and safety checks that the agent always respects during execution.

### Commands (`commands/*.md`)
Cheatsheets for shell commands, build verification routines, and troubleshooting steps.

### Plans (`plans/*.md`)
Persistent project planning artifacts tracking complex features, migrations, and design decisions.
