Tasks = new Mongo.Collection("tasks");

//receive = new Mongo.Collection("receive");

searchMode = new ReactiveVar(false);
addMode = new ReactiveVar(false);
loginMode = new ReactiveVar(false);
mainMode = new ReactiveVar(true);
singleMode = new ReactiveVar(false);
selected = new ReactiveVar();


input = new ReactiveVar();


if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    toprating: function () {
      // Show newest tasks at the top
      return Tasks.find({}, {sort: {rating: -1}, limit: 3});
    },

    mostrecent: function() {

      return Tasks.find({}, {sort: {createdAt : -1}, limit:3});
    },

    testsingle: function() {

      return Tasks.find({}, {sort: {createdAt : -1}, limit:1});
    },
    
    searchShow: function() {

      //var log = receive.find({}, {_id:0});

      var aux = input.get()
      return Tasks.find({type:aux});
    },

    isSearch: function() {
      return searchMode.get();
    },

    isAdd: function() {
      return addMode.get();
    },

    isLogin: function() {
      return loginMode.get();
    },

    isMain: function() {
      return mainMode.get();
    },

    isSingle: function() {
      return singleMode.get();
    },

    getPlace: function() {
      var sel= selected.get();
      return Tasks.find({_id:sel});
    }
  });

  Template.body.events({
    'click .home' : function(){
      searchMode.set(false);
      addMode.set(false);
      mainMode.set(true);
      loginMode.set(false);
      singleMode.set(false);
    },
    'click .add' : function(){
      searchMode.set(false);
      addMode.set(true);
      mainMode.set(false);
      loginMode.set(false);
      singleMode.set(false);
    },
    'click .login' : function(){
      searchMode.set(false);
      addMode.set(false);
      mainMode.set(false);
      loginMode.set(true);
      singleMode.set(false);
    },
    'click .single' : function(){
      searchMode.set(false);
      addMode.set(false);
      mainMode.set(false);
      loginMode.set(false);
      singleMode.set(true);
      selected.set(this._id);
    }
  });

  Template.form.events({
    "submit .new-task": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var imagem = event.target.imagem.value;
      var name = event.target.name.value;
      var country = event.target.country.value;
      var city = event.target.city.value;
      var location = event.target.location.value;
      var type = event.target.type.value;
      var description = event.target.description.value;
      var opinion = event.target.opinion.value;
      var close_locations = event.target.close_locations.value;
      if (event.target.autocarro.checked) {
        var autocarro = "Autocarro";
      }
      if (event.target.metro.checked) {
        var metro = "Metro";
      }
      if (event.target.comboio.checked) {
        var comboio = "Comboio";
      }
      if (event.target.estacionamentopago.checked) {
        var estacionamentopago = "Estacionamento Pago";
      }
      if (event.target.estacionamentogratuito.checked) {
        var estacionamentogratuito = "Estacionamento Gratuito";
      }
      if (event.target.faceis.checked) {
        var faceis = "Fáceis/Bons";
      }
      if (event.target.razoaveis.checked) {
        var razoaveis = "Razoáveis";
      }
      if (event.target.mau.checked) {
        var mau = "Poucos/Maus";
      }

      // Insert a task into the collection
      Tasks.insert({
        name: name,
        country: country,
        city: city,
        location: location,
        type: type,
        description: description,
        opinion: opinion,
        close_locations: close_locations,
        autocarro: autocarro,
        metro: metro,
        comboio: comboio,
        estacionamentopago: estacionamentopago,
        estacionamentogratuito: estacionamentogratuito,
        faceis: faceis,
        razoaveis: razoaveis,
        imagem:imagem,
        mau: mau,
        createdAt: new Date() // current time
      });     
      
      // Clear form
      event.target.name.value = "";
      event.target.country.value = "";
      event.target.city.value = "";
      event.target.location.value = "";
      event.target.type.value = "";
      event.target.description.value = "";
      event.target.opinion.value = "";
      event.target.close_locations.value = "";
      event.target.autocarro.checked = false;
      event.target.metro.checked = false;
      event.target.comboio.checked = false;
      event.target.estacionamentopago.checked = false;
      event.target.faceis.checked = false;
      event.target.razoaveis.checked = false;
      event.target.mau.checked = false;
    }
  });

  Template.search.events({
    "submit .newtask": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      field = event.target.field.value;
      /*
      Receive.insert({
        inputLog: field
      });
      */

      input.set(field);

      searchMode.set(true);
      mainMode.set(false);
      loginMode.set(false);
      addMode.set(false);
      singleMode.set(false);

      // Clear form
      event.target.field.value = "";



    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}


(function($) {

  $.fn.menumaker = function(options) {
      
      var cssmenu = $(this), settings = $.extend({
        title: "Study@",
        format: "dropdown",
        breakpoint: 768,
        sticky: false
      }, options);

      return this.each(function() {
        cssmenu.find('li ul').parent().addClass('has-sub');
        if (settings.format != 'select') {
          cssmenu.prepend('<div id="menu-button">' + settings.title + '</div>');
          $(this).find("#menu-button").on('click', function(){
            $(this).toggleClass('menu-opened');
            var mainmenu = $(this).next('ul');
            if (mainmenu.hasClass('open')) { 
              mainmenu.hide().removeClass('open');
            }
            else {
              mainmenu.show().addClass('open');
              if (settings.format === "dropdown") {
                mainmenu.find('ul').show();
              }
            }
          });
        }

        else if (settings.format === 'select')
        {
          cssmenu.append('<select style="width: 100%"/>').addClass('select-list');
          var selectList = cssmenu.find('select');
          selectList.append('<option>' + settings.title + '</option>', {
                                                         "selected": "selected",
                                                         "value": ""});
          cssmenu.find('a').each(function() {
            var element = $(this), indentation = "";
            for (i = 1; i < element.parents('ul').length; i++)
            {
              indentation += '-';
            }
            selectList.append('<option value="' + $(this).attr('href') + '">' + indentation + element.text() + '</option');
          });
          selectList.on('change', function() {
            window.location = $(this).find("option:selected").val();
          });
        }

        if (settings.sticky === true) cssmenu.css('position', 'fixed');

        resizeFix = function() {
          if ($(window).width() > settings.breakpoint) {
            cssmenu.find('ul').show();
            cssmenu.removeClass('small-screen');
            if (settings.format === 'select') {
              cssmenu.find('select').hide();
            }
            else {
              cssmenu.find("#menu-button").removeClass("menu-opened");
            }
          }

          if ($(window).width() <= settings.breakpoint && !cssmenu.hasClass("small-screen")) {
            cssmenu.find('ul').hide().removeClass('open');
            cssmenu.addClass('small-screen');
            if (settings.format === 'select') {
              cssmenu.find('select').show();
            }
          }
        };
        resizeFix();
        return $(window).on('resize', resizeFix);

      });
  };
})(jQuery);

/* IMGUR */

/*! imgur 2.0.3 | (c) 2015 Pedro Rogério | MIT License */
!function(a,b){console.log("used"); "use strict";"function"==typeof define&&define.amd?define([],b):"object"==typeof exports?module.exports=b():a.Imgur=b()}(this,function(){"use strict";var a=function(b){if(!(this&&this instanceof a))return new a(b);if(b||(b={}),!b.clientid)throw"Provide a valid Client Id here: http://api.imgur.com/";this.clientid=b.clientid,this.endpoint="https://api.imgur.com/3/image",this.callback=b.callback||void 0,this.dropzone=document.querySelectorAll(".dropzone"),this.run()};return a.prototype={createEls:function(a,b,c){var d,e=document.createElement(a);for(d in b)b.hasOwnProperty(d)&&(e[d]=b[d]);return c&&e.appendChild(document.createTextNode(c)),e},insertAfter:function(a,b){a.parentNode.insertBefore(b,a.nextSibling)},post:function(a,b,c){var d=new XMLHttpRequest;d.open("POST",a,!0),d.setRequestHeader("Authorization","Client-ID "+this.clientid),d.onreadystatechange=function(){if(4===this.readyState){if(!(this.status>=200&&this.status<300))throw new Error(this.status+" - "+this.statusText);var a="";try{a=JSON.parse(this.responseText)}catch(b){a=this.responseText}c.call(window,a)}},d.send(b),d=null},createDragZone:function(){var a,b;a=this.createEls("p",{},"Drag your files here or click in this area."),b=this.createEls("input",{type:"file",accept:"image/*"}),Array.prototype.forEach.call(this.dropzone,function(c){c.appendChild(a),c.appendChild(b),this.status(c),this.upload(c)}.bind(this))},loading:function(){var a,b;a=this.createEls("div",{className:"loading-modal"}),b=this.createEls("img",{className:"loading-image",src:"./svg/loading-spin.svg"}),a.appendChild(b),document.body.appendChild(a)},status:function(a){var b=this.createEls("div",{className:"status"});this.insertAfter(a,b)},matchFiles:function(a,b){var c=b.nextSibling;if(a.type.match(/image/)&&"image/svg+xml"!==a.type){document.body.classList.add("busy"),c.classList.remove("bg-success","bg-danger"),c.innerHTML="";var d=new FormData;d.append("image",a),this.post(this.endpoint,d,function(a){document.body.classList.remove("busy"),"function"==typeof this.callback&&this.callback.call(this,a)}.bind(this))}else c.classList.remove("bg-success"),c.classList.add("bg-danger"),c.innerHTML="Invalid archive"},upload:function(a){var b,c,d,e;a.addEventListener("change",function(f){if(f.target&&"INPUT"===f.target.nodeName&&"file"===f.target.type)for(c=f.target.files,d=0,e=c.length;e>d;d+=1)b=c[d],this.matchFiles(b,a)}.bind(this),!1)},run:function(){var a=document.querySelector(".loading-modal");a||this.loading(),this.createDragZone()}},a});
