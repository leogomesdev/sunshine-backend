/**
 * Create an object composed of the picked object properties
 * @param object Record<string, any>
 * @param keys string[]
 * @returns Record<string, any>
 */
const pick = (object: Record<string, any>, keys: string[]) =>
  keys.reduce((obj: any, key: string): Record<any, string> => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});

export default pick;
