type Entry = any;

//Returns array of every tagged entry by tag
export const groupBy = (arr: Entry[], property: string) => {
  return arr.reduce((memo, x) => {
    for (let e in x[property]) {
      if (!memo[x[property][e]]) {
        memo[x[property][e]] = [];
      }
      memo[x[property][e]].push(x);
    }
    return memo;
  }, {});
};

// Splits the stringified array of tags before grouping
export const processAndGroup = (arr: Entry[], property: string) => {
  const formattedArray = arr.map((e) => {
    e[property] = e[property].split(",");
    return e;
  });
  return groupBy(formattedArray, property);
};

export const processAndGroupByTag = (arr: Entry[]) => {
  const formattedArray = arr.map((e) => {
    e["tags"] = e["tags"].split(",");
    return e;
  });
  return groupBy(formattedArray, "tags");
};
