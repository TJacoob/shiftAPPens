Tasks = new Mongo.Collection("tasks");

//receive = new Mongo.Collection("receive");


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
    
    searchShow: function() {

      //var log = receive.find({}, {_id:0});

      var aux = input.get()
      return Tasks.find({type:aux});
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
      var autocarro = event.target.autocarro.checked;
      var metro = event.target.metro.checked;
      var comboio = event.target.comboio.checked;
      var estacionamentopago = event.target.estacionamentopago.checked;
      var estacionamentogratuito = event.target.estacionamentogratuito.checked;
      var faceis = event.target.faceis.checked;
      var razoaveis = event.target.razoaveis.checked;
      var mau = event.target.mau.checked;

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
        title: "Menu",
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

          multiTg = function() {
            cssmenu.find(".has-sub").prepend('<span class="submenu-button"></span>');
            cssmenu.find('.submenu-button').on('click', function() {
              $(this).toggleClass('submenu-opened');
              if ($(this).siblings('ul').hasClass('open')) {
                $(this).siblings('ul').removeClass('open').hide();
              }
              else {
                $(this).siblings('ul').addClass('open').show();
              }
            });
          };

          if (settings.format === 'multitoggle') multiTg();
          else cssmenu.addClass('dropdown');
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

(function($){
$(document).ready(function(){

$(document).ready(function() {
  $("#cssmenu").menumaker({
    title: "Menu",
    format: "dropdown"
  });

  $("#cssmenu a").each(function() {
    var linkTitle = $(this).text();
    $(this).attr('data-title', linkTitle);
  });
});

});
})(jQuery);
