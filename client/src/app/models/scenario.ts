import { Lamp } from "./lamp";

export class Scenario {
    name: string;
    idKnx: string;
    nameKnx: String;
    lights: Array<Lamp>;
    action: Boolean;
    time: any;
    repetition: Array<Object>;
    active: Boolean

    
    constructor(name: string, idKnx: string, nameKnx: string, lights:Array<Lamp>, action: boolean, time: any, repetition: Array<Object>, active: Boolean){
        this.name = name;
        this.idKnx  = idKnx;
        this.nameKnx = nameKnx;
        this.lights = lights;
        this.action = action;
        this.time = time;
        this.repetition = repetition;
        this.active = active
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

    setTime(time: any): void{
        this.time = time;
    }

    setRepetion(repetition: Array<Object>): void{
        this.repetition = repetition;
    }

    setActivation(active: Boolean): void{
        this.active = active;
    }

}