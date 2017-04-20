export class RideModel {
    
    public avgSpeed: number = 0;
    public distance: number = 0;
    public duration: number;
    public endTime: any;
    public id: string;
    public points: any[] = [];
    public profile: string;
    public startTime: any;
    public type: string;
    
    constructor() {}
    
    addCoord(lat: number, lng: number): void {
        this.points.push({
            lat: lat,
            lng: lng
        });
    }
}