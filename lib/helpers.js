export function caseInsensitiveSearchString(searchString) {
  return new RegExp(`^${searchString}$`, 'i');
}

export function validateReqBody({ body, expectedPropertys }) {
  if (!body) return false;
  if (Object.keys(body).length !== expectedPropertys.length) return false;
  if (!Object.keys(body).every((key) => expectedPropertys.includes(key))) return false;
  if (!Object.values(body).every((val) => !['', null, undefined].includes(val))) return false;
  return true;
}

export function findHashtags(str) {
  return str.split(' ').filter((x) => x[0] === '#');
}
