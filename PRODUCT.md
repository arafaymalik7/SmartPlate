# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Confirmed by the authoritative project specification: Next.js App Router, React, strict TypeScript, Tailwind CSS, PostgreSQL, Prisma, Zod, Vitest, Playwright and GitHub Actions. npm is the selected package manager because pnpm is not installed in the current environment.

## Users

General diners, health-conscious people making informational meal choices, restaurant staff who manage digitized menus, and students or working professionals deciding on meals quickly.

## Product Purpose

SMARTPLATE displays restaurant menus with transparent per-serving nutrition data and offers explainable, rule-based, non-medical meal suggestions based on user-selected preferences and exclusions.

## Positioning

The product makes the limits of its data visible: it distinguishes illustrative, derived and verified source records; treats missing allergy data as unknown; and gives deterministic reasons for rankings instead of presenting medical or AI claims.

## Operating Context

Public visitors explore fictional demonstration menus and may keep non-sensitive meal preferences in their browser. Authorized administrators manage restaurants and menu data through a protected workspace.

## Capabilities and Constraints

The project must preserve the approved title, use PostgreSQL as the authoritative store, and keep the legacy FastAPI/SQLite project only as unmodified reference. It must not claim medical advice, verified allergy safety, user study results, or deployment evidence without proof.

## Brand Commitments

SMARTPLATE is warm, clear, friendly and professional. Its public content must label demonstration data as fictional and illustrative.

## Evidence on Hand

The repository contains a legacy implementation and its documentation. `docs/university/reference/` is absent in the current checkout, so proposal/rubric source originals cannot be extracted; the master specification supplies the working requirements.

## Product Principles

1. Explain rather than imply certainty.
2. Put data provenance and uncertainty beside decisions.
3. Make sensible meal exploration quick and accessible.
4. Keep health-related guidance informational and non-clinical.

## Accessibility & Inclusion

Public and administrative interfaces target semantic HTML, keyboard usability, visible focus, clear validation messaging and WCAG AA contrast where feasible.
