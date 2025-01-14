import { BitstreamBuilder } from '@components/metadataBuilders/bitstreamBuilder';
import { TupleBuilderCore } from '@components/metadataBuilders/tupleBuilder/tupleBuilderCore';
import { varIsBinary } from '@utils/papi/helpers';

import type { ITupleBuilder } from '@components/invocationArgsMapper/types';

const TupleBuilder = ({ tuple, onChange }: ITupleBuilder) => {
  if (!varIsBinary(tuple)) {
    return (
      <TupleBuilderCore
        onChange={onChange}
        tuple={tuple}
      />
    );
  } else {
    return (
      <div className="border-l pl-4 pt-2">
        <BitstreamBuilder
          minLength={0}
          onChange={onChange}
        />
      </div>
    );
  }
};

export default TupleBuilder;
