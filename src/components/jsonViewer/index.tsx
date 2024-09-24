import JsonView, { type JsonViewProps } from 'react18-json-view';
import 'react18-json-view/src/style.css';

import { PDScrollArea } from '@components/pdScrollArea';
import { unwrapApiResult } from '@utils/papi/helpers';

export const JsonViewer = (props: JsonViewProps) => {
  const { src } = props;

  return (
    <PDScrollArea className="h-[30rem]">
      <JsonView
        {...props}
        theme="atom"
        src={unwrapApiResult(src)}
      />
    </PDScrollArea>
  );
};
