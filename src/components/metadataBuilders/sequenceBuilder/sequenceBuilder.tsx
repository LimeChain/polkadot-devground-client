import { BitstreamBuilder } from '@components/metadataBuilders/bitstreamBuilder';
import { SequenceBuilderCore } from '@components/metadataBuilders/sequenceBuilder/sequenceBuilderCore';
import { varIsBinary } from '@utils/papi/helpers';

import styles from '../../invocationArgsMapper/styles.module.css';

import type { ISequenceBuilder } from '@components/invocationArgsMapper/types';

const SequenceBuilder = ({ sequence, onChange, placeholder }: ISequenceBuilder) => {
  if (!varIsBinary(sequence)) {
    return (
      <SequenceBuilderCore
        key={`sequence-${sequence.value.id}`}
        onChange={onChange}
        placeholder={placeholder}
        sequence={sequence}
      />
    );
  } else {
    return (
      <div className={styles.codecParam}>
        <BitstreamBuilder
          minLength={0}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    );
  }
};

export default SequenceBuilder;
