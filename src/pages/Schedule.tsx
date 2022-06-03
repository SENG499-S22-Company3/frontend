import React from "react";
import "devextreme/dist/css/dx.light.css";
import { Scheduler, View } from "devextreme-react/scheduler";

var appointments = [
  {
    text: "Meet with a customer",
    startDate: new Date("2021-05-21T15:00:00.000Z"),
    endDate: new Date("2021-05-21T16:00:00.000Z"),
  },
];

export const Schedule = () => {
  return (
    <Scheduler
      dataSource={appointments}
      textExpr="title"
      allDayExpr="dayLong"
      recurrenceRuleExpr="recurrence"
    >
      <View type="day" startDayHour={10} endDayHour={22} />
      <View type="week" startDayHour={10} endDayHour={22} />
      <View type="month" />
    </Scheduler>
  );
};
