function Sort(array){
    for(let x = array.length; x >= 0; x--){
        for(let y = 0; y < x; y++){
            if(array[y] > array[y+1]){
                let temp = array[y]
                array[y] = array[y+1]
                array[y+1] = temp
            }
        }
    }

    console.log(array);
    return array
}


let x = [5,3,10,8,2,7,1,6,4,9]

Sort(x)

console.log(x);

let r = false

if(!r){
    let xr = 904
    console.log(xr);
}


let y = ()=>{
    console.log('Hello Arrow');
}

y()


function Namer(name){
    let final = '';
    for(let x = 0; x < name.length; x++){
        if(x % 2 === 0){
            final+=name[x].toUpperCase()
        }else{
            final+=name[x].toLowerCase()
        }
    }
    console.log(final);
}

Namer('shashank dutt mathur')

const MyDetail = {
    name:'Shashank Dutt Mathur',
    Age:24,
    detail(){
        console.log(this);
    }
}

console.log(MyDetail.name);

class Employe{
    static mydb = 'Hello'
    constructor(name, qualification){
        this.name = name
        this.qualification = qualification
    }
    detail(){
        console.log(this)
    }
}

const yu = new Employe('Shashank Dutt', 'Graduate')

class Papat extends Employe{
    constructor(name, qualification, Age){
        super(name, qualification)
        this.Age = Age
    }

    detail(){
        console.log(this);
    }
}

const p = new Papat('Pappu', 'Graduate', 25)

p.detail()

const mps = [
    {
        task:'Write Code',
        isDone:true
    },
    {
        task:'Game',
        isDone:false
    },
    {
        task:'Hit Gym',
        isDone:true
    },
    {
        task:'Sleep',
        isDone:false
    },
    {
        task:'Learn',
        isDone:true
    },
]

let xylo = mps.filter(function(e){
    return e.isDone !== false
})

// console.log(xylo);

// let poll = '0f9d8b1914e0d851f0ac61df3097fd51a0e1df7e'

// const crypto = require('crypto')

// let me = crypto.createHash('sha256').update(poll).digest('hex')


function Res(x){
    if(x === 10){
        return x
    }else{
        return `Hello`
    }
}


let rt = Res(45)

console.log(rt);