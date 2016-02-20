Tasks = new Mongo.Collection("tasks");
 
if (Meteor.isClient) {
  console.log("1")
  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
      // Show newest tasks at the top
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  });/*
  console.log("2")
  Template.submit.events({
    "submit .new-task": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var text = event.target.text.value;     

      // Insert a task into the collection
      Tasks.insert({
        nome: text,
        createdAt: new Date() // current time
      });     
      console.log("3")
      // Clear form
      event.target.text.value = "";
    }
  });*/
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

