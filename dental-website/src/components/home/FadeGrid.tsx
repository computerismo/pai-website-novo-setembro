'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Configuration
// Configuration
const VISIBLE_COUNT = 9; // 3x3 grid
// We currently have 19 generated images. 
// We set this to 1 to ensure every image in the pool is unique.
// Since 19 > 9, we have enough for the grid (9) and a reserve (10).
const IMAGE_SETS = 1; 

const IMAGE_FILENAMES = [
  'grid-smile-01.png',
  'grid-smile-02.png',
  'grid-smile-03.png',
  'grid-smile-04.png',
  'grid-smile-05.png',
  'grid-smile-06.png',
  'grid-smile-07.png',
  'grid-smile-08.png',
  'grid-smile-09.png',
  'grid-smile-10.png',
  'grid-smile-11.png',
  'grid-smile-12.png',
  'grid-smile-13.png',
  'grid-smile-14.png',
  'grid-smile-15.png',
  'grid-smile-16.png',
  'grid-smile-17.png',
  'grid-smile-18.png',
  'grid-smile-19.png',
];

type GridImage = {
  id: string;
  src: string;
  alt: string;
};

// Generate initial image list with unique IDs
const generateImages = (): GridImage[] => {
  const images: GridImage[] = [];
  let idCounter = 0;

  for (let i = 0; i < IMAGE_SETS; i++) {
    IMAGE_FILENAMES.forEach((filename, index) => {
      idCounter++;
      images.push({
        id: `smile-${idCounter}`,
        src: `/images/hero-grid/${filename}`,
        alt: `Paciente sorrindo ${idCounter}`,
      });
    });
  }
  
  // Shuffle the initial pool
  return shuffleArray(images);
};

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function FadeGrid() {
  // Use state initialization function to avoid re-generating on every render
  const [active, setActive] = useState<GridImage[]>([]);
  const [reserve, setReserve] = useState<GridImage[]>([]);
  const [isClient, setIsClient] = useState(false);
  const lastIndicesRef = useRef<number[]>([]);

  useEffect(() => {
    setIsClient(true);
    const allImages = generateImages();
    // Since generateImages returns unique images (id is unique AND src is unique because IMAGE_SETS=1),
    // partitioning them here guarantees disjoint sets of unique images.
    setActive(allImages.slice(0, VISIBLE_COUNT));
    setReserve(allImages.slice(VISIBLE_COUNT));
  }, []);

  useEffect(() => {
    if (!active.length || !reserve.length) return;

    const timeout = setTimeout(() => {
      // Helper to check adjacency (Manhattan distance == 1 means adjacent)
      const isAdjacent = (i: number, j: number) => {
        const r1 = Math.floor(i / 3);
        const c1 = i % 3;
        const r2 = Math.floor(j / 3);
        const c2 = j % 3;
        return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
      };

      // Try to find a valid single slot
      let slotIdx = -1;
      let attempts = 0;
      const maxAttempts = 50;
      
      // We look at the last few updates to ensure distance and variety
      const recentHistory = lastIndicesRef.current; // e.g. [oldest, ..., newest]

      while (attempts < maxAttempts) {
        attempts++;
        const candidate = Math.floor(Math.random() * VISIBLE_COUNT);

        // 1. History Rule: Don't update a slot that was recently updated
        // Keep a buffer of ~4 items (since 9 total slots, 4 is nearly half)
        if (recentHistory.includes(candidate)) continue;

        // 2. Distance Rule: Don't update a slot adjacent to the *very last* update
        // or maybe the last 2 updates to keep things spread out
        const lastOne = recentHistory[recentHistory.length - 1];
        if (lastOne !== undefined && isAdjacent(candidate, lastOne)) continue;
        
        const secondLast = recentHistory[recentHistory.length - 2];
        if (secondLast !== undefined && isAdjacent(candidate, secondLast)) continue;

        // Valid
        slotIdx = candidate;
        break;
      }

      // Fallback if strict rules fail
      if (slotIdx === -1) {
        const available = Array.from({ length: VISIBLE_COUNT }, (_, i) => i)
             .filter(i => !recentHistory.includes(i));
        if (available.length > 0) {
            slotIdx = available[Math.floor(Math.random() * available.length)];
        } else {
            slotIdx = Math.floor(Math.random() * VISIBLE_COUNT);
        }
      }

      // Update History (keep last 4)
      const newHistory = [...recentHistory, slotIdx];
      if (newHistory.length > 4) newHistory.shift();
      lastIndicesRef.current = newHistory;

      // Swap Logic
      const reserveIdx = Math.floor(Math.random() * reserve.length);
      const oldImage = active[slotIdx];
      const newImage = reserve[reserveIdx];

      const newActive = [...active];
      newActive[slotIdx] = newImage;
      
      const newReserve = [...reserve];
      newReserve[reserveIdx] = oldImage;

      setActive(newActive);
      setReserve(newReserve);
    }, 1400); // Staggered interval: one update every 1.4s

    return () => clearTimeout(timeout);
  }, [active, reserve]);


  if (!isClient) return null; // Prevent hydration mismatch with random generation

  return (
    <div className="grid grid-cols-3 gap-2 lg:gap-4 w-full h-full p-2 lg:p-4 bg-white dark:bg-card-dark rounded-[2.5rem] shadow-2xl overflow-hidden">
      {active.map((img, index) => (
        <div
          key={index}
          className="relative aspect-square overflow-hidden rounded-xl lg:rounded-2xl bg-gray-100 dark:bg-gray-800"
        >
          <AnimatePresence>
            <motion.img
              key={img.id}
              src={img.src}
              alt={img.alt}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
