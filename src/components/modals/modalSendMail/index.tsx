import { sendForm } from '@emailjs/browser';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
// eslint-disable-next-line import/no-named-as-default
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'react-hot-toast';

import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';

import {
  type IModal,
  Modal,
} from '../modal';

interface IModalGithubLogin extends Pick<IModal, 'onClose'> {
  title: string;
}

const publicKey = import.meta.env.VITE_EMAIL_PUBLIC_KEY;
const serviceId = import.meta.env.VITE_EMAIL_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAIL_TEMPLATE_ID;
const recaptchaKey = import.meta.env.VITE_RECAPTCHA_KEY;

const MIN_INTERVAL = 60000; // 1 minute in milliseconds

export const ModalSendMail = ({ title, onClose }: IModalGithubLogin) => {
  const formRef = useRef<HTMLFormElement>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [
    isSending,
    setIsSending,
  ] = useState(false);
  const [
    captchaVerified,
    setCaptchaVerified,
  ] = useState(false);
  const [
    lastSentTime,
    setLastSentTime,
  ] = useState<number | null>(null);

  useEffect(() => {
    const storedLastSentTime = localStorage.getItem('lastSentTime');
    if (storedLastSentTime) {
      setLastSentTime(Number(storedLastSentTime));
    }
  }, []);

  const sendEmail = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);

    if (!recaptchaRef.current?.getValue()) {
      toast.error('Please complete the reCAPTCHA');
      setIsSending(false);
      return;
    }

    const now = Date.now();
    if (lastSentTime && now - lastSentTime < MIN_INTERVAL) {
      toast.error('You are sending emails too quickly. Please wait a moment.');
      setIsSending(false);
      return;
    }

    try {
      await sendForm(serviceId, templateId, formRef.current!, publicKey);
      toast.success('Email sent successfully');
      setLastSentTime(now);
      localStorage.setItem('lastSentTime', now.toString());
      onClose();
    } catch {
      toast.error('Failed to send email');
    } finally {
      setIsSending(false);
      recaptchaRef.current?.reset();
      setCaptchaVerified(false);
    }
  }, [
    lastSentTime,
    onClose,
  ]);

  const onCaptchaChange = useCallback((value: string | null) => {
    setCaptchaVerified(!!value);
  }, []);

  return (
    <Modal
      onClose={onClose}
      className={cn(
        'w-96',
        'flex flex-col gap-10 p-6',
        'border border-dev-purple-300',
        'dark:border-dev-purple-700',
      )}
    >
      <h5 className="self-start font-h5-bold">{title}</h5>
      <form
        ref={formRef}
        className="flex flex-col"
        onSubmit={sendEmail}
      >
        <input
          name="heading"
          placeholder="Title"
          className={cn(
            'mb-6 p-4',
            'border border-dev-white-900',
            'placeholder:text-dev-black-1000 placeholder:font-body2-regular',
            'dark:border-dev-purple-700 dark:bg-transparent dark:placeholder:text-white',
          )}
        />
        <textarea
          name="message"
          placeholder="Content"
          className={cn(
            'mb-6 p-4',
            'border border-dev-white-900',
            'placeholder:text-dev-black-1000 placeholder:font-body2-regular',
            'dark:border-dev-purple-700 dark:bg-transparent dark:placeholder:text-white',
          )}
        />
        <ReCAPTCHA
          ref={recaptchaRef}
          className="m-auto"
          onChange={onCaptchaChange}
          sitekey={recaptchaKey}
        />
        <button
          disabled={isSending || !captchaVerified}
          type="submit"
          className={cn(
            'flex justify-center',
            'mb-2 mt-6 p-4 transition-colors',
            'font-geist text-white font-body2-bold',
            'bg-dev-pink-500',
            'hover:bg-dev-pink-400',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {
            isSending
              ? (
                <Icon
                  className="animate-spin"
                  name="icon-loader"
                />
              )
              : 'Submit'
          }
        </button>
        <button
          className={cn('p-4 font-geist transition-colors font-body2-bold hover:text-dev-white-1000')}
          onClick={onClose}
        >
          Cancel
        </button>
      </form>
    </Modal>
  );
};
