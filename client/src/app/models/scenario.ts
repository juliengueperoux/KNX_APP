import { Lamp } from "./lamp";

export class Scenario {
    name: string;
    idKnx: string;
    nameKnx: String;
    lights: Array<Lamp>;
    action: Boolean;
    date: Date;
    repetition: Object;

    
    constructor(name: string, idKnx: string, nameKnx: string, lights:Array<Lamp>, action: boolean, date: Date, repetition: Object){
        this.name = name;
        this.idKnx  = idKnx;
        this.nameKnx = nameKnx;
        this.lights = lights;
        this.action = action;
        this.date = date;
        this.repetition = repetition;
    }

    setName(name: string): void{
        this.name = name;
    }

    setIdKnx(id : string): void{
        this.idKnx = id;
    }

    setNameKnx(name : string): void{
        this.nameKnx = name;
    }

    setLights(lights: Array<Lamp>): void{
        this.lights = lights;
    }

    setAction(action: Boolean): void{
        this.action = action;
    }

    setDate(date: Date): void{
        this.date = date;
    }

    setRepetion(repetition: Object): void{
        this.repetition = repetition;
    }

}