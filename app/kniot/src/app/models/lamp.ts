export class Lamp {
    name: string;
    id: string;
    state: boolean;

    constructor(name: string, id: string, state: boolean){
        this.name = name;
        this.id  = id;
        this.state = state;
    }

    getName(): string{
       return this.name;
    }

    getId(): string{
        return this.id;
     }

     getState(): boolean{
         return this.state;
     }
    
}