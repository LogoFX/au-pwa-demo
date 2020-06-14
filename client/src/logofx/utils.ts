export function clear<T>(array: T[]): T[] {
  array.splice(0, array.length);
  return array;
}

export function jsonClone(source: any): any {
  const seen = [];

  const json = JSON.stringify(source, function(key, val) {

    if (val != null && typeof val == "object") {
        if (seen.indexOf(val) >= 0) {
            return;
        }
        seen.push(val);
    }

    return val;

  });

  const temp = JSON.parse(json);

  return temp;
}

export function spreadClone(source: any): any {
  return {...source};
}

export function deepClone(obj: any): any {
    let copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" !== typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepClone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (const attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = deepClone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

