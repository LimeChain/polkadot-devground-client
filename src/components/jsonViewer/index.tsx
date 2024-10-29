import {
  Binary,
  FixedSizeBinary,
} from 'polkadot-api';
import JsonView, { type JsonViewProps } from 'react18-json-view';
import 'react18-json-view/src/style.css';

import { PDScrollArea } from '@components/pdScrollArea';

const normalizeData = (data: unknown): unknown => {
  // base case
  if (typeof data !== 'object' || data == null) {
    return data;
  }
  if (data instanceof Binary || data instanceof FixedSizeBinary) {
    return data.asHex();
  }
  if (Array.isArray(data)) {
    return data.map(normalizeData);
  }
  return Object.fromEntries(
    Object.entries(data).map(([
      key,
      value,
    ]) => [
      key,
      normalizeData(value),
    ] as const));
};

export const JsonViewer = (props: JsonViewProps) => {
  const { src } = props;

  return (
    <PDScrollArea className="h-[30rem]">
      <JsonView
        {...props}
        src={normalizeData(src)}
        theme="atom"
      />
    </PDScrollArea>
  );
};
