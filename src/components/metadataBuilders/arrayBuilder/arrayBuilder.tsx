import { NotImplemented } from '@components/invocationArgsMapper/notImplemented';
import { ArrayVarBuilderCore } from '@components/metadataBuilders/arrayBuilder/arrayBuilderCore';
import { BinaryBuilder } from '@components/metadataBuilders/binaryBuilder';
import { varIsBinary } from '@utils/papi/helpers';

import type { IArrayVarBuilder } from '@components/invocationArgsMapper/types';

const ArrayVarBuilder = ({ array, onChange }: IArrayVarBuilder) => {
  try {
    if (!varIsBinary(array)) {
      return (
        <ArrayVarBuilderCore
          key={`array-var-${array.len}-${array.value.id}`}
          array={array}
          onChange={onChange}
        />
      );
    } else {
      return (
        <BinaryBuilder
          minLength={array.len}
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
