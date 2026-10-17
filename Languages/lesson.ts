//1.変数
const name = 'Ishihara';
let age = 23;

 const x = 20;
 console.log(x);

 const name: string = 'Yoshiharu';
 const age: number = 23;
 const isStudent: boolean = true;
 // string number boolean null undefined


 //2.配列
 const scores:number[] = [80,90,100];
 console.log(scores);

 const names: string[] = ['Yoshiharu', 'Ishihara', 'Takahashi'];
 console.log(names);

 const scores: Array<number> = [80,90,100];

 //3.オブジェクト
 const user = {
     name: 'Yoshiharu',
     age: 23,
 };

const user:{
     name: string;
     age: number;
} = {
    name: 'Yoshiharu',
    age: 23,
};

type User = {
     name: string,
     age: number,
};

const user: User = {
    name: 'Yoshiharu',
    age : 23,
};

interface User {
    name:string;
    age:number;
};

const user: User ={
    name: 'Yoshiharu',
    age:23,
};

//4.関数
function add(a:number, b:number): number{
    return a + b;
}









