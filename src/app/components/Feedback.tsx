import Image from "next/image";

interface FeedbackProps extends React.ComponentPropsWithoutRef<"div"> {
  type: FeedbackType;
}

export enum FeedbackType {
  Success,
  Warning,
  Error,
  Loading
}

export interface FeedbackInterface {
  type: FeedbackType;
  message: string;
}

export default function Feedback({ type, ...props }: FeedbackProps) {
  const colorMap: Record<FeedbackType, string> = {
    [FeedbackType.Success]: "bg-pedals-green text-pedals-white",
    [FeedbackType.Warning]: "bg-pedals-yellow",
    [FeedbackType.Error]: "bg-pedals-red text-pedals-white",
    [FeedbackType.Loading]: "bg-pedals-darkgrey text-pedals-white"
  };

  const svgMap: Record<FeedbackType, React.ReactElement> = {
    [FeedbackType.Success]: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="21"
        viewBox="0 0 20 21"
        fill="none"
        className="h-5 w-5"
      >
        <path
          d="M18.3334 9.73333V10.5C18.3324 12.297 17.7505 14.0456 16.6745 15.4849C15.5986 16.9241 14.0862 17.9771 12.3629 18.4866C10.6396 18.9961 8.7978 18.9349 7.11214 18.3122C5.42648 17.6894 3.98729 16.5384 3.00922 15.0309C2.03114 13.5234 1.56657 11.7401 1.68481 9.94693C1.80305 8.1538 2.49775 6.44694 3.66531 5.08089C4.83288 3.71485 6.41074 2.76282 8.16357 2.36679C9.91641 1.97076 11.7503 2.15195 13.3918 2.88333"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.3333 3.83334L10 12.175L7.5 9.67501"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    [FeedbackType.Warning]: (
      <svg
        width="20"
        height="17"
        viewBox="0 0 20 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 1L1 16H19L10 1Z"
          stroke="#252525"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 6V9"
          stroke="#252525"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 12H10.01"
          stroke="#252525"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    [FeedbackType.Error]: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="21"
        viewBox="0 0 20 21"
        fill="none"
        className="h-5 w-5"
      >
        <path
          d="M10.0001 18.8333C14.6025 18.8333 18.3334 15.1024 18.3334 10.5C18.3334 5.89762 14.6025 2.16666 10.0001 2.16666C5.39771 2.16666 1.66675 5.89762 1.66675 10.5C1.66675 15.1024 5.39771 18.8333 10.0001 18.8333Z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.5 8L7.5 13"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.5 8L12.5 13"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    [FeedbackType.Loading]: (
      <Image
        src="/loading.gif"
        alt="loading"
        width={20}
        height={20}
        unoptimized
      />
    )
  };
  const styles = `${colorMap[type]} ${props.className} z-40 flex w-fit gap-4 px-4 py-4 rounded-[3px] items-center`;
  return (
    <div className={styles}>
      {svgMap[type]}
      <p>{props.children}</p>
    </div>
  );
}
