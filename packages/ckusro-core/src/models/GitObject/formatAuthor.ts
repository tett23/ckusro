import { Author } from '../GitObject';

// original code
// https://github.com/isomorphic-git/isomorphic-git/blob/00d9155c17f51667697200486e22dca09364c1d1/src/utils/formatAuthor.js#L1

export default function formatAuthor({
  name,
  email,
  timestamp,
  timezoneOffset: offestMinutes,
}: Author): string {
  return `${name} <${email}> ${timestamp} ${formatTimezoneOffset(
    offestMinutes,
  )}`;
}

// The amount of effort that went into crafting these cases to handle
// -0 (just so we don't lose that information when parsing and reconstructing)
// but can also default to +0 was extraordinary.

function formatTimezoneOffset(minutes: number) {
  let sign = simpleSign(negateExceptForZero(minutes));
  minutes = Math.abs(minutes);
  let hours = Math.floor(minutes / 60);
  minutes -= hours * 60;
  let strHours = String(hours);
  let strMinutes = String(minutes);
  if (strHours.length < 2) strHours = '0' + strHours;
  if (strMinutes.length < 2) strMinutes = '0' + strMinutes;
  return (sign === -1 ? '-' : '+') + strHours + strMinutes;
}

function simpleSign(n: number) {
  return Math.sign(n) || (Object.is(n, -0) ? -1 : 1);
}

function negateExceptForZero(n: number) {
  return n === 0 ? n : -n;
}
