export const formatTime = (date: Date) => {
  return `${date.getHours()}:${date.getMinutes()}`;
};

export const formatDate = (date: Date) => {
  return `${getNumberWithOrdinal(date.getDate())} ${date.toLocaleString(
    "default",
    {
      month: "long",
    }
  )}`;
};

function getNumberWithOrdinal(n: number) {
  const s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export const formatTimeString = (date: Date) => {
  let hours = date.getUTCHours().toString();
  let minutes = date.getUTCMinutes().toString();

  if (hours.length === 1) {
    hours = "0" + hours;
  }
  if (minutes.length === 1) {
    minutes = "0" + minutes;
  }
  return [hours, minutes];
};

export const getScheduleTime = (date: Date | string) => {
  let tempDate: Date;
  if (date instanceof Date) {
    tempDate = date;
  } else {
    tempDate = new Date(date);
  }
  const [hours, minutes] = formatTimeString(tempDate);

  const timeString = "2022-05-24T" + hours + ":" + minutes + ":00.000";

  return new Date(timeString);
};

export const getUTCDate = (date: Date) => {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes()
    )
  );
};

export const formatAMPM = (date: Date) => {
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const newMinutes = minutes < 10 ? "0" + minutes : minutes.toString();
  var strTime = hours + ":" + newMinutes + " " + ampm;
  return strTime;
};
