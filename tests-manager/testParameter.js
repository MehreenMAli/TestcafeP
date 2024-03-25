
import parameters from './test-parameters';

export default class TestParameter{
    constructor() {
    }

    getAllParams(testId){
        return parameters[testId];
    }
}