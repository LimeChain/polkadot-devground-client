import ReactJson from '@microlink/react-json-view';

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
      <ReactJson
        src={json}
        iconStyle="circle"
        theme={theme === 'dark' ? 'monokai' : 'rjv-default'}
        style={{
          backgroundColor: 'transparent',
        }}
      />
    </PDScrollArea>
  );
};
