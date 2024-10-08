import { Icon } from '@components/icon';
import { PDLink } from '@components/pdLink';
import { cn } from '@utils/helpers';

export const MobileNotAllowed = () => {

  return (
    <div className="flex flex-col items-center justify-center gap-12 px-14">
      <Icon
        name="icon-pc"
        size={[96]}
      />
      <div className="flex flex-col">
        <h1 className="text-center text-2xl font-bold">Visit Desktop Site</h1>
        <p className="mt-4 text-center font-geist font-body1-regular">For the best experience, please visit the console from your personal computer</p>
        <PDLink
          to="/"
          className={cn(
            'mb-2 mt-10 w-full p-4 text-center transition-colors ',
            'font-geist text-white font-body2-bold',
            'bg-dev-pink-500',
            'hover:bg-dev-pink-400',
          )}
        >
          Back to Explorer
        </PDLink>
      </div>
    </div>
  );
};
