import type React from 'react';

export interface IQueryFormContainer {
  children: React.ReactNode;
}

export const QueryFormContainer = ({ children }: IQueryFormContainer) => {
  // const refScrollArea = useRef<HTMLDivElement | null>(null);
  // const [, setReRender] = useState(0);

  // useEffect(() => {
  //   const rerender = () => {
  //     setReRender(x => x + 1);
  //   };

  //   // rerender in order to resize the <PDScrollArea/> children
  //   window.addEventListener('resize', rerender);

  //   return () => {
  //     window.removeEventListener('resize', rerender);
  //   };
  // }, []);

  return (
    // <PDScrollArea
    //   ref={refScrollArea}
    //   verticalScrollClassNames="!bottom-0" // remove default bottom space because we need only a vertical scroll
    // >
    <div
      className="flex w-full max-w-full flex-col gap-6 overflow-x-hidden pr-4"
    // style={{
    //   width: refScrollArea.current?.clientWidth,
    // }}
    >
      {children}
    </div>
    // </PDScrollArea>
  );
};
