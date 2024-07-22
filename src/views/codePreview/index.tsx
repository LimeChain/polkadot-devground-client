import {
  useEffect,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';

import { cn } from '@utils/helpers';
import { decodeCodeFromBase64 } from '@utils/iframe';

const CodePreview = () => {
  const { previewId } = useParams();
  const [blobUrl, setBlobUrl] = useState<string | undefined>();

  useEffect(() => {
    if (previewId) {
      const decodedCode = decodeCodeFromBase64(previewId);
      if (decodedCode) {
        const blobUrl = URL.createObjectURL(new Blob([decodedCode], { type: 'text/html' }));
        setBlobUrl(blobUrl);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewId]);
  return (
    <>
      <iframe
        src={blobUrl}
        className={cn(
          'size-full flex-1 border-0',
          {
            ['hidden']: blobUrl === '',
          },
        )}
      />
    </>
  );
};

export default CodePreview;
