import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'
import { fadeInUp, staggerContainer, staggerItem } from './presets'

/**
 * Subtle mount entrance (fade + small rise). Collapses to a no-op when the
 * user prefers reduced motion. Accepts any motion.div props (e.g. `whileHover`).
 */
export const FadeIn = ({ children, ...props }: HTMLMotionProps<'div'>) => {
    const reduce = useReducedMotion()
    return (
        <motion.div
            initial={reduce ? false : 'hidden'}
            animate='visible'
            variants={fadeInUp}
            {...props}
        >
            {children}
        </motion.div>
    )
}

/**
 * Container that reveals its {@link StaggerItem} children in sequence. Pair the
 * two so lists (activity feeds, table rows) cascade in gently.
 */
export const Stagger = ({ children, ...props }: HTMLMotionProps<'div'>) => {
    const reduce = useReducedMotion()
    return (
        <motion.div
            initial={reduce ? false : 'hidden'}
            animate='visible'
            variants={staggerContainer}
            {...props}
        >
            {children}
        </motion.div>
    )
}

/** A single staggered child of {@link Stagger}. */
export const StaggerItem = ({ children, ...props }: HTMLMotionProps<'div'>) => (
    <motion.div variants={staggerItem} {...props}>
        {children}
    </motion.div>
)

/**
 * Wraps routed page content so each navigation fades/rises in. Give it
 * `key={pathname}` so a route change remounts and re-plays the entrance.
 */
export const PageTransition = ({ children, ...props }: HTMLMotionProps<'div'>) => {
    const reduce = useReducedMotion()
    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            {...props}
        >
            {children}
        </motion.div>
    )
}
