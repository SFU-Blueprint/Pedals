import DatePicker from "react-datepicker";
import "./custom-datepicker.css";

type DateSelectorProps = React.ComponentProps<typeof DatePicker>;

export default function DateSelector(props: DateSelectorProps) {
  return (
    <DatePicker
      showYearDropdown
      dateFormatCalendar="MMMM"
      yearDropdownItemNumber={130}
      scrollableYearDropdown
      {...props}
    />
    // <DatePicker
    //   showIcon
    //   toggleCalendarOnIconClick
    //   dateFormat="MMM d, yyyy"
    //   className="uppercase"
    //   {...props}
    // />
  );
}
