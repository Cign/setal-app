import React, { useCallback, useState } from "react";
import { Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
// import { Config } from '../../config';

const DatePicker = ({ value, onChange }) => {
  const [dateSelected, setDateSelected] = useState(new Date());

  const onDateChange = useCallback(
    (_e, selectedDate) => {
      selectedDate && setDateSelected(selectedDate);
      onChange(selectedDate);
    },
    [onChange]
  );

  const onButtonPress = () => {
    Platform.OS === "android" &&
      DateTimePickerAndroid.open({
        testID: "dateTimePicker",
        value: dateSelected,
        mode: "date",
        minimumDate: new Date(),
        onChange: onDateChange,
      });
  };

  return Platform.OS === "ios" ? (
    <DateTimePicker
      testID="dateTimePicker"
      value={dateSelected}
      mode="date"
      minimumDate={new Date()}
      onChange={onDateChange}
      themeVariant="light"
    />
  ) : (
    <TouchableOpacity onPress={onButtonPress}>
      <Text style={{ fontSize: 16, fontWeight: "500" }} numberOfLines={2}>
        {value ?? dateSelected}
      </Text>
    </TouchableOpacity>
  );
};

export default DatePicker;
