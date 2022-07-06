export const calculateCourseRating = (able: string, willing: string) => {
  if (able === "With Effort" && willing === "Unwilling") {
    return 1;
  } else if (able === "Able" && willing === "Unwilling") {
    return 2;
  } else if (able === "With Effort" && willing === "Willing") {
    return 3;
  } else if (able === "Able" && willing === "Willing") {
    return 4;
  } else if (able === "With Effort" && willing === "Very Willing") {
    return 5;
  } else if (able === "Able" && willing === "Very Willing") {
    return 6;
  } else {
    return 0;
  }
};
