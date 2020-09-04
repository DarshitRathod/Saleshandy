const express = require('express');
const router = express.Router()
//Database connection 
const dbConn = require('./db.config');
const { format } = require('mysql/lib/protocol/SqlString');

//Listing all users
router.get('/listAllUserData',(req, res) => {
    dbConn.query('Select * from user_master' , (err, rows) => {
        if (!err)
            res.send(rows);
        else
            console.log("Err is ",err.message);
    })
})


// //Add new Column
// router.post('/addNewColumn',(req, res) => {
//     var columnType = 'int';    
//     if(req.body.type === 'text'){
//         columnType = 'varchar(25)'
//     }        
//     dbConn.query('Alter table user_master add email varchar(25)',(err, rows) => {
//         if (!err)
//             res.send(rows);
//         else
//             console.log("Err is ",err.message);
//     })
// })


//Delete user by id
router.delete('/delete/:id',(req, res) => {
    dbConn.query('Delete from user_master where user_id = ?', [req.params.id] , (err, rows) => {
        if (!err)
            res.send(rows);
        else
            console.log("Err is ",err.message);
    })
})

//Edit user by id
router.post('/edit/:id',(req, res) => {
    delete req.body['extraColumn'];        
    var sql = "UPDATE user_master SET ? WHERE user_id = " + req.params.id;        
    dbConn.query(sql,[req.body],(err, rows) => {
        if (!err)
            res.send(rows);
        else
            console.log("Err is ",err.message);
    })
})

//Create New User
router.post('/create',(req, res) => {
    var sql = "INSERT INTO user_master VALUES ?"      
    let dataOfUSer = req.body;         
        if(req.body.extraColumn.length > 0){            
            let alterQuery  = "Alter table user_master add "           
            let arrOfExtraField = req.body.extraColumn;
            arrOfExtraField.forEach((obj)=>{                
                if(obj['columnType'] === 'text'){
                     alterQuery = alterQuery + obj['columnName'].toString() + " varchar(25)"
                }
                if(obj['columnType'] === 'integer'){
                    alterQuery = alterQuery + obj['columnName'].toString() + " int"
                }                
            })                                                
            dbConn.query(alterQuery,(err, rows) => {
                if (!err){
                    console.log("rows",rows)                    
                }                                            
                else
                    console.log("Err is ",err.message);
            })
        }          
        var data = []
        var ans = ['']      

        Object.keys(dataOfUSer).forEach((keys)=>{
            if(keys != 'extraColumn'){
                ans.push(dataOfUSer[keys])
            }            
        })      

        data.push(ans)    
        console.log("data",data)

        dbConn.query(sql,[data] ,(err, rows) => {        
            if(!err){
                res.send(rows);
            }else{
                console.log(err)
            }
        })
})


module.exports = router;


// JSON FORMAT
// {
//      "first_name":"Jay",
// 	    "last_name":"patel",
// 	    "ph_no":"159753",
//      "email":"krunal.parsana@gmail.com",    ----> New Column
// 	    "extraColumn":[
//             {
//                 "columnName":"email",
//                 "columnType":"integer"
//             },
//             {
//
//             },
//       ]
// }
