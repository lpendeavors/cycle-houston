import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecondsToTime } from './seconds-to-time';

@NgModule({
    declarations: [
        SecondsToTime
    ],
    imports: [
        CommonModule
    ],
    exports: [
        SecondsToTime
    ]
})
export class PipesModule {}