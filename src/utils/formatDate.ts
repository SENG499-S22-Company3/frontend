export const formatTime = (date: Date) => {
  return `${date.getHours()}:${date.getMinutes()}`;
};

export const formatDate = (date: Date) => {
  return `${date.getDate()} ${date.toLocaleString("default", {
    month: "long",
  })} ${date.getFullYear()}`;
};

export const formatTimeString = (date: Date) => {
  let hours = date.getHours().toString();
  let minutes = date.getMinutes().toString();

  if (hours.length === 1) {
    hours = "0" + hours;
  }
  if (minutes.length === 1) {
    minutes = "0" + minutes;
  }
  return [hours, minutes];
};
