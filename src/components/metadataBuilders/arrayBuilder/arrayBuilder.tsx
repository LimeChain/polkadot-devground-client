import { NotImplemented } from '@components/invocationArgsMapper/notImplemented';
import { ArrayVarBuilderCore } from '@components/metadataBuilders/arrayBuilder/arrayBuilderCore';
import { BitstreamBuilder } from '@components/metadataBuilders/bitstreamBuilder';
import { varIsBinary } from '@utils/papi/helpers';

import type { IArrayVarBuilder } from '@components/invocationArgsMapper/types';

const ArrayVarBuilder = ({ data, onChange }: IArrayVarBuilder) => {
  try {
    if (!varIsBinary(data)) {
      return (
        <ArrayVarBuilderCore
          key={`data-var-${data.len}-${data.value.id}`}
          data={data}
          onChange={onChange}
        />
      );
    } else {
      return (
        <BitstreamBuilder
          minLength={data.len}
          onChange={onChange}
        />
      );
    }
  } catch (error) {
    console.error(error);
    return <NotImplemented />;
  }
};

export default ArrayVarBuilder;
