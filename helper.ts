export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function randomChoice<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomSample<T>(arr: T[], n: number): T[] {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

export function randomShuffle<T>(arr: T[]): T[] {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled;
}

// deno-lint-ignore no-explicit-any
export function counter(arr: any[]) {
  // deno-lint-ignore no-explicit-any
  const obj: { [key: string]: any } = {};
  arr.forEach(function (v) {
    if (v in obj) ++obj[v];
    else obj[v] = 1;
  });
  return obj;
}

export function mostCommon(obj: { [key: string]: number }, n: number) {
  let sortedList = [];
  sortedList = Object.entries(obj).sort((a, b) => {
    if (b[1] > a[1]) return 1;
    else if (b[1] < a[1]) return -1;
    else {
      if (a[0] > b[0]) return 1;
      else if (a[0] < b[0]) return -1;
      else return 0;
    }
  });
  return sortedList.map((el) => el[0]).slice(0, n);
}

export function ltrim(x: string, characters: string) {
  let start = 0;
  while (characters.indexOf(x[start]) >= 0) {
    start += 1;
  }
  return x.substr(start);
}
