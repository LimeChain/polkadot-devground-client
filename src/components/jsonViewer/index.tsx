import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';

import { PDScrollArea } from '@components/pdScrollArea';

interface IJsonViewer {
  json: object;
}

export const JsonViewer = (props: IJsonViewer) => {
  const { json } = props;

  return (
    <PDScrollArea className="h-[30rem]">
      <JsonView
        src={json}
        theme="atom"
      />
    </PDScrollArea>
  );
};
