# @grafikui/motion

> A living argument for intentional motion in UI design systems.

**npm:** [`@grafikui/motion`](https://www.npmjs.com/package/@grafikui/motion) · MIT licensed
**Live demo (Motion Manifesto):** [motionmanifesto.co.uk](https://motionmanifesto.co.uk)
**Studio:** [Grafikui Studio](https://grafikui.com) · Self-Initiated · March 2026

---

## What It Is & What It Does

`@grafikui/motion` is a small set of motion primitives, design tokens, and hooks — the shared motion contract behind every interface Grafikui Studio ships. Six primitives, each paired with a named design principle, running in production across four real projects: grafikui.com itself, Comprent's compliance dashboard, Blocinsights, and the MOD-15 showcase.

It is not a generic animation library. It is not a documentation site. It is a **point of view**, built in working code: most product interfaces possess a motion language by accident, layered in component by component until the product moves but doesn't feel like anything. This package demonstrates the alternative — every primitive carries an explicit principle, a motion contract, and a highly optimized implementation. [Motion Manifesto](https://motionmanifesto.co.uk) is the interactive reference documenting it; this package is the real, installable result.

---

## Install

```bash
npm install @grafikui/motion
```

Peer dependencies: `react`, `react-dom` (^19), and `framer-motion` (^12) for the default export; `gsap` (bundled) for the `/marketing` export.

---

## Usage

### SaaS primitives (`@grafikui/motion`)

Pure Framer Motion — no GSAP — for data-dense product UI where main-thread cost matters.

```tsx
import { Arc, Count, Nudge, State, motionTokens } from '@grafikui/motion';

// Progress ring
<Arc value={72} size={200} completionBehaviour="pulse" />

// Animated number
<Count value={1284} format="currency" prefix="$" />

// Priority-mapped notification (level 1-4)
<Nudge level={3} title="Deploy complete" message="v2.4.0 is live." dismissible />

// Component state machine: empty | loading | partial | complete | error
<State initialState="loading" transitionSpeed="normal" />
```

### Marketing primitives (`@grafikui/motion/marketing`)

GSAP-backed, for cinematic orchestration work — kept in a separate export so it never bundles into SaaS code that can't afford it.

```tsx
import { Reveal, Sequence, useSequence } from '@grafikui/motion/marketing';

<Reveal variant="rise" stagger staggerDelay={100}>
  <h1>Hero copy</h1>
  <p>Subhead</p>
</Reveal>

<Sequence animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }} scrollTrigger>
  <section>Scroll-triggered content</section>
</Sequence>
```

### Tokens

```ts
import { motionTokens } from '@grafikui/motion/tokens/motion';
import { colours } from '@grafikui/motion/tokens/colours';
import { typography } from '@grafikui/motion/tokens/typography';
```

`motionTokens` exposes the shared duration/easing/spring values (`progress`, `entrance`, `transition`, `stagger`, per-level `nudge` variants) — the same numbers documented and demonstrated live at [motionmanifesto.co.uk](https://motionmanifesto.co.uk).

---

## The Six Primitives

- **The Arc** (`Arc`) — *Completion is arrival, not arithmetic.* Circular progress, driven via `useMotionValue`, with a pulse/glow completion state kept structurally distinct from the mathematical state.
- **The Count** (`Count`) — *Numbers must feel like they mean something.* Animated number counter (integer, percentage, currency, score) via a custom `useCountUp` hook, updating the DOM directly to avoid React render overhead.
- **The Reveal** (`Reveal`, marketing export) — *Entering a space must be considered.* `AnimatePresence`-powered entrance orchestrator with four variants (fade, rise, spring, blur) and deterministic stagger.
- **The State** (`State`) — *A component that cannot communicate its condition is broken.* A five-state machine (empty, loading, partial, complete, error) with isolated exit/enter via `AnimatePresence mode="popLayout"`.
- **The Nudge** (`Nudge`) — *Attention should be earned.* Four urgency levels mapped directly to motion profile; level 4 bypasses the Framer Motion RAF loop entirely via raw CSS `@keyframes` to avoid compositor-thread cost on an infinite animation.
- **The Sequence** (`Sequence`, marketing export) — *Orchestration creates hierarchy.* A GSAP + ScrollTrigger wrapper with automatic `gsap.context()` cleanup.

---

## Architectural Baseline & System Boundaries

### 1. Motion Primitive Contract

All motion components are treated as stateless, declarative primitives. Primitives communicate states driven by external data, rather than maintaining their own complex orchestration logic.

### 2. Accessibility Guarantees

- **Reduced motion**: every primitive respects `useReducedMotion`. When active, durations collapse to zero, spring animations downgrade to instant snaps, and the Nudge's physical error shake is suppressed.
- **Keyboard navigation**: interactive primitives adhere to standard ARIA contracts.

### 3. Dual-Export Segregation

The package is split into two entry points to protect Interaction to Next Paint (INP):

- **`@grafikui/motion`** — pure Framer Motion. The real motion layer behind Comprent and Blocinsights, where GSAP's main-thread cost isn't affordable.
- **`@grafikui/motion/marketing`** — re-exports GSAP for cinematic orchestration work. A bundler never pulls GSAP into code that only imports the default export.

### 4. Implementation Notes

- **The Arc**: Uses `useMotionValueEvent` rather than a render-triggering state update for intermediate progress values. Glow completion uses CSS filters on underlays to avoid SVG `stroke-width` scaling artifacts.
- **The Count**: Formats (`integer` / `percentage` / `currency` / `score`) are applied via pure transform strings, decoupling formatting logic from layout. A static, invisible placeholder of the final value locks the DOM's width up front, so the live counter can't cause layout shift while it animates.
- **The Nudge**: Level 4 urgency bypasses the JS animation loop entirely for its pulse — a deliberate choice to keep an infinite animation off the compositor's main-thread budget.
- **The Reveal**: Stagger delays are computed deterministically via index-offset mapping (`(delay/1000) + (index * staggerDelay/1000)`), not CSS `animation-delay` chains — keeps orchestration in one place instead of splitting timing logic between JS and CSS.

---

## Local Development (this repo)

```bash
git clone https://github.com/omrdev1/grafikui-motion.git
cd grafikui-motion

npm install
npm run build   # tsup — builds build/ (ESM + .d.ts) from src/
npm run dev     # tsup --watch
```

The live interactive reference — every primitive demonstrated with every parameter exposed as a control — lives in a separate repo and is deployed at [motionmanifesto.co.uk](https://motionmanifesto.co.uk).

---

## License

MIT © Omar Ahmad — see [LICENSE](./LICENSE).
