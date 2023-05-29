//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
//const date = require(__dirname + "/date.js");
const {MongoClient} = require("mongodb")
const mongoose = require('mongoose')
const { ObjectId } = require('mongodb');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/Todolist', {useNewUrlParser : true, useUnifiedTopology : true })

const listschema= {
  name : String
}

const Item = mongoose.model('Item', listschema)

const item1 = new Item({
  name : 'welcome hello world'
})

const item2 = new Item({
  name : 'hit the + to add new item'
})

const item3 = new Item({
  name : "hello js world" 
})
const defaultItems = [item1, item2, item3]


const workschema={
  name:String ,
  items : [listschema]
}

const worklist=mongoose.model("worklist",workschema)

// Item.insertMany(defaultItems)
//   .then((result) => {
//     console.log('Documents inserted successfully:', result);
//   })
//   .catch((error) => {
//     console.error('Error inserting documents:', error);
//   });


//const items = ["Buy Food", "Cook Food", "Eat Food"];
//const workItems = [];

app.get("/", function(req, res) {

//const day = date.getDate();
Item.find().then((hello)=>{
  if(hello.length === 0 ){
    Item.insertMany(defaultItems)
  .then((result) => {
    console.log('Documents inserted successfully:', result);
  })
  .catch((error) => {
    console.error('Error inserting documents:', error);
  });
  res.redirect('/')
}
  else{
    res.render("list", {listTitle: "Today", newListItems: hello});

  }
})
.catch((error)=>{
  res.status(500).send('error')
})
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listname = req.body.list

  const item = new Item({ 
    name : itemName 
  })

  if(listname === "Today"){
    item.save()
    res.redirect("/")
  }else{
    worklist.findOne({ name: listname })
  .exec()
  .then(found => {
    found.items.push(item)
    found.save()
    res.redirect('/'+listname)
    // Process the result
    
  })
  .catch(err => {
    // Handle the error
    
    
    console.error(err);
  });

  }

  

  
  
});

app.post("/delete", (req,res)=>{
  
  const checkid = console.log(req.body.checkbox)
  //const YourModel = require('Items')
  //const objectid =new ObjectId(checkid)

  const ObjectId = require('mongoose').Types.ObjectId;

const objectId = new ObjectId(req.body.checkbox);
Item.deleteOne({ _id: objectId })
  .then(() => {
    console.log('Document deleted successfully');
    res.redirect('/');
  })
  .catch((error) => {
    console.error('Error deleting document', error);
  });
  
  // Item.deleteOne({ _id: objectid })
  // .then(() => {
  //   console.log('Document deleted successfully');
  //   //res.redirect('/')
  // })
  // .catch((error) => {
  //   console.error('Error deleting document', error);
  // });

// const filter = { _id : ObjectId("6473af2c3d08e4d788cc001c")}

//   collection.deleteOne(filter, (err, result) => {
//     if (err) {
//       console.error('Failed to delete document:', err);
//       return;
//     }
//   })

  // try {
  //   const result = await Item.findByIdAndDelete(checkid);
  //   // Handle the result
  //   console.log(result)
  // } catch (error) {
  //   console.log(err)
  //   // Handle the error
  // }

//   Item.findByIdAndDelete(checkid, function (err, items) {
//     if (err){
//         console.log(err)
//     }
//     else{
//         console.log("Deleted : ", docs);
//     }
// });
  
  
  // Item.findByIdAndDelete(checkid)
  // .then(result => {
  //   console.log(result)
  //   // Handle the result
  // })
  // .catch(error => {
  //   console.log(err)
  //   // Handle the error
  // });

  // Item.deleteOne({ _id:checkid }); // returns {deletedCount: 1}

  // async function deleteDocument() {
  //   try {
  //      await Item.deleteOne({ _id : checkid });
      
  //      // Log the result of the deletion operation
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  
  //  deleteDocument();

  //res.redirect('/')
  
})



app.get("/:customlist",(req,res)=>{
  console.log(req.params.customlist)


  worklist.findOne({ name: req.params.customlist })
  .exec()
  .then(found => {
    if(found){
      res.render("list", {listTitle: req.params.customlist, newListItems: found.items});

    console.log(found);

    }else{
      const witem = new worklist({
        name:req.params.customlist,
        items:defaultItems
      })
      witem.save()
      console.log("new created")
      res.redirect('/')
    }
    // Process the result
    
  })
  .catch(err => {
    // Handle the error
    
    
    console.error(err);
  });

  // worklist.findOne({name:req.params.customlist},(err,found)=>{
  //   if(!err){
  //     if(!found){
  //       const witem = new worklist({
  //         name:req.params.customlist,
  //         items:defaultItems
  //       })
  //       witem.save()
  //       res.redirect('/')
      

  //     }
  //   }else{
  //     res.render("list", {listTitle: req.params.customlist, newListItems: found.items});
  //   }

  // })

})

// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
