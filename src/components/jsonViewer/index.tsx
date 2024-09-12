import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';
import 'react18-json-view/src/dark.css';

import { PDScrollArea } from '@components/pdScrollArea';
import { useStoreUI } from '@stores';

interface IJsonViewer {
  json: object;
}

export const JsonViewer = (props: IJsonViewer) => {
  const { json } = props;
  const theme = useStoreUI.use.theme?.();

  return (
    <PDScrollArea className="h-[30rem]">
      <JsonView
        src={json}
        theme={'atom'}
        dark={theme === 'dark'}
      />
    </PDScrollArea>
  );
};
