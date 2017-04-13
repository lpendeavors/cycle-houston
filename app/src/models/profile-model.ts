export class ProfileModel {
    
    constructor(
        public age: number,
        public gender: string,
        public ethnicity: string,
        public income: number,
        public homeZip: number,
        public workZip: number,
        public email: string
    ) {}
}