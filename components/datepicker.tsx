import * as React from "react";
import { Platform, Pressable } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react-native";
import { View, Text } from "react-native";

// Mocking shadcn-style components for React Native
const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) => (
  <Text style={{ fontWeight: '500', marginBottom: 6 }}>{children}</Text>
);

export function DatePickerDemo() {
  const [date, setDate] = React.useState(new Date());
  const [show, setShow] = React.useState(false);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // Android closes the picker immediately; iOS keeps it open in certain modes
    if (Platform.OS === 'android') setShow(false);
    
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={{ gap: 6 }}>
      <Label htmlFor="geburtsdatum">Geburtsdatum</Label>
      
      <Pressable 
        onPress={() => setShow(true)}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
          borderWidth: 1,
          borderColor: '#e2e8f0',
          borderRadius: 8,
          backgroundColor: pressed ? '#f8fafc' : 'white',
          width: '100%'
        })}
      >
        <CalendarIcon size={16} color="#64748b" style={{ marginRight: 8 }} />
        <Text style={{ color: date ? '#0f172a' : '#64748b' }}>
          {date ? format(date, "dd.MM.yyyy") : "Pick a date"}
        </Text>
      </Pressable>

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange}
          maximumDate={new Date()} // Useful for birthdates
        />
      )}
    </View>
  );
}
