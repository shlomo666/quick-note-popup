exports.swapArrItems = function (arr, index1, index2) {
  [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
};
