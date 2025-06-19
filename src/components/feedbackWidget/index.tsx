import { useEffect } from 'react';

import { FEEDBACK_WIDGET_BOARD } from '@constants/auth';

const FeedbackWidget = () => {
  useEffect(() => {
    const win = window as any;

    if (typeof win.Featurebase !== 'function') {
      win.Featurebase = function () {
        // eslint-disable-next-line prefer-rest-params
        (win.Featurebase.q = win.Featurebase.q || []).push(arguments);
      };
    }
    win.Featurebase('initialize_feedback_widget', {
      organization: 'LimeChain', // Replace this with your organization name, copy-paste the subdomain part from your Featurebase workspace url (e.g. https://*yourorg*.featurebase.app)
      theme: 'dark',
      placement: 'right', // optional - remove to hide the floating button
      defaultBoard: FEEDBACK_WIDGET_BOARD, // optional - preselect a board
      locale: 'en', // Change the language, view all available languages from https://help.featurebase.app/en/articles/8879098-using-featurebase-in-my-language 
      metadata: null, // Attach session-specific metadata to feedback. Refer to the advanced section for the details: https://help.featurebase.app/en/articles/3774671-advanced#7k8iriyap66
    });
  }, []);

  return (
    <>
      <div>
        {/*If you wish to open the widget using your own button you can do so here.
           To get rid of our floating button, remove 'placement' from the Featurebase('initialize_feedback_widget') call above.
          */}
        {/* <button data-featurebase-feedback>Open Widget</button> */}
      </div>
    </>
  );
};

export default FeedbackWidget;
