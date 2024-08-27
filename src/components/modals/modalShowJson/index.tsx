import ReactJson from '@microlink/react-json-view';

import { PDScrollArea } from '@components/pdScrollArea';
import { cn } from '@utils/helpers';

import {
  type IModal,
  Modal,
} from '../modal';

interface IModalShowJson extends Pick<IModal, 'onClose'> {
  data: { id: string };
}

export const ModalShowJson = (props: IModalShowJson) => {
  const { onClose, data } = props;

  return (
    <Modal
      onClose={onClose}
      className={cn(
        'w-5/6',
        'flex max-h-screen flex-col gap-8 overflow-auto p-6',
        'border border-dev-purple-300',
        'dark:border-dev-purple-700',
        'transition-all duration-300 ease-in-out',
      )}
    >
      <h5 className="self-start font-h5-bold">Extrinsics: ${data.id}</h5>
      <div className="flex flex-col " >
        <PDScrollArea
          className="h-[30rem]"
        >
          <ReactJson
            src={data}
            iconStyle="circle"
            theme="rjv-default"
            style={{
              backgroundColor: 'transparent',
            }}
          />
        </PDScrollArea>
      </div>
    </Modal>
  );
};
