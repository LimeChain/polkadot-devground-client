import {
  formatDistanceToNow,
  subSeconds,
} from 'date-fns';

import { PDScrollArea } from '@components/scrollArea';
import {
  type IPDLink,
  PDLink,
} from '@components/ui/PDLink';
import {
  cn,
  formatNumber,
} from '@utils/helpers';

import styles from './styles.module.css';

interface IChainDataList {
  title: string;
  link: IPDLink['to'];
  linkText: string;
}

interface IRow {
  index: number;
}
const Row = (props: IRow) => {
  const { index } = props;

  const date = subSeconds(new Date(), index * 50); // fake date

  const timeAgo = formatDistanceToNow(date, { addSuffix: true });

  return (
    <PDLink to={`${formatNumber(21_382_130 - index)}`} className={styles['pd-explorer-list']}>
      <div>
        <p>Block# <strong>{formatNumber(21_382_130 - index)}</strong></p>
        <p>
          <span className="text-dev-black-300 dark:text-dev-purple-300">Includes</span>
          {' '}
          <span>2 Extrinsics</span> 46 Events
        </p>
      </div>
      <div>{timeAgo}</div>
    </PDLink>
  );
};

export const ChainDataList = ({ title, link, linkText }: IChainDataList) => {
  const dummyArray = Array.from({ length: 100 });
  return (
    <div className="flex flex-1 flex-col gap-y-3 overflow-hidden">
      <div className="flex items-center gap-3">
        <h5 className="text-h5-bold">{title}</h5>
        <PDLink
          to={link}
          className={cn(
            'font-geist !text-body2-regular',
            'text-dev-pink-500 transition-colors hover:text-dev-pink-400',
          )}
        >
          {linkText}
        </PDLink>
      </div>
      {
        link === '/latest-blocks' && (
          <PDScrollArea
            className="h-80 lg:h-full"
            viewportClassNames="py-3"
            verticalScrollClassNames="py-3"
          >
            {
              dummyArray.map((_, index) => (
                <Row key={index} index={index} />
              ))
            }
          </PDScrollArea>
        )
      }
      {
        link === '/signed-extrinsics' && (
          <PDScrollArea
            viewportClassNames="py-6"
            verticalScrollClassNames="py-6"
          >
            <>{/* TBD */}</>
          </PDScrollArea>
        )
      }
    </div>
  );
};
