import { parseArguments } from './utils/parseArguments';
import TimeError from './error-types/timeError';

let fs = require('fs');
let instance = null;
let testTimes = null;
const FILE_NAME = 'test-times';
let THRESHOLD = 10;

export default class TimePerformance{
    constructor() {
		if(!instance)
		{
            instance = this;
            let args = parseArguments();
            
            try {
                this.env = args.env;
            }
            catch (err){
                console.log('Environment could not be found.');
            }
            
            try {
                //testTimes = JSON.parse(fs.readFileSync(`${FILE_NAME}-${this.env}.json`, 'utf8'));
                if (testTimes && testTimes['threshold'])
                    THRESHOLD = testTimes['threshold'];
            }
            catch (err) {
                console.log('Time file could not be found.');
            }

        }
        return instance;
    }

    renderOutOfTime(outOfTimeTest){
            if(outOfTimeTest !== {}){
                throw new TimeError(`${outOfTimeTest.duration}s | Expected ${outOfTimeTest.expectedTime}s`);
                //console.log('');
                //console.log(` - Out of time ${this.outOfTimeTest.name}: ${this.outOfTimeTest.duration}s | Expected ${this.outOfTimeTest.expectedTime}s`);
                //console.log(` - ${this.outOfTimeTest.name}: ${this.outOfTimeTest.duration}s | Expected ${test.expectedTime}s`);
                //console.log(`\tDuration: ${test.duration}s (${test.expectedTime}s expected)`);
                //console.log(`\tMessage: ${test.msg}`);
            }
    };

    registerTest(test){
        let outOfTimeTest = {};
        if (testTimes && typeof test.name !== 'undefined' && typeof testTimes[test.name] !== 'undefined') {
            let durationMs  = test.endTime - test.startTime;
            var duration = durationMs / 1000;
            var expectedTime = testTimes[test.name];

            if (duration > expectedTime + THRESHOLD || duration < expectedTime - THRESHOLD) {
                var msg;

                if (duration > expectedTime + THRESHOLD)
                    msg = 'Duration was more than expected';
                else
                    msg = 'Duration was less than expected';

                outOfTimeTest = {
                    name:         test.name,
                    expectedTime: expectedTime,
                    duration:     duration,
                    msg:          msg
                };
                this.renderOutOfTime(outOfTimeTest);
            }
        }
    }
}