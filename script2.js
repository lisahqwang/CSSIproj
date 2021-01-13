/* global windowWidth, windowHeight, google, keyCode, RGB, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, collideRectCircle, collideCircleCircle, random, mouseIsPressed, clear, textSize, createCanvas, strokeWeight, rect, background, colorMode, HSB, noStroke, backgroundColor, color, fill, ellipse, text, stroke, line, width, height, mouseX, mouseY */

let map, infoWindow, addy, latlng, formattedAddress, i, dots;

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
  createCanvas(windowWidth - 15, windowHeight + 220);
  colorMode(RGB, 255, 255, 255);
  // colorMode(HSB, 320, 80, 60 );

  dots = [];
  for (let i = 0; i < 1000; i++) {
    dots.push(new BouncyDot());
  }
}

function draw() {
  background(255, 255, 255);
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

//function mousePressed() {
// We'll use this for console log statements only.
//console.log(dots[5].x);
//}

class BouncyDot {
  constructor() {
    this.blue = [0, 0, 255];
    (this.red = 219), 68, 55;
    (this.yellow = 255), 255, 0;
    // this.green = 15, 157, 88;

    //this.arr1 = [this.blue, this.yellow, this.red];
    this.arr1 = ["#4285F4", "#DB4437", "#F4B400", " #0F9D58"];

    //this.arr1 = [(234, 70), (159,70), (78,70) (30, 70)]
    // Randomly generate position
    this.x = random(width);
    this.y = random(height);
    // Randomly generate radius
    this.r = random(8, 15);
    // Randomly generate color
    this.color = random(this.arr1);
    //this.color.setAlpha(255);

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
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
  }
}

function initMap() {
  var myLatlng = { lat: 0, lng: 0 };
  map = new google.maps.Map(document.getElementById("map"), {
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
  anchor.text = "Explore" + " " + formattedAddress;
  anchor.href =
    "https://www.google.com/search?q=" + formattedAddress.toString(); //https://www.google.com/search?q=airplane
  console.log(anchor.href);
  anchor.target = "_blank";

  let anchor1 = document.createElement("a");
  anchor1.text = "Weather at" + " " + formattedAddress;
  anchor1.href =
    "https://www.google.com/search?source=hp&ei=PkYjX_32NIXd9APbo6n4Cw&q=weather+" +
    formattedAddress.toString(); //https://www.google.com/search?q=airplane
  //console.log(anchor.href);
  anchor1.target = "_blank";

  let container = document.createElement("div");
  container.appendChild(anchor); 
  container.appendChild(document.createElement("br"));
  
  container.appendChild(anchor1);

  infoWindow.setContent(container);
  infoWindow.open(map);
  //infoWindow.setContent(anchor1);
  //infoWindow.open(map);
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
