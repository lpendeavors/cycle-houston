import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SortBy pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'sortBy',
})
export class SortBy implements PipeTransform {
  /**
   * Takes an array and sorts it by given object field.
   */
  transform(array: Array<any>, args: string): Array<string> {
    if(!array || array === undefined || array.length === 0) return null;

    array.sort((a: any, b: any) => {
      if(a.startTime < b.startTime) {
        return -1;
      } else if (a.startTime > b.startTime) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}