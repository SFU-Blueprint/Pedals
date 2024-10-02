import DatePicker from "react-datepicker";
import "./dateselector.css";

type DateSelectorProps = React.ComponentProps<typeof DatePicker>;

export default function DateSelector(props: DateSelectorProps) {
  return (
    <DatePicker
      showYearDropdown
      dateFormatCalendar="MMMM"
      dateFormat="MMM d, yyyy"
      yearDropdownItemNumber={130}
      scrollableYearDropdown
      toggleCalendarOnIconClick
      showIcon
      {...props}
    />
  );
}
