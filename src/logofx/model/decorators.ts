import { observable } from "aurelia-binding";

export function dirtyCheck(targetOrConfig: any, key: string, descriptor?: PropertyDescriptor) {
 
  console.log('dirtyCheck =>', targetOrConfig.isDirty);
  function makeDirty(oldValue, newValue) {
    console.log('isDirty => ', targetOrConfig);
    if (oldValue === newValue)
      return;

    targetOrConfig['isDirty'] = true;
  };

  return observable({
    changeHandler: 'makeDirty' 
  }, key, descriptor);
}
