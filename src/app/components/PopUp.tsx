"use client";

interface PopUpProps extends React.ComponentPropsWithoutRef<"div"> {
  close: () => void;
  title: string;
}

export default function PopUp({ close, title, ...props }: PopUpProps) {
  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-20">
      <div className="flex h-1/2 w-2/5 flex-col rounded-xl !bg-pedals-white font-inter normal-case !text-pedals-black">
        <div className="flex h-2/5 w-full flex-row items-center justify-between rounded-t-xl !bg-pedals-yellow px-10">
          <p>{title}</p>
          <button
            type="button"
            className="!bg-transparent"
            onClick={close}
            aria-label="Close Password Recovery"
          >
            <svg
              width="46"
              height="46"
              viewBox="0 0 46 46"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M34.5 11.5L11.5 34.5"
                stroke="#252525"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.5 11.5L34.5 34.5"
                stroke="#252525"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        {props.children}
      </div>
    </div>
  );
}
