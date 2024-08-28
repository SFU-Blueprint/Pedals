interface FeedbackProps extends React.ComponentPropsWithoutRef<"div"> {
  type: FeedbackType;
}

export enum FeedbackType {
  Success,
  Warning,
  Error
}

export default function Feedback({ type, ...props }: FeedbackProps) {
  const colorMap: Record<FeedbackType, string> = {
    [FeedbackType.Success]: "pedals-green",
    [FeedbackType.Warning]: "pedals-yellow",
    [FeedbackType.Error]: "pedals-red"
  };
  const styles = `!bg-${colorMap[type]} absolute bottom-9 right-1/2 flex w-[400px] translate-x-1/2 flex-row justify-evenly rounded-xl py-4`;
  return (
    <div className={styles}>
      <svg
        width="20"
        className="translate-y-[6px]"
        height="17"
        viewBox="0 0 20 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.24035 1.79773L1.22208 13.5142C1.07738 13.7648 1.00082 14.0489 1.00001 14.3383C0.999196 14.6276 1.07417 14.9121 1.21746 15.1635C1.36076 15.4149 1.56738 15.6244 1.81678 15.7712C2.06617 15.9179 2.34964 15.9968 2.63899 16H16.6755C16.9649 15.9968 17.2484 15.9179 17.4978 15.7712C17.7471 15.6244 17.9538 15.4149 18.0971 15.1635C18.2404 14.9121 18.3153 14.6276 18.3145 14.3383C18.3137 14.0489 18.2372 13.7648 18.0925 13.5142L11.0742 1.79773C10.9265 1.55421 10.7185 1.35287 10.4703 1.21314C10.2221 1.07341 9.94209 1 9.65727 1C9.37245 1 9.09243 1.07341 8.84424 1.21314C8.59606 1.35287 8.38807 1.55421 8.24035 1.79773Z"
          stroke="#252525"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.65723 6.05676V9.37118"
          stroke="#252525"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.65723 12.6855H9.66441"
          stroke="#252525"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p>{props.children}</p>
    </div>
  );
}
