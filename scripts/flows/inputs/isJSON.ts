export default function isJSON(input: unknown) {
  if (typeof input === "object") {
    return [true, input];
  }

  if (typeof input !== "string") {
    return [false, input];
  }

  try {
    const json = JSON.parse(input);
    return [true, json];
  } catch (err) {
    return [false, input];
  }
}
