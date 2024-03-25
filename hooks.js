import APIHandler from "./utils/apiHandler";
import TimePerformance from "./timeperformance";
import { parseArguments } from './utils/parseArguments';

let activeFixturesCount = 0;
let initialized = false;
const apiHandler = new APIHandler();
//const timePerformance = new TimePerformance();


export function registerFixture(){
    activeFixturesCount = activeFixturesCount + 1;
}

export async function before () {
    if(!initialized) {
        initialized = true;
        let args = parseArguments();
        await apiHandler.changeLanguage(args.culture);
    }
} 

export async function after () {
    activeFixturesCount--;
    if (activeFixturesCount === 0) {
        await apiHandler.changeLanguage('en-US');
    }
}

export function registerTestStartTime(t){
    t.ctx.startTime = new Date();
}

export async function registerTestEnd(t){
    /*
    await timePerformance.registerTest({ 	"name": t.ctx.name,
                                    "startTime": t.ctx.startTime, 
                                    "endTime": 	new Date()
                                });
    */
}
