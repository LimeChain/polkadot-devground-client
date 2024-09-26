import type { IBlockItem } from '@custom-types/block';

export const groupData = (data: Record<string, IBlockItem[]>): Record<string, IBlockItem[]> => {
  return Object.entries(data).reduce<Record<string, IBlockItem[]>>((acc, [
    blockNumber,
    blocks,
  ]) => {
    // Sort blocks so that finalized blocks come first
    const sortedBlocks = blocks.sort((a, b) => (a.isFinalized === b.isFinalized ? 0 : a.isFinalized ? -1 : 1));

    acc[blockNumber] = sortedBlocks.map((block) => ({
      ...block,
      blockNumber: Number(blockNumber),
    }));

    return acc;
  }, {});
};

export const smoothScroll = async (
  element: HTMLElement,
  targetPosition: 'top' | 'left',
  offset: number,
  duration = 400,
  maxSpeed = 2, // Maximum pixels per millisecond
): Promise<void> => {
  const scrollPosition = targetPosition === 'top' ? 'scrollTop' : 'scrollLeft';
  const start = element[scrollPosition];
  const change = offset - start;

  // Get the absolute scroll distance
  const scrollDistance = Math.abs(change);

  // Adjust duration based on scroll distance and max speed
  const adjustedDuration = Math.min(duration, scrollDistance / maxSpeed);
  const startTime = performance.now();

  // Easing function for smoother animation (ease-in-out in this case)
  const easeInOutQuad = (t: number): number => t < 0.5 ? 2 * t * t : -1 + ((4 - (2 * t)) * t);

  return new Promise((resolve) => {
    const animateScroll = (currentTime: number) => {
      const timeElapsed = currentTime - startTime;

      // Progress from 0 to 1 over time
      const progress = Math.min(timeElapsed / adjustedDuration, 1);
      const easedProgress = easeInOutQuad(progress);

      element[scrollPosition] = start + (change * easedProgress);

      if (timeElapsed < adjustedDuration) {
        requestAnimationFrame(animateScroll);
      } else {
        element[scrollPosition] = offset;
        resolve();
      }
    };

    requestAnimationFrame(animateScroll);
  });
};
