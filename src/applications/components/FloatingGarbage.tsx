import { motion, Variants } from 'framer-motion';
import { useMemo } from 'react';

// Constants
const CONFIG = {
  ITEM_COUNT: 30,
  SCALE_MIN: 0.5,
  SCALE_MAX: 1,
  DURATION_MIN: 15,
  DURATION_MAX: 35,
  MOVEMENT_OFFSET: 20,
  Y_VARIATION: 5,
  OPACITY_MAX: 0.4,
  COLOR_CYCLE_DURATION: 10,
  COLOR_DELAY_MAX: 10,
  ICON_SIZE: 'w-24 h-24',
} as const;

const COLOR_PALETTE: string[] = [
  '#ff0000', // Red
  '#ffff00', // Yellow
  '#00ff00', // Green
  '#00ffff', // Cyan
  '#0000ff', // Blue
  '#ff00ff', // Magenta
  '#ff0000', // Red (loop back)
];

const COLOR_TIMES: number[] = [0, 0.16, 0.33, 0.5, 0.66, 0.83, 1];

// Helper function to create SVG icons
const createIcon =
  (pathData: string | string[]): React.FC<React.SVGProps<SVGSVGElement>> =>
  (props) => {
    const paths = Array.isArray(pathData) ? pathData : [pathData];
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
      >
        {paths.map((d, index) => (
          <path
            key={`path-${index}-${d.substring(0, 10)}`}
            strokeLinecap="round"
            strokeLinejoin="round"
            d={d}
          />
        ))}
      </svg>
    );
  };

// Icon definitions
const ICONS = [
  createIcon(
    'M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0',
  ), // Trash Bin
  createIcon(
    'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3.75h3.75M12 15.75h3.75M12 7.5V3.75m0 3.75h-3.75m3.75 0H8.25m0 0A2.25 2.25 0 016 5.25V3.75m2.25 3.75h-1.5M15.75 7.5A2.25 2.25 0 0018 5.25V3.75m-2.25 3.75h1.5M6 3.75h12',
  ), // Crumpled Paper
  createIcon(
    'M9 22h6c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2h-1V3h1c.55 0 1-.45 1-1s-.45-1-1-1H9c-.55 0-1 .45-1 1s.45 1 1 1h1v4H9c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2zm1-18h4v3h-4V4zm-2 5h8v11H8V9z',
  ), // Plastic Bottle
  createIcon(
    'M7 21h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2zM7 5h10v14H7V5zM12 20c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z',
  ), // Soda Can
  createIcon(
    'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
  ), // Recycle Bin
  // Wheelie Bin (special case with circles)
  (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16m-1 0v11a2 2 0 01-2 2H7a2 2 0 01-2-2V7"
      />
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="19" r="2" />
    </svg>
  ),
  createIcon(
    'M20 9V7a2 2 0 00-2-2h-6L10 3H4a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2v-8H20zM4 9h16v10H4V9zm2 2v6m4-6v6m4-6v6m4-6v6',
  ), // Dumpster
  createIcon(
    'M5 5h14l-2 16H7L5 5zm0 0l2-2h10l2 2M7 9l10 8m-10 0l10-8m-10 4h10m-10-4h10',
  ), // Office Bin
  createIcon([
    'M20 7l-2 14H6L4 7m16 0H4m16 0l-2-4H6L4 7m8 4v6m-4-3l4-3 4 3',
    'M9 14l3 3 3-3',
  ]), // Recycling Box
] as const;

type IconComponent = (
  props: React.SVGProps<SVGSVGElement>,
) => React.ReactElement;

interface FloatingItem {
  id: number;
  x: number;
  y: number;
  scale: number;
  duration: number;
  Icon: IconComponent;
  direction: 1 | -1;
  colorDelay: number;
  yVariation: number;
}

// Helper functions
const getRandomIcon = (): IconComponent => {
  const randomIndex = Math.floor(Math.random() * ICONS.length);
  return ICONS[randomIndex] as IconComponent;
};

const generateFloatingItem = (id: number): FloatingItem => ({
  id,
  x: Math.random() * 100,
  y: Math.random() * 100,
  scale:
    CONFIG.SCALE_MIN + Math.random() * (CONFIG.SCALE_MAX - CONFIG.SCALE_MIN),
  duration:
    CONFIG.DURATION_MIN +
    Math.random() * (CONFIG.DURATION_MAX - CONFIG.DURATION_MIN),
  Icon: getRandomIcon(),
  direction: Math.random() > 0.5 ? 1 : -1,
  colorDelay: Math.random() * CONFIG.COLOR_DELAY_MAX,
  yVariation: Math.random() * CONFIG.Y_VARIATION * 2 - CONFIG.Y_VARIATION,
});

const generateItems = (count: number): FloatingItem[] =>
  Array.from({ length: count }, (_, i) => generateFloatingItem(i));

const createAnimationVariants = (item: FloatingItem): Variants => ({
  initial: {
    x: `${item.x}vw`,
    y: `${item.y}vh`,
    opacity: 0,
  },
  animate: {
    x: [
      `${item.x}vw`,
      `${item.x + CONFIG.MOVEMENT_OFFSET * item.direction}vw`,
      `${item.x}vw`,
    ],
    y: [`${item.y}vh`, `${item.y + item.yVariation}vh`, `${item.y}vh`],
    opacity: [0, CONFIG.OPACITY_MAX, 0],
    color: COLOR_PALETTE,
  },
});

const createTransition = (item: FloatingItem) => ({
  duration: item.duration,
  repeat: Infinity,
  ease: 'linear' as const,
  times: [0, 0.5, 1],
  color: {
    duration: CONFIG.COLOR_CYCLE_DURATION,
    repeat: Infinity,
    ease: 'linear' as const,
    delay: -item.colorDelay,
    times: COLOR_TIMES,
  },
});

export default function FloatingGarbage() {
  const items = useMemo(() => generateItems(CONFIG.ITEM_COUNT), []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {items.map((item) => {
        const Icon = item.Icon;
        return (
          <motion.div
            key={item.id}
            variants={createAnimationVariants(item)}
            initial="initial"
            animate="animate"
            transition={createTransition(item)}
            className="absolute"
            style={{ scale: item.scale }}
          >
            <Icon className={CONFIG.ICON_SIZE} />
          </motion.div>
        );
      })}
    </div>
  );
}
