import { styled } from 'styled-components';

import {
  calculateCanvasDimensions,
  calculateControlPoints,
  calculateDeltas,
  type ITPoint,
} from './helpers';

interface IArrowConfig {
  arrowFlipHorizontally?: boolean;
  arrowStrokeColor?: string;
  arrowHeadEndingSize?: number;
  lineStrokeWidth?: number;
  lineStrokeDasharray?: string;
  curveRadius?: number;
}

interface IArrowProps {
  className?: string;
  startPoint: ITPoint;
  endPoint: ITPoint;
  config?: IArrowConfig;
}

interface ITranslateProps {
  xTranslate: number;
  yTranslate: number;
}

const Line = styled.svg.withConfig({
  shouldForwardProp: (prop) => ![
    'xTranslate',
    'yTranslate',
  ].includes(prop),
}) <ITranslateProps>`
  pointer-events: none;
  z-index: 1;
  position: absolute;
  left: 0;
  top: 0;
  transform: ${({ xTranslate, yTranslate }) => `translate(${xTranslate}px, ${yTranslate}px)`};
`;

const RenderedLine = styled.path<{ strokeWidth: number }>`
  transition: stroke 300ms;
  stroke-width: ${({ strokeWidth }) => strokeWidth}px;
  stroke-linecap: butt;
  stroke-linejoin: butt;
`;

const Endings = styled(Line)`
  pointer-events: none;
  z-index: 10;
`;

const ArrowHeadEnding = styled.path.withConfig({
  shouldForwardProp: (prop) => ![
    'xTranslate',
    'yTranslate',
  ].includes(prop),
}) <ITranslateProps & { strokeWidth: number }>`
  transition: stroke 300ms;
  stroke-width: ${({ strokeWidth }) => strokeWidth}px;
  transform: ${({ xTranslate, yTranslate }) => `translate(${xTranslate}px, ${yTranslate}px)`};
`;

export const CurvedLineWithArrow = ({
  className,
  startPoint,
  endPoint,
  config,
}: IArrowProps) => {
  const defaultConfig = {
    arrowStrokeColor: '#B3B3B3',
    arrowHeadEndingSize: 24,
    lineStrokeWidth: 2,
    curveRadius: 30,
  };
  const currentConfig = {
    ...defaultConfig,
    ...config,
  };

  const {
    arrowStrokeColor,
    arrowHeadEndingSize,
    lineStrokeWidth,
    lineStrokeDasharray,
    arrowFlipHorizontally,
    curveRadius,
  } = currentConfig;

  const arrowHeadOffset = arrowHeadEndingSize / 2;

  const { absDx, absDy } = calculateDeltas(startPoint, endPoint);

  const effectiveAbsDy = absDy === 0 ? 0 : absDy;

  const { p1, p2, p3, p4, boundingBoxBuffer } = calculateControlPoints({
    absDx,
    absDy: effectiveAbsDy,
    curveRadius: absDy > 0 ? curveRadius : 0,
  });

  const { canvasWidth, canvasHeight } = calculateCanvasDimensions({
    absDx,
    absDy: effectiveAbsDy,
    boundingBoxBuffer,
  });

  // Calculate offsets based on arrow height
  const topOffset = (arrowHeadEndingSize + lineStrokeWidth) / 2;
  const adjustedHeight = arrowHeadEndingSize + lineStrokeWidth; // Ensures the line is centered vertically

  const canvasXOffset = Math.min(startPoint.x, endPoint.x);
  const canvasYOffset = Math.min(startPoint.y, endPoint.y) - topOffset;

  const curvedLinePath = absDy === 0
    ? `M ${p1.x} ${p1.y + topOffset} H ${p4.x - lineStrokeWidth}` // Horizontal line adjusted by top offset
    : `
    M ${p1.x} ${p1.y + topOffset}
    H ${p2.x - curveRadius}
    Q ${p2.x} ${p2.y + topOffset} ${p2.x} ${p2.y + curveRadius + topOffset}
    V ${p3.y - curveRadius}
    Q ${p3.x} ${p3.y + topOffset} ${p3.x + curveRadius} ${p3.y + topOffset}
    H ${p4.x - lineStrokeWidth}
    L ${p4.x - lineStrokeWidth} ${p4.y + topOffset}`;

  const strokeColor = arrowStrokeColor;

  return (
    <div className={className}>
      <Line
        height={canvasHeight + adjustedHeight}
        width={canvasWidth}
        xTranslate={canvasXOffset}
        yTranslate={canvasYOffset}
      >
        <RenderedLine
          d={curvedLinePath}
          fill="none"
          stroke={arrowStrokeColor}
          strokeDasharray={lineStrokeDasharray}
          strokeWidth={lineStrokeWidth}
        />
      </Line>
      <Endings
        height={canvasHeight + adjustedHeight}
        width={canvasWidth}
        xTranslate={canvasXOffset}
        yTranslate={canvasYOffset}
      >
        <g
          transform={arrowFlipHorizontally ? `translate(${p4.x + 1}, 0) scale(-1, 1)` : undefined}
        >
          <ArrowHeadEnding
            fill="none"
            stroke={strokeColor}
            strokeLinecap="round"
            strokeWidth={lineStrokeWidth}
            xTranslate={((p4.x - arrowHeadOffset) * 2) - (lineStrokeWidth)}
            yTranslate={p4.y - arrowHeadOffset + topOffset}
            d={`
            M ${(arrowHeadEndingSize / 5) * 2} 0
            L ${arrowHeadEndingSize} ${arrowHeadEndingSize / 2}
            L ${(arrowHeadEndingSize / 5) * 2} ${arrowHeadEndingSize}`}
          />
        </g>
      </Endings>
    </div>
  );
};

CurvedLineWithArrow.displayName = 'CurvedLineWithArrow';
