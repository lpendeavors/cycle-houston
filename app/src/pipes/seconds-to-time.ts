import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SecondsToTime pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'secondsToTime'
})
export class SecondsToTime implements PipeTransform {
  /**
   * Takes a duration in seconds and converts it into date
   */
  transform(value: number) {
    return new Date(1970, 0, 1).setSeconds(value);
  }
}
