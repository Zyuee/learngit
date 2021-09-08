
export function reconstructEllipse(originEllipse){
  let object = new Object();
  object.type = originEllipse.type;
  object.x = originEllipse.x;
  object.y = originEllipse.y;
  object.a = originEllipse.a;
  object.b = originEllipse.b;
  object.label = originEllipse.label;
  object.value = originEllipse.value;
  object.valueFromPreTask = originEllipse.valueFromPreTask;
  object.canDerive = originEllipse.canDerive;
  object.dataFormat = originEllipse.dataFormat;
  object.selectedItems = originEllipse.selectedItems;
  return object;
}

export function reconstructRectangle(originRetangle){
  let object = new Object();
  object.type = originRetangle.type;
  object.x = originRetangle.x;
  object.y = originRetangle.y;
  object.a = originRetangle.a;
  object.b = originRetangle.b;
  object.label = originRetangle.label;
  object.isReadyToRun =  originRetangle.isReadyToRun;
  object.canRun = originRetangle.canRun;
  let inputDatas = [];
  let outputDatas = [];
  originRetangle.selectedAlgorithm.inputDatas.forEach((item) => inputDatas.push({label: item.label}));
  originRetangle.selectedAlgorithm.outputDatas.forEach((item) => outputDatas.push({label: item.label}));
  object.selectedAlgorithm = {
    inputDatas: inputDatas,
    outputDatas: outputDatas,
    parameters : originRetangle.selectedAlgorithm.parameters
  };
  let nextTasks = [];
  let preTasks = [];
  originRetangle.nextTasks.forEach((item) => nextTasks.push({label: item.label}));
  originRetangle.preTasks.forEach((item) => preTasks.push({label: item.label}));
  object.nextTasks = nextTasks;
  object.preTasks = preTasks;
  return object;
}

export function reconstructArrow(originArrow){
  let object = new Object();
  object.type = originArrow.type;
  object.isReady = originArrow.isReady;
  object.start = {label: originArrow.start.label};
  object.end = {label: originArrow.end.label};
  return object;
}
