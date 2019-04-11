import { Lamp } from "./lamp";

export class KnxMachine {
    name: string;
    ipAddr: string;
    port: number;
    lights: Array<Lamp>;

    
    constructor(n: string, i: string, p: number, l: Array<Lamp>){
        this.name = n;
        this.ipAddr = i;
        this.port = p;
        this.lights = l;
    }

    getName():string{
        return this.name;
     }

     getIpAddr():string{
        return this.ipAddr;
     }

     getPort():number{
        return this.port;
     }


     getLights():Array<Lamp>{
        return this.lights;
     }

}

