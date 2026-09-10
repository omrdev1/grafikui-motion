export const motionTokens = {
  progress: {
    easing: 'easeOut',
    duration: 0.6, // 600ms
  },
  entrance: {
    type: 'spring',
    stiffness: 120,
    damping: 20,
  },
  transition: {
    ease: 'easeOut',
    duration: 0.24, // 240ms
  },
  stagger: {
    delay: 0.1, // 100ms default stagger delay
  },
  nudge: {
    level1: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    level2: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    level3: { opacity: 1, x: 0, scale: [1, 1.02, 1], transition: { duration: 0.4, ease: 'easeOut', times: [0, 0.5, 1] } },
    level4: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  },
  // Added when grafikui.com adopted this package as its own real motion
  // standard rather than an unwritten one-off per page. Both values were
  // already in production use (the 404 page's GSAP fade, the work-list's
  // Framer Motion stagger) — captured here as their real, existing values
  // rather than retuned to match the categories above, so adoption didn't
  // change grafikui.com's own animation timing.
  //
  // GSAP's easing vocabulary (e.g. "power3.out") has no valid mechanical
  // equivalent in Framer Motion's easing strings (e.g. "easeOut") — these
  // two entries are each scoped to the one real engine that actually uses
  // them, rather than forcing one engine's syntax onto the other's code.
  pageEntrance: {
    duration: 1, // 1000ms — grafikui.com's 404 page fade-in (GSAP)
    ease: 'power3.out', // GSAP easing name, not Framer Motion's
  },
  listItem: {
    duration: 0.25, // 250ms — grafikui.com's work-list stagger (Framer Motion)
    // Custom cubic-bezier array, not a named easing string — Maddox's
    // drift scanner only checks quoted-string ease: '...' literals today,
    // so this value isn't (yet) verifiable against a real usage the way
    // duration is; documented here for a human reading this file, not
    // for the scanner. Typed as a fixed 4-tuple (not number[]) so it's
    // directly assignable to Framer Motion's Easing type at call sites.
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  },
};
