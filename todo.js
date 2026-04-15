 const express = require('express')
 const cors= require('cors')
 const app=express()
 const port =5000;
const fs= require('fs');
let count=0
const path= './apiTodo.json'

app.use(express.json())
app.use(cors())
app.use((req, res, next)=>{
    count++;
    next()
})
function middlewarecount(req, res, next){
    count++;
    next()
}
function getAllTodos(){
    try {
        const readtodo= fs.readFileSync(path,'utf8')
        if(!readtodo){
            return []
        }
        const parsed = JSON.parse(readtodo)
        return parsed
    } catch(e) {
        return []
    }
}

function addtodo(todos){
    fs.writeFileSync(path, JSON.stringify(todos,null , 2))
}
 app.get('/',(req, res)=>{
    
    const existingtodo= getAllTodos()
    res.send(existingtodo)
 })

 app.post('/add',middlewarecount,(req,res)=>{
    const description = req.body.description
    const existingtodo = getAllTodos();
    const id = existingtodo.length>0 ? existingtodo.length+1 : 1
    const isDone =false
    console.log(description, isDone, existingtodo)
    existingtodo.push({id: id, description:description, isDone})
    addtodo(existingtodo)
    res.send({success: true, message: "added", todo: {id, description, isDone}})
 })

 app.delete('/del/:id',(req, res)=>{
    const id = Number(req.params.id)
    console.log(id)
    const alltodos= getAllTodos()
    const finaltodosafterdeletion=[]
    const checkid=false
    try{
        if(!alltodos){
            return []
        }
        else{
            alltodos.forEach(element => {
                if(element.id!==id){
                    finaltodosafterdeletion.push(element)
                }
                else{
                    checkid=true
                }
            });
        }
        if(!checkid){
            res.send('invalid id')
        }
        addtodo(finaltodosafterdeletion)
        res.send(`removed ${id}`)
    }catch(e){
        res.send(e)
    }
    
 })

 app.put('/update/:id', (req, res)=>{
    const id = Number(req.params.id)
    console.log(id)
    const alltodos = getAllTodos()
    console.log(alltodos)
    try{
    if(!alltodos){
        return []
    }
    else{
        alltodos.forEach((ele)=>{
            if(ele.id===id && ele.isDone===false){
                ele.isDone=true
                res.status(200).json({
                    message: `${ele.description} is done`
                })
            }

        })
        res.status(400).json({
                    message:'invalid id'
                })
    }
}catch(e){
    return e; 
}
 })
 app.listen(port, ()=>{
    console.log(`App running on port ${port}`)
 })

 