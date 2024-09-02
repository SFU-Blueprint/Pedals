"use client";

interface PopUpProps extends React.ComponentPropsWithoutRef<"div"> {
  title: string;
  closeAction: () => void;
}

export default function PopUp({ title, closeAction, ...props }: PopUpProps) {
  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-20">
      <div className="flex h-1/2 w-2/5 flex-col rounded-xl !bg-pedals-white font-inter normal-case leading-[150%] !text-pedals-black">
        <div className="flex h-2/5 w-full flex-row items-center justify-between rounded-t-xl !bg-pedals-yellow px-10">
          <h3>{title}</h3>
          <button
            type="button"
            className="h-[1.125rem] w-[1.125rem] !bg-transparent !p-0"
            onClick={closeAction}
            aria-label="Close"
          >
            <svg
              className="h-full w-full"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L17 17"
                stroke="#252525"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1 17L17 1"
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
