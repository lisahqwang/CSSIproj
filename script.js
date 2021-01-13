/* global google*/

/* global keyCode, UP_ARROW, LEFT_ARROW, createGraphics, windowWidth, windowHeight, RIGHT_ARROW, DOWN_ARROW, collideRectCircle, collideCircleCircle, random, mouseIsPressed, clear, textSize, createCanvas, strokeWeight, rect, background, colorMode, HSB, noStroke, backgroundColor, color, fill, ellipse, text, stroke, line, width, height, mouseX, mouseY */

let map, infoWindow, addy, latlng, formattedAddress, i, dots, permanentLayer, tempLayer;

function httpGetAsync(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  };
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  // xmlHttp.setRequestHeader('Access-Control-Allow-Origin', '*');
  xmlHttp.send(null);
}

function setup() {
  createCanvas(windowWidth - 20, windowHeight - 20);
  colorMode( 255, 255, 255);
  
  setupPermanentLayer();
  setupTempLayer();
  
  dots = [];
  for (let i = 0; i < 1000; i++) {
    dots.push(new BouncyDot());
  }
}

function setupPermanentLayer(){
  permanentLayer = createGraphics(700, 1000);
  //permanentLayer.background(117, 0, 100);
}
function setupTempLayer(){
  tempLayer = createGraphics(400, 300);
}
function draw() {
  
  // dots[0].float();
  // dots[0].display();
  // dots[1].float();
  // dots[1].display();
  // dots[2].float();
  // dots[2].display();
  // dots[3].float();
  // dots[3].display();

  for (let i = 0; i < dots.length; i++) {
    dots[i].float();
    dots[i].display();
  }
}

function initMap() {
  var myLatlng = { lat: 0, lng: 0 };
  tempLayer.map = new google.maps.Map(document.getElementById("map"), {
    //center: { lat: 37.7749, lng: -122.4194 },
    center: myLatlng,
    zoom: 12
  });
  // geolocation code 11 - 41
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        infoWindow.setPosition(pos);
        infoWindow.setContent("Is this your location?");
        infoWindow.open(map);
        map.setCenter(pos);
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos, addy) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }
  // infoWindow for coords
  infoWindow = new google.maps.InfoWindow({
    content: "Click the map to get Lat/Lng!",
    position: myLatlng
  });
  infoWindow.open(map);

  // Configure the click listener.
  map.addListener("click", function(mapsMouseEvent) {
    // Close the current InfoWindow.

    infoWindow.close();
    // Create a new InfoWindow.
    addy = mapsMouseEvent.latLng;
    latlng = [mapsMouseEvent.latLng.lat(), mapsMouseEvent.latLng.lng()];
    findCoords();
    findPlaces();
    setTimeout(openInfoWindow, 300);
    // infoWindow.setContent(formattedAddress);
    // infoWindow.open(map);
  });
}

function openInfoWindow(window) {
  infoWindow = new google.maps.InfoWindow({
    position: addy
  });
  // <a href="https://www.google.com">link</a>
  let anchor = document.createElement("a");
  anchor.text = "You found" + " " + formattedAddress;
  anchor.href =
    "https://www.google.com/search?q=" + formattedAddress.toString(); //https://www.google.com/search?q=airplane
  console.log(anchor.href);
  anchor.target = "_blank";

  infoWindow.setContent(anchor);
  infoWindow.open(map);
  console.log("ended");
}
function findCoords(arr) {
  const KEY = "AIzaSyBJnKEvah3-evYvgjDloOUM2mBzuW3DPEo";
  const LAT = latlng[0];
  const LNG = latlng[1];
  let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${LAT},${LNG}&key=${KEY}`;
  httpGetAsync(url, getAddress);
}

function getAddress(data) {
  let addyObject = JSON.parse(data);
  formattedAddress = addyObject.results[0].formatted_address;
}

function findPlaces(arr) {
  const KEY = "AIzaSyDRByLyOjXnAcgKNb9lJmWa9F13ayf9iuY";
  const LAT = latlng[0];
  const LNG = latlng[1];
  let url = `https://maps.googleapis.com/maps/api/place/textsearch/xml?query=restaurants+in+Sydney&key=${KEY}`;
 httpGetAsync(url, getPlaces);
}

function getPlaces(data) {
  let placesObject = JSON.parse(data);
  console.log(placesObject)
  location = [
    placesObject.candidates[0].geometry.location.lat(),
    placesObject.candidates[0].geometry.location.lng()
  ];
}

function makeMarkers(location) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {

  for (let i = 0; i < location.length; i++) {
    var marker = new google.mapsMarker({
      position: location[i], 
      map: map,
      icon:
        "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
    });
  }
  }
}


function mousePressed() {
  // We'll use this for console log statements only.
  console.log(dots[5].x);
}

class BouncyDot {
  constructor() {
    /*this.blue = '(66,133,244)';
    this.red = (219, 68, 55);
    this.yellow = (244, 160, 0); 
    this.green = (15, 157, 88); 
    
    /*var myArray = [
  "Apples",
  "Bananas",
  "Pears"
];

var randomItem = myArray[Math.floor(Math.random()*myArray.length)];

document.body.innerHTML = randomItem;
    
    this.arr1 = [this.blue, this.red, this.yellow, this.green];*/
    
   this.arr1 = [(66,133,244), (219, 68, 55), (244, 160, 0), (15, 157, 88)];
  
    // Randomly generate position
    this.x = random(width);
    this.y = random(height);
    // Randomly generate radius
    this.r = random(5, 12);
    // Randomly generate color
    //this.color = random(this.arr1);
   // console.log(this.arr1(this.color));
    //this.color = this.arr1[Math.floor(Math.random()*this.arr1.length())];
   // console.log(this.color.toString);
    // Randomly generate a master velocity (broken into components)...
    this.masterXvelocity = random(0.5, 3);
    this.masterYvelocity = random(0.5, 3);
    // ...and use those as starting velocities.
    this.xVelocity = this.masterXvelocity;
    this.yVelocity = this.masterYvelocity;
  }

  float() {
    this.x += this.xVelocity;
    this.y += this.yVelocity;
    // Standard bounce code - like the DVD logo, but for spheres.
    if (this.x + this.r > width) {
      this.xVelocity = -1 * this.masterXvelocity;
    }
    if (this.x - this.r < 0) {
      this.xVelocity = this.masterXvelocity;
    }
    if (this.y + this.r > height) {
      this.yVelocity = -1 * this.masterYvelocity;
    }
    if (this.y - this.r < 0) {
      this.yVelocity = this.masterYvelocity;
    }
  }

  display() {
    fill(random(this.arr1));
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
  }
}

/*var myArray = [
  "Apples",
  "Bananas",
  "Pears"
];

var randomItem = myArray[Math.floor(Math.random()*myArray.length)];

document.body.innerHTML = randomItem;*/