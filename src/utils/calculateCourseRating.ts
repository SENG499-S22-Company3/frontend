export const calculateCourseRating = (able: string, willing: string) => {
  if (able === "With Effort" && willing === "Unwilling") {
    return 20;
  } else if (able === "Able" && willing === "Unwilling") {
    return 39;
  } else if (able === "With Effort" && willing === "Willing") {
    return 40;
  } else if (able === "Able" && willing === "Willing") {
    return 78;
  } else if (able === "With Effort" && willing === "Very Willing") {
    return 100;
  } else if (able === "Able" && willing === "Very Willing") {
    return 195;
  } else {
    return 0;
  }
};
