import { PDScrollArea } from '@components/scrollArea';
import {
  type IPDLink,
  PDLink,
} from '@components/ui/PDLink';
import { cn } from '@utils/helpers';

interface IChainDataList {
  title: string;
  link: IPDLink['to'];
  linkText: string;
}

export const ChainDataList = ({ title, link, linkText }: IChainDataList) => {
  return (
    <div className="grid grid-rows-[auto_1fr] gap-6">
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
      <PDScrollArea>
        <div />
        <div />
      </PDScrollArea>
    </div>
  );
};
