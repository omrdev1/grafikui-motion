# Motion Manifesto: Architecture Baseline

> A living argument for intentional motion in UI design systems.

**Live URL:** [motionmanifesto.co.uk](https://motionmanifesto.co.uk)  
**Studio:** [Grafikui Studio](https://grafikui.com) · Self-Initiated · March 2026

---

## What It Is & What It Does

Motion Manifesto is a **production-quality interactive reference** for UI motion design. It presents five fundamental interaction primitives — each paired with a named design principle — and exposes every animation parameter as a live, adjustable control.

It is not a standard component library. It is not a generic documentation site. It is a **point of view**, built in working code. It serves as an architectural baseline and context engine for AI-assisted development, enforcing strict engineering standards for UI motion.

The core argument: most product interfaces possess a motion language by accident. Animations are layered in component by component until the product moves — but doesn't feel like anything. Motion Manifesto demonstrates what the alternative looks like: every primitive carries an explicit principle, a motion contract, and a highly optimized implementation.

---

## Core Technologies & Environment

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4
- **Animation Runtime**: Framer Motion 12
- **Smooth Scrolling**: Lenis
- **Node Environment**: Node.js ecosystem (`type: module`)

---

## Architectural Baseline & System Boundaries

### 1. Motion Primitive Contract

All motion components must be treated as stateless, declarative primitives. The underlying philosophy dictates that primitives communicate states driven by external data, rather than maintaining their own complex orchestration logic.

#### The Arc (Progress Ring)
- **Principle**: Completion should feel like arrival, not arithmetic.
- **Mechanism**: Drives a single SVG stroke via `useMotionValue`. The visual completion state (pulse vs glow) is structurally distinct from the mathematical state. Glow utilizes CSS filters on underlays to prevent SVG `stroke-width` scaling artifacts.
- **Constraints**: Uses `useMotionValueEvent` for React 19 compatibility. Does not trigger render cycles during intermediate progress updates.

#### The Count (Animated Number)
- **Principle**: Numbers that change should feel like they mean something.
- **Mechanism**: Uses a custom `useCountUp` hook attached to a `useMotionValue` to update the DOM natively, removing sub-pixel jitter and expensive React CPU overhead on long durations.
- **Constraints**: Formats (score, currency, percentage) are applied via pure transform strings, decoupling logic from component layout.

#### The Reveal (Entrance Orchestrator)
- **Principle**: Entering a space should feel considered, not instantaneous.
- **Mechanism**: An `AnimatePresence`-powered entrance orchestrator defining four strict, distinct variants (Fade, Rise, Spring, Blur).
- **Constraints**: Stagger delays are computed deterministically via index offset mapping (`(delay/1000) + (index*staggerDelay)`), completely avoiding CSS `animation-delay` chains.

#### The State (Component State Machine)
- **Principle**: A component that cannot communicate its own condition is broken.
- **Mechanism**: Tests visual isolation using `<AnimatePresence mode="popLayout">` to unblock the lifecycle, allowing entering components to render instantly while exiting elements finish out-of-band.
- **Constraints**: The `error` state is orchestrated via a specific `times`-array keyframe payload mimicking a physical head-shake, circumventing arbitrary JS timeouts.

#### The Nudge (Notification Urgency)
- **Principle**: Attention should be earned, not demanded.
- **Mechanism**: Maps component priority directly to its motion profile, avoiding generic cross-fade behaviors.
- **Constraints**: Level 4 urgency completely bypasses the Framer Motion JS RAF loop. It leverages raw CSS `@keyframes` (`border-glow`) to prevent compositor thread blocking on infinite animations.

### 2. State & Control Boundaries (Gate 3.1)

Controls (`Slider`, `Selector`, `Toggle`, `ReplayButton`) are **strictly stateless presentational components**.
- **Data Flow**: They never maintain their own state. Parent `App.tsx` remains the single source of truth via continuous `onChange` bubbling.
- **Layout Constraints**: Controls operate as direct children of the `Section` grid. Deep nesting into flex-columns is strictly prohibited unless `col-span-*` is used.
- **DOM Purity**: Control wrappers require `min-w-0` to participate safely in CSS grid algorithms. Text overflow in Selectors is managed via `whitespace-nowrap` within overflow-hidden containers.

### 3. Accessibility Guarantees (Gate 3.3)

- **Reduced Motion**: All animations MUST respect the `useReducedMotion` hook. When active, durations collapse to zero, spring animations downgrade to instant snaps, and physical error shakes are forcefully suppressed.
- **Keyboard Navigation**: All interactive primitives and controls adhere to strict ARIA contracts (e.g. `role="switch"` explicitly mapped to `value` props on Toggles).

### 4. Production Safeguards & Vulnerability Mitigation

Passive documentation fails. To enforce the Motion Manifesto primitives without human review, the architecture deploys programmatic safeguards:

1. **Eliminating Input Latency**: `mode="wait"` forces an explicit sequential block. We shift to `<AnimatePresence mode="popLayout">` to unblock the lifecycle, allowing entering components to render instantly while exiting elements animate out-of-band.
2. **Thread-Safe Accessibility**: Relying purely on JS-driven `useReducedMotion` causes hydration races. We decouple threads by enforcing accessibility via immediate, zero-JS CSS overrides at the root (`@media (prefers-reduced-motion: reduce)`), paired with a global declarative `<MotionConfig reducedMotion="user">`.
3. **Concrete Enforcement (Automated Gates)**:
   - **Static Layer (ESLint)**: ESLint rules restrict imports from unapproved animation files or raw `framer-motion` definitions, forcing developers to consume primitives from the shared token/motion package.
   - **Runtime/CI Layer (Lighthouse + k6)**: Hard-coded metrics in CI scripts automatically fault builds if Interaction to Next Paint (INP) exceeds 50ms or Total Blocking Time (TBT) breaches 150ms under load simulations.
4. **Strict TypeScript Indexing**: Dynamic configuration objects are explicitly typed using strict utility generics (e.g., `Record<NudgeLevel, StrictVariant>`), guaranteeing rigorous compile-time checks.
5. **Hardware-Accelerated Layout Projection**: `popLayout` transitions utilize Framer Motion's `layout` prop on both parent containers and nested children. This offloads container geometric shifts to the GPU compositor thread via `transform: scale` matrices and applies automatic inverse scaling to children, eliminating main-thread reflow bottlenecks without distorting typography.
6. **Decoupled Volatile Dimensions**: Primitives handling rapidly mutating live strings (like `useCountUp`) render static, invisible bounding boxes (e.g., `000,000` or `100%`) into the standard layout flow. The live counter mutates endlessly within absolute space, incapable of forcing the parent to horizontally expand or cause layout thrashing.
7. **Token-Safe String Interfaces**: Configuration payloads do not rely on loose strings. We intersect Framer Motion's `Variants` type with an explicit, auto-generated Template Literal type extracted directly from `index.css` (e.g., `ThemeColorToken`). Any typographical error mapping a color transition to a non-existent CSS variable triggers a fatal compiler panic.

---

## How to Utilize It

### For Engineering & AI Agents
This baseline README acts as a strict execution context. When modifying or extending `motion_manifesto`:
1. **Respect Boundaries**: Never introduce state into presentational controls.
2. **Prioritize Performance**: Any infinite or long-running animation MUST bypass the JS thread using native CSS keyframes (e.g., Level 4 Nudges).
3. **Data-Driven Motion**: Continuously use `useMotionValue` and `useTransform` to drive UI directly to the DOM to bypass React render cycle overhead.

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-repo/motion-manifesto.git
cd motion-manifesto

# Install dependencies
npm install

# Start local server (Vite)
npm run dev

# Create production build
npm run build
```

Click the **source icon** (`</>`) in any section of the running application to view the exact implementation code for that primitive.
