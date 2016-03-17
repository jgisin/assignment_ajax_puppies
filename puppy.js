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
    addPendingStatus();
  $.get(getPuppiesURL, function(data) {
    data.forEach(function(puppy) {
      getPuppy(puppy);
      adoptPuppy(puppy);
      successStatus();
      setTimeout(fadeStatus, 2000);
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
              successStatus();
              setTimeout(fadeStatus, 2000);
            },
            error: function(xhr, status, error) {
              console.log('Error!');
              addErrorStatus(error, puppy);
              setTimeout(fadeStatus, 2000);
            }
    });

  });

};

var registerPuppy = function(object) {
  addPendingStatus();
  $.ajax({
    type: 'POST',
    url: getPuppiesURL,
    contentType: 'application/json',
    dataType: 'son',
    data: object,
    error: function(){
      addErrorStatus("Register Puppy Error", object);
    },
    success: function() {
      console.log('Puppy posted!');
      successStatus();
    }
  });
};

var addPendingStatus = function() {
  $('#status').addClass('alert alert-warning');
  $('#status').text('Loading...Please Wait');
};

var removePendingStatus = function(){
  $('#status').removeClass('alert alert-warning');
  $('#status').removeClass('alert alert-danger');
  $('#status').text('');
};

var successStatus = function(){
  removePendingStatus();
  $('#status').show();
  $('#status').addClass('alert alert-success');
  $('#status').text('Loaded Successfully');
  setTimeout(fadeStatus, 2000);
};

var fadeStatus = function(){
  $('#status').fadeOut(1000);
};

var status = function(){
  successStatus();
};

var addErrorStatus = function(error, puppy){
  errorString = " ";
    if(puppy !== undefined){
      errorString += "problem with " + puppy.name;
    }
    $('#status').show();
    removePendingStatus();
    $('#status').addClass('alert alert-danger');
    $('#status').text(error + errorString);
    setTimeout(fadeStatus, 2000);
};

$(document).ready( function() {
  addPendingStatus();
  $.get(getBreedURL, function(data) {
    data.forEach(function(breed) {
      getBreed(breed);
      successStatus();
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

$( document ).on('ajaxError', function( ){
  addErrorStatus("Ajax Error:");
});
