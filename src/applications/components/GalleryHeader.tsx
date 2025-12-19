import { motion } from 'framer-motion';
import { useMemo } from 'react';

// Constants
const PARTICLE_COUNT = 20;
const PARTICLE_SIZE_MIN = 2;
const PARTICLE_SIZE_MAX = 6;
const PARTICLE_DURATION_MIN = 2;
const PARTICLE_DURATION_MAX = 5;
const PARTICLE_DELAY_MAX = 2;

const TEXT_SHADOW = `
  2px 2px 0px rgba(147, 51, 234, 0.3),
  4px 4px 0px rgba(147, 51, 234, 0.2),
  6px 6px 0px rgba(147, 51, 234, 0.1),
  8px 8px 20px rgba(147, 51, 234, 0.3)
`;

const ICON_PATHS = [
  'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z',
  'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z',
  'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z',
] as const;

// Types
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

// Utility functions
const generateParticle = (id: number): Particle => ({
  id,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size:
    PARTICLE_SIZE_MIN + Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN),
  duration:
    PARTICLE_DURATION_MIN +
    Math.random() * (PARTICLE_DURATION_MAX - PARTICLE_DURATION_MIN),
  delay: Math.random() * PARTICLE_DELAY_MAX,
});

const generateParticles = (count: number): Particle[] =>
  Array.from({ length: count }, (_, i) => generateParticle(i));

// Sub-components
function AnimatedBackgroundOrb() {
  return (
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
      }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-300/30 via-pink-300/30 to-blue-300/30 rounded-full blur-3xl"
    />
  );
}

function SparkleParticle({ particle }: { readonly particle: Particle }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        y: [0, -30, -60],
      }}
      transition={{
        duration: particle.duration,
        repeat: Infinity,
        delay: particle.delay,
        ease: 'easeOut',
      }}
      className="absolute rounded-full bg-white"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: particle.size,
        height: particle.size,
      }}
    />
  );
}

function AnimatedTitle() {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <h2
        className="text-5xl md:text-7xl font-black mb-2 tracking-tight"
        style={{ textShadow: TEXT_SHADOW }}
      >
        <motion.span
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent"
          style={{ backgroundSize: '200% 200%' }}
        >
          The Gallery
        </motion.span>
      </h2>
    </motion.div>
  );
}

function AnimatedSubtitle() {
  return (
    <motion.p
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="text-lg md:text-xl text-slate-600 font-medium mb-6"
    >
      A curated collection of precious moments
    </motion.p>
  );
}

function DecorativeSpinner({
  rotation,
  borderColor,
  borderTopColor,
}: {
  readonly rotation: number;
  readonly borderColor: string;
  readonly borderTopColor: string;
}) {
  return (
    <motion.div
      animate={{ rotate: rotation }}
      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      className={`w-12 h-12 rounded-full border-4 ${borderColor} ${borderTopColor}`}
    />
  );
}

function DecorativeElements() {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
      className="flex items-center justify-center gap-4 mb-4"
    >
      <DecorativeSpinner
        rotation={360}
        borderColor="border-purple-400/50"
        borderTopColor="border-t-purple-600"
      />
      <div className="h-1 w-32 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full" />
      <DecorativeSpinner
        rotation={-360}
        borderColor="border-pink-400/50"
        borderTopColor="border-t-pink-600"
      />
    </motion.div>
  );
}

function FloatingIcon({
  iconIndex,
  delay,
}: {
  readonly iconIndex: number;
  readonly delay: number;
}) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
      className="text-purple-400/60"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={ICON_PATHS[iconIndex]}
        />
      </svg>
    </motion.div>
  );
}

function FloatingIcons() {
  const ICON_DELAY_MULTIPLIER = 0.3;

  return (
    <div className="flex justify-center gap-8 mt-8">
      {ICON_PATHS.map((path, index) => (
        <FloatingIcon
          key={`icon-${path.slice(0, 10)}`}
          iconIndex={index}
          delay={index * ICON_DELAY_MULTIPLIER}
        />
      ))}
    </div>
  );
}

// Main component
export default function GalleryHeader() {
  const particles = useMemo(() => generateParticles(PARTICLE_COUNT), []);

  return (
    <div className="relative text-center mb-16 pt-20 pb-8 overflow-hidden">
      <AnimatedBackgroundOrb />
      {particles.map((particle) => (
        <SparkleParticle key={particle.id} particle={particle} />
      ))}
      <div className="relative z-10">
        <AnimatedTitle />
        <AnimatedSubtitle />
        <DecorativeElements />
        <FloatingIcons />
      </div>
    </div>
  );
}
