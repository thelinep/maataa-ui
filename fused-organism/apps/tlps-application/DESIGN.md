---
name: TLPS Workspace
description: A calm control room for coordinating physical and media production.
colors:
  navy: "#0c1b2b"
  navy-raised: "#12263a"
  mineral-canvas: "#f3f6f8"
  surface: "#ffffff"
  ink: "#15283d"
  muted-ink: "#6d7e90"
  line: "#dfe6eb"
  teal: "#007e83"
  teal-bright: "#09a6a0"
  amber: "#dc8d26"
  green: "#1c9569"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(39px, 5vw, 64px)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.06em"
  headline:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(28px, 3vw, 38px)"
    fontWeight: 800
    lineHeight: 1.12
    letterSpacing: "-0.045em"
  title:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.35
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "9px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.1em"
rounded:
  sm: "6px"
  md: "9px"
  lg: "14px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "14px"
  lg: "22px"
  xl: "28px"
components:
  button-primary:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "38px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "38px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px"
  search-field:
    backgroundColor: "{colors.mineral-canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 11px"
    height: "38px"
  status-chip:
    backgroundColor: "#ebf7f1"
    textColor: "#207b64"
    rounded: "999px"
    padding: "4px 7px"
---

# Design System: TLPS Workspace

## Overview

**Creative North Star: "The Control Room"**

The workspace should feel like a composed operations room: broad enough to hold many disciplines, with a steady hierarchy that makes today's work and the next decision easy to locate. Deep navy gives navigation its own visual territory. The mineral canvas, white work surfaces, teal actions and restrained amber alerts keep dense information readable without making the screen feel urgent all the time.

The product runs on the MAATAA UI shell, but its TLPS skin is distinct from MAATAA's warm paper-and-ink identity. The public landing page explains the connected operating layer; the authenticated-looking workspace remains an explicitly local preview with illustrative records and disconnected services.

**Key Characteristics:**
- Deep navy navigation rail against a pale mineral canvas.
- Teal indicates the main action and active navigation; amber is reserved for attention states.
- Dense operational information sits in calm, bordered white panels.
- Every sample record and preview action is labelled as illustrative or disconnected.

## Colors

The palette pairs a blue-leaning charcoal with cool near-white surfaces, a single teal action color, and a limited amber signal.

### Primary
- **Operations Teal**: Use for primary actions, selected navigation, links, and focus states. Keep it concentrated on interactive points.
- **Control Navy**: Use for the sidebar and identity anchor, not large page backgrounds.

### Secondary
- **Signal Amber**: Use for attention items, pending states, and preview status markers. Do not use it to decorate neutral content.
- **Quiet Green**: Use only for positive/sample statuses.

### Neutral
- **Mineral Canvas**: The page background; a cool surface that separates the work area from the dark rail.
- **White Surface**: Cards, forms, dialogs, and table panels.
- **Operations Ink**: Main text and headings.
- **Muted Ink**: Supporting text, timestamps, and metadata.
- **Quiet Line**: Fine borders and dividers; avoid heavy table grids.

### Named Rules
**The Signal Discipline Rule.** Teal marks actions and selected state. Amber marks attention. Neither is decoration.

## Typography

**Display Font:** The platform's system UI sans-serif stack.
**Body Font:** The platform's system UI sans-serif stack.
**Label/Mono Font:** System sans for labels; system monospace for route paths.

**Character:** Native system sans-serif typography keeps route names and operational records crisp without a font download. Headings use a firm weight and tight tracking; small labels use uppercase tracking sparingly for context, not for long copy.

### Hierarchy
- **Display** (800, clamp(39px, 5vw, 64px), 1.05): Public landing message only.
- **Headline** (800, clamp(28px, 3vw, 38px), 1.12): Workspace page heading.
- **Title** (700, 14px, 1.35): Panel and card titles.
- **Body** (400, 12px, 1.6): Main explanatory copy and navigation labels.
- **Label** (700, 9px, 1.4): Metadata, route family, and status context.

## Layout

The MAATAA `AppShell` provides a collapsible left rail, top navigation, page toolbar and footer. The layout controls expose left, right, horizontal, and folded navigation, plus above/below toolbar and footer placement. Keep the main work area fluid with 28px desktop gutters. Metric cards use four columns on wide screens and two on compact screens. Agenda and attention panels sit side-by-side when there is room, then stack on small screens. Application shortcuts use an eight-column desktop strip and collapse to two columns on mobile.

At widths below 760px, use the shell's drawer navigation, preserve the search control as a compact affordance, and keep the key dashboard cards in a two-column metric grid. At very narrow widths, route result cards and application lists become single column. Wide data tables scroll inside their own panel; the overall page must not gain horizontal overflow.

## Elevation & Depth

Depth is quiet and structural: thin cool borders establish panels, and a low ambient shadow appears only on hover, dialogs, and the public hero. Avoid stacked shadows and floating cards that compete with the information hierarchy.

## Shapes

Use small, consistent radii: 6px for controls, 9px for cards, and 14px for the public hero. Pills are reserved for short status labels. Use fine borders for panel boundaries and visible teal focus rings for keyboard navigation.

## Components

- **Primary button:** Filled teal with white text; use for the single most important action in a view. Hover darkens slightly and raises the button by 1px.
- **Secondary button:** White surface with a fine border and muted navy text.
- **Navigation rail:** Navy background, pale text, grouped labels, and a restrained teal indicator for the active route.
- **Search field:** Quiet mineral surface, no heavy outline at rest, visible focus ring when active.
- **Metric card:** White surface, one small color-coded icon, strong value, muted descriptor, and a subtle trend mark.
- **Attention row:** Amber icon and concise issue description; never suggest the record was evaluated by a live service.
- **Status chip:** Compact text label with a pale semantic fill; color must not carry status without text.

## Do's and Don'ts

### Do:
- Do keep preview and sample labels close to illustrative metrics, records, and actions.
- Do use the MAATAA AppShell, Sidebar, and TopNav as the structural foundation.
- Do keep teal and amber semantically distinct and limited to purposeful areas.
- Do preserve visible focus, keyboard access, reduced-motion support, and the mobile drawer.

### Don't:
- Don't use MAATAA's warm paper-and-ink theme for TLPS.
- Don't imply authentication, authorization, persistence, finance processing, approvals, calendar sync, messaging, or provider connections are active.
- Don't place credentials or demo emails in the shipped application data.
- Don't use amber as a general accent or add gradients and glass effects to operational surfaces.
