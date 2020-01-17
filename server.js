const express=require('express')
const {MongoClient,ObjectID}=require("mongodb")
const bodyParser=require("body-parser")
const assert=require("assert")
const app=express()
app.use(bodyParser.json())
const mongo_url='mongodb://localhost:27017'
const dataBase="contact_list"
MongoClient.connect(mongo_url, { useUnifiedTopology:true },(err,client)=>{
    assert.equal(err,null,'data base')
    const db=client.db(dataBase)
    /*add new contact*/
    app.post('/newContact',(req,res)=>{
            let newcontact=req.body
            db.collection("contacts").insertOne(newcontact,(err,data)=>{
             if(err)
             res.send("can't add new contact ")
             else res.send (data)
            })
        })
 /*get all*/
  app.get("/getAll",(req,res)=>{
            db.collection("contacts").find().toArray((err,data)=>{
                if (err) 
                res.send("contact not find")
                else res.send(data)
            })
        })
   /* get by one*/
   app.get("/get/:id",(req,res)=>{
        let contact_id=ObjectID(req.params.id)
        db.collection("contacts").findOne({_id:contact_id},(err,data)=>{
            if(err) res.send("id not found")
            else res.send(data)
        })     
    })
    /* Editer un contact*/
         app.put('/editContact/:id',(req,res)=>{
            let contact_id=ObjectID(req.params.id)
            let modified_contact=req.body
        db.collection("contacts").findOneAndUpdate({_id:contact_id},{$set:{...modified_contact}},(err,data)=>{
        if(err) res.send("error")
        else res.send("contact modified")
    })
        })
     /*remove contact from the list*/
     app.delete("/deleteContact/:id",(req,res)=>{
        let id=ObjectID(req.params.id)
        db.collection("contacts").findOneAndDelete({_id:id},(err,data)=>{
            if (err)res.send("erererer")
            else res.send ("removed")   

    })
})

})
app.listen(5000,(err)=>{
    if(err)console.log(err)
    else console.log("server is running :) :) !!!!!!!!!")
})