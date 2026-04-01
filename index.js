const {Command}= require('commander')
const fs = require('fs')
const program = new Command()
const path='./todo.json'

const loadtodos = () => {
   const data=fs.readFileSync(path, 'utf8')
   if(!data){
    return []
   }
   else{
    return JSON.parse(data)
   }
}

const savetodos =(todos)=>{
    fs.writeFileSync(path, JSON.stringify(todos, null , 2))
}

program.name('todo')
    .description('todo app')
    .version('0.0.9')
program.command('add')
    .description('add a <task>')
    .argument('<task>','takes a task and add')
    .action((task)=>{
        
        const todos= loadtodos();
        todos.push({id : todos.length>=1?todos.length+1:1, task, done:false})
        savetodos(todos)
        console.log(task)
    })
program.command('delete <index>')
    .description('delete a todo')
    .action((index)=>{
        const todos= loadtodos();
        if(!todos){
            return []
        }
        const newTodos=[]
        todos.forEach(element => {
            if(element.id!==Number(index)){
                newTodos.push(element)
            }
        });
        savetodos(newTodos)
    })
program.command('done <index>')
    .description('mark as done todo')
    .action((index)=>{
        const todos=loadtodos()
        if(!todos)return []
        todos.forEach((el)=>{
            if(el.id===Number(index)){
                el.done =true
            }
            else{
                console.log("not possible")
            }
        })
        savetodos(todos) //check
    })
//ferv
program.parse();