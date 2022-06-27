export const formatTime = (date: Date) => {
  return `${date.getHours()}:${date.getMinutes()}`;
};

export const formatDate = (date: Date) => {
  return `${date.getDate()} ${date.toLocaleString("default", {
    month: "long",
  })} ${date.getFullYear()}`;
};
