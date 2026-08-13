const calcAge = (dob: Date, base: Date): number => {
  const birthYear = dob.getUTCFullYear();
  const birthMonth = dob.getUTCMonth();
  const birthDate = dob.getUTCDate();

  let age = base.getFullYear() - birthYear;

  const hasBirthdayPassed =
    base.getMonth() > birthMonth ||
    (base.getMonth() === birthMonth && base.getDate() >= birthDate);

  if (!hasBirthdayPassed) {
    age--;
  }

  return age;
};

export const getAgeLabel = (
  birthDate: Date,
  startBaseDate?: Date,
  endBaseDate?: Date,
) => {
  const startAge = startBaseDate
    ? calcAge(birthDate, startBaseDate)
    : undefined;

  const endAge = endBaseDate ? calcAge(birthDate, endBaseDate) : undefined;

  if (startAge !== undefined && endAge !== undefined) {
    return startAge === endAge ? `${startAge}歳` : `${startAge}→${endAge}歳`;
  }

  if (startAge !== undefined) {
    return `${startAge}歳`;
  }

  if (endAge !== undefined) {
    return `${endAge}歳`;
  }

  return "";
};
