import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecondsToTime } from './seconds-to-time';
import { SortBy } from './sort-by';

@NgModule({
    declarations: [
        SecondsToTime,
        SortBy
    ],
    imports: [
        CommonModule
    ],
    exports: [
        SecondsToTime,
        SortBy
    ]
})
export class PipesModule {}