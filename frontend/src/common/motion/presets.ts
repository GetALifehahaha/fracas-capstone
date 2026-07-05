import type { Variants, Transition } from 'framer-motion'

/** Shared easing — a soft ease-out so movement settles rather than snapping. */
export const EASE_OUT: Transition = { duration: 0.28, ease: [0.22, 1, 0.36, 1] }

/** Plain opacity fade, for overlays / error states. */
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: EASE_OUT },
}

/** Fade + a small rise. The default page / element entrance. */
export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: EASE_OUT },
}

/** Parent that reveals its children one after another. */
export const staggerContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } },
}

/** Child of {@link staggerContainer}. */
export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0, transition: EASE_OUT },
}
