import { motion, Variants } from 'framer-motion';

// Constants
const GITHUB_URL = 'https://github.com/Eji4h/rich-the-garbage';

const ANIMATION_DELAYS = {
  title: 0.2,
  description: 0.3,
  button: 0.4,
  stats: 0.6,
} as const;

const VIEWPORT_ONCE = { once: true } as const;

// Animation variants
const fadeInUp: Variants = {
  initial: { y: 20, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
};

const fadeInUpLarge: Variants = {
  initial: { y: 30, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
};

const badgeSpring: Variants = {
  initial: { scale: 0, rotate: -180 },
  whileInView: { scale: 1, rotate: 0 },
};

// Sub-components
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 bg-linear-to-br from-[#183d3d] via-[#1e5162] to-[#183d3d]">
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 left-[10%] w-32 h-32 bg-[#ff8ae2]/20 rounded-full blur-2xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute bottom-10 right-[15%] w-40 h-40 bg-[#9c4668]/30 rounded-full blur-2xl"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#93c5fd]/10 rounded-full blur-3xl"
      />
    </div>
  );
}

function HacktoberfestBadge() {
  const glowShadows = [
    `0 0 20px rgba(255, 138, 226, 0.4)`,
    `0 0 40px rgba(255, 138, 226, 0.6)`,
    `0 0 20px rgba(255, 138, 226, 0.4)`,
  ];

  return (
    <motion.div
      variants={badgeSpring}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      viewport={VIEWPORT_ONCE}
      className="inline-block mb-8"
    >
      <div className="relative">
        <motion.div
          animate={{ boxShadow: glowShadows }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full"
        />
        <div className="relative bg-linear-to-br from-[#ff8ae2] via-[#9c4668] to-[#183d3d] p-1 rounded-full">
          <div className="bg-[#183d3d] px-6 py-3 rounded-full">
            <span className="text-[#ff8ae2] font-bold text-lg tracking-wider">
              🎃 HACKTOBERFEST
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function GitHubIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function GitHubButton() {
  return (
    <motion.div
      variants={fadeInUp}
      transition={{ duration: 0.6, delay: ANIMATION_DELAYS.button }}
      viewport={VIEWPORT_ONCE}
    >
      <motion.a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-3 bg-linear-to-r from-[#ff8ae2] via-[#ec4899] to-[#9c4668] text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-shadow"
      >
        <GitHubIcon />
        View on GitHub
      </motion.a>
    </motion.div>
  );
}

function ContributionStats() {
  const stats = [
    { label: 'Open Source', color: 'bg-green-400' },
    { label: 'MIT License', color: 'bg-[#ff8ae2]' },
    { label: 'All skill levels welcome', color: 'bg-blue-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1, delay: ANIMATION_DELAYS.stats }}
      viewport={{ once: true }}
      className="mt-12 flex justify-center gap-8 text-sm text-slate-400"
    >
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-2">
          <span
            className={`w-2 h-2 ${stat.color} rounded-full animate-pulse`}
          />
          <span>{stat.label}</span>
        </div>
      ))}
    </motion.div>
  );
}

// Main component
export default function Hacktoberfest() {
  return (
    <section className="relative py-20 overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <HacktoberfestBadge />

        <motion.h2
          variants={fadeInUpLarge}
          transition={{ duration: 0.6, delay: ANIMATION_DELAYS.title }}
          viewport={VIEWPORT_ONCE}
          className="text-4xl md:text-6xl font-black text-white mb-6"
          style={{
            textShadow: `0 4px 20px rgba(255, 138, 226, 0.3)`,
          }}
        >
          Open for{' '}
          <span className="bg-linear-to-r from-[#ff8ae2] via-[#ec4899] to-[#ff8ae2] bg-clip-text text-transparent">
            Contributions
          </span>
        </motion.h2>

        <motion.p
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: ANIMATION_DELAYS.description }}
          viewport={VIEWPORT_ONCE}
          className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Join our community and help make{' '}
          <span className="text-[#ff8ae2] font-semibold">Rich The Garbage</span>{' '}
          even more amazing! Whether you're fixing bugs, adding features, or
          improving documentation — every contribution counts!
        </motion.p>

        <GitHubButton />
        <ContributionStats />
      </div>
    </section>
  );
}
