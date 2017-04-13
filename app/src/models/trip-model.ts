export class TripModel {
    
    constructor(
        public avgSpeed: number, 
        public distance: number, 
        public duration: number,
        public endTime: any,
        public id: string,
        public points: any[],
        public profile: string,
        public startTime: any,
        public type: string
    ) {}
}