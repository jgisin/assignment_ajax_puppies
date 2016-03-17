// send get request to breed list
var getBreedURL = "https://ajax-puppies.herokuapp.com/breeds.json";
var getPuppiesURL = "https://ajax-puppies.herokuapp.com/puppies.json";
var deletePuppyURL = function(puppy) {
  return ("https://ajax-puppies.herokuapp.com/puppies/" + puppy.id + ".json");
};


var getBreed = function(breed) {
  $('#breed-input').append('<option value="' + breed.id + '">' + breed.name + '</option>');
};

var getPuppy = function(puppy) {
  var d = new Date();
  var puppyCreated = new Date(puppy.created_at);

  appendString = '';
  appendString += '<div class="puppy">';
  appendString += puppy.name;
  appendString += ' (';
  appendString += puppy.breed.name;
  appendString += '), created ';
  appendString += Math.floor((d - puppyCreated) / 60000);
  appendString += ' minutes ago -- ';

  $('#puppy-list').append(appendString);
  $('#puppy-list').append('<a href="#" id="puppy-' + puppy.id + '"> --adopt-- </a>');
};

var getPuppies = function() {
  $('#puppy-list').html('');
  $.get(getPuppiesURL, function(data) {
    data.forEach(function(puppy) {
      getPuppy(puppy);
      adoptPuppy(puppy);
    });
  });
};

var adoptPuppy = function(puppy) {
  var currentPuppyID = '#puppy-' + puppy.id;
  $(currentPuppyID).on('click', function(event) {
    event.preventDefault();
    $.ajax({type: 'DELETE',
            url: deletePuppyURL(puppy),
            success: function() {
              console.log('Success!');
              getPuppies();
            },
            error: function() {console.log('Error!');}
    });

  });

};

var registerPuppy = function(object) {
  addPendingStatus();
  $.ajax({
    type: 'POST',
    url: getPuppiesURL,
    jsonp: 'callback',
    contentType: 'application/json',
    dataType: 'json',
    data: object,
    error: function(){
      addErrorStatus();
    },
    success: function() {
      console.log('Puppy posted!');
      removePendingStatus();
    }
  });
};

var addPendingStatus = function() {
  $('#status').addClass('alert alert-warning');
  $('#status').text('Loading...Please Wait');
};

var removePendingStatus = function(){
  $('#status').removeClass('alert alert-warning');
  $('#status').text('');
};

var addErrorStatus = function(){
  $('#status').removeClass('alert alert-warning');
  $('#status').addClass('alert alert-danger');
  $('#status').text('Error, No Puppies for you');
};

$(document).ready( function() {
  $.get(getBreedURL, function(data) {
    data.forEach(function(breed) {
      getBreed(breed);
    });
  });

  $('#submit-button').on('click', function(event) {
    event.preventDefault();
    var name = $('#name-input').val();
    var breed = $('#breed-input').val();
    var object = {name: name,
                  breed_id: breed};
    registerPuppy(JSON.stringify(object));
  });

  $('#puppy-refresh').on('click', function(event) {
    event.preventDefault();
    getPuppies();
  });
});
