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
