export interface ITPoint {
  x: number;
  y: number;
}

export const calculateDeltas = (
  startPoint: ITPoint,
  endPoint: ITPoint,
): { dx: number; dy: number; absDx: number; absDy: number } => ({
  dx: endPoint.x - startPoint.x,
  dy: endPoint.y - startPoint.y,
  absDx: Math.abs(endPoint.x - startPoint.x),
  absDy: Math.abs(endPoint.y - startPoint.y),
});

interface ICalculateCanvasDimensions {
  absDx: number;
  absDy: number;
  boundingBoxBuffer: { vertical: number; horizontal: number };
}

export const calculateCanvasDimensions = ({
  absDx,
  absDy,
  boundingBoxBuffer,
}: ICalculateCanvasDimensions): {
  canvasWidth: number;
  canvasHeight: number;
} => ({
  canvasWidth: absDx + (2 * boundingBoxBuffer.horizontal),
  canvasHeight: absDy + (2 * boundingBoxBuffer.vertical),
});

interface ICalculateControlPoints {
  absDx: number;
  absDy: number;
  curveRadius: number; // New property to control the radius
}

export const calculateControlPoints = ({ absDx, absDy, curveRadius }: ICalculateControlPoints): {
  p1: ITPoint;
  p2: ITPoint;
  p3: ITPoint;
  p4: ITPoint;
  boundingBoxBuffer: {
    vertical: number;
    horizontal: number;
  };
} => {
  const p1 = { x: 0, y: 0 };
  const p2 = { x: absDx / 2, y: 0 };
  const p3 = { x: absDx / 2, y: absDy };
  const p4 = { x: absDx, y: absDy };

  const boundingBoxBuffer = { vertical: curveRadius, horizontal: curveRadius };

  return { p1, p2, p3, p4, boundingBoxBuffer };
};
