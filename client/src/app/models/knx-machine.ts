import { Lamp } from "./lamp";

export class KnxMachine {
    _id: string;
    name: string;
    ipAddr: string;
    port: number;
    lights: Array<Lamp>;
    interval: number;
    startChain: boolean;
    sensDirect: boolean;


    constructor(id: string, n: string, i: string, p: number, l: Array<Lamp>)
    constructor(id: string, n: string, i: string, p: number, l: Array<Lamp>){
        if(id  !== null) this._id = id;
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

    setName(name: string): void{
        this.name = name;
    }

    setIpAddr(ipAddr: string): void{
        this.ipAddr = ipAddr;
    }

    setPort(port: number): void{
        this.port = port;
    }

    setLights(ligths: Array<Lamp>){
        this.lights = ligths;
    }

    setInterval(interval: number){
        this.interval = interval;
    }

    setStartChain(startChain : boolean){
        this.startChain = startChain;
    }

    setSensDirect(sensDirect : boolean){
        this.sensDirect = sensDirect;
    }



}

