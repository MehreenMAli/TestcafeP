import TestParameter from './testParameter';

let testParameter = new TestParameter();

export const p_Test = async function(id,name,testFn){

    let allParameters = testParameter.getAllParams(id);

    for(var i = 0; i < allParameters.length; i++){
        let params = allParameters[i];
        if(!params.skip)
            test(`${name} [${Object.values(params)}]`, async t => {
                t.fixtureCtx.params = params;
                await testFn(t);
            });
        else
            test.skip(`${name} [${Object.values(params)}]`, async t => {
                t.fixtureCtx.params = params;
                await testFn(t);
            });
    }
    
}