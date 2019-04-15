export class Lamp {
    name: string;
    id: string;

    constructor(name: string, id: string){
        this.name = name;
        this.id  = id;
    }

    getName():string{
       return this.name;
    }

    getId():string{
        return this.id;
     }
    
}