function test(...name){
    console.log(name)
    if(name.includes('shashank')){
        console.log('Hello', true);
    }else{
        console.log(false);
    }
}

test('test')