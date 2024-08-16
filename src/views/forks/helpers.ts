import type { BlockItem } from './forks';

export const groupData = (data: Record<string, BlockItem[]>): Record<string, BlockItem[]> => {
  return Object.entries(data).reduce<Record<string, BlockItem[]>>((acc, [blockNumber, blocks]) => {
    // Sort blocks so that finalized blocks come first
    const sortedBlocks = blocks.sort((a, b) => (a.isFinalized === b.isFinalized ? 0 : a.isFinalized ? -1 : 1));

    acc[blockNumber] = sortedBlocks.map(block => ({
      ...block,
      blockNumber: Number(blockNumber),
    }));

    return acc;
  }, {});
};

export const smoothScroll = async (element: HTMLElement, targetPosition: number, duration = 400): Promise<void> => {
  const start = element.scrollLeft;
  const change = targetPosition - start;
  const startTime = performance.now();

  return new Promise((resolve) => {
    function animateScroll(currentTime: number) {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      element.scrollLeft = (start + change * progress);

      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(animateScroll);
  });
};
