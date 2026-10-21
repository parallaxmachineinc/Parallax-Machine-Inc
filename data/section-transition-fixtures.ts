export type SectionTransitionFixture = {
  name: string;
  progress: number;
  terminal: "visible" | "fading" | "hidden";
  lottieFrame: number;
  description: string;
};

/**
 * Visual contract for the Section 02 → 03 scroll sequence.
 *
 * These states intentionally separate the camera pull-back from the Lottie
 * convergence. Keeping them distinct prevents the terminal from appearing to
 * jump as the planet takes over.
 */
export const SECTION_TRANSITION_FIXTURES: readonly SectionTransitionFixture[] = [
  {
    name: "contained-opening",
    progress: 0.2,
    terminal: "visible",
    lottieFrame: 60,
    description: "Section 02 is fully readable and enclosed by the stable inner circle.",
  },
  {
    name: "shared-pull-back",
    progress: 0.4,
    terminal: "visible",
    lottieFrame: 60,
    description: "The terminal and inner circle reduce together without an internal circle morph.",
  },
  {
    name: "convergence-handoff",
    progress: 0.55,
    terminal: "hidden",
    lottieFrame: 60,
    description: "Section 02 has cleared before the Lottie convergence begins.",
  },
  {
    name: "section-three-dock",
    progress: 0.9,
    terminal: "hidden",
    lottieFrame: 110,
    description: "The converged planet is docked in Section 03 and its content is interactive.",
  },
];
