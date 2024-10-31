import DatePicker from "react-datepicker";
import "./dateselector.css";

type DateSelectorProps = React.ComponentProps<typeof DatePicker> & {
  // declared the type of onChange to prevent TS error 
  // the error arises from using onSelect without prpo of selectMulitple
  onChange: (date: Date | null, event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
};

export default function DateSelector(props: DateSelectorProps) {
  const { selected,onChange, maxDate, className, isClearable, onSelect } = props;
  return (
    <DatePicker
      showYearDropdown
      dateFormatCalendar="MMMM"
      dateFormat="MMM d, yyyy"
      yearDropdownItemNumber={130}
      scrollableYearDropdown
      toggleCalendarOnIconClick
      showIcon
      placeholderText="Select Date"
      className={`${className} uppercase`}
      maxDate={maxDate}
      onChange={onChange}
      onSelect={onSelect}
      selected={selected}
      isClearable = {isClearable}
    />
  );
}
