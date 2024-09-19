import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { Icon } from "@components/icon";
import { cn } from "@utils/helpers";

interface IPageHeader {
  title: string;
  location?: string;
  blockNumber?: string;
}

export const PageHeader = (props: IPageHeader) => {
  const { title, location = -1, blockNumber } = props;
  const navigate = useNavigate();

  const goBack = useCallback(() => {
    if (location === -1) {
      navigate(-1);
    } else {
      navigate(location);
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center">
      <div
        className={cn(
          "mr-8 cursor-pointer duration-300 ease-out",
          "bg-dev-purple-700 p-2 dark:bg-dev-purple-50",
          "hover:bg-dev-purple-900 hover:dark:bg-dev-purple-200"
        )}
        onClick={goBack}
      >
        <Icon
          name="icon-arrowLeft"
          className=" text-dev-white-200 dark:text-dev-purple-700"
        />
      </div>
      <h4 className="mr-2 font-h4-light">{title}</h4>
      {blockNumber && <h4 className="font-h4-bold">{blockNumber}</h4>}
    </div>
  );
};
