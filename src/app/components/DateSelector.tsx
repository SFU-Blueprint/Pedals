import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type DateSelectorProps = React.ComponentProps<typeof DatePicker>;

export default function DateSelector(props: DateSelectorProps) {
  return (
    <DatePicker
      showIcon
      toggleCalendarOnIconClick
      dateFormat="MMM d, yyyy"
      className="uppercase"
      {...props}
    />
  );
}