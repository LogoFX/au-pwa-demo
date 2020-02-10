
export function icon(icon: string) {
  return function (constructorFn: Function){
    constructorFn.prototype.icon =  icon;
    };
  

}


