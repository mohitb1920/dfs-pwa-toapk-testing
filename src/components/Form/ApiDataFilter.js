function ApiDataFilter(arr, name, propertyName) {
  if (!arr) return [];

  let filteredArray = arr[name] || [];
  if (name === "season") {
    filteredArray = arr[name]?.filter((obj) => obj[propertyName[1]] === "Y");
  }

  let ans = filteredArray?.map((obj) => {
    if (name === "cropName")
      return {
        [propertyName[0]]: obj[propertyName[0]],
        [propertyName[2]]: obj[propertyName[2]],
        [propertyName[3]]: obj[propertyName[3]],
      };
    return {
      [propertyName[0]]: obj[propertyName[0]],
      [propertyName[2]]: obj[propertyName[2]],
    };
  });

  return ans || [];
}

export default ApiDataFilter;
