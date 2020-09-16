var dog,happyDog,database,foodS,foodStock,dogImg;
var lastfed,feed,addFood,fedTime,foodObj;

function preload()
{
  dogImg = loadImage("images/dogImg.png");
  happyDog = loadImage("images/happydog.png");
}

function setup() {
  createCanvas(1000, 500);

  foodObj = new Food();
  
  feed = createButton("feed the dog");
  feed.position(600,50);
  feed.mousePressed(feedDog);
   
  addFood = createButton("add food");
  addFood.position(700,50);
  addFood.mousePressed(addFoods);
  
  dog = createSprite(800,250,50,50);
  dog.addImage(dogImg);
  dog.scale = 0.2;

  database = firebase.database();

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);
  
  lastFed = 0;
  
}


function draw() { 
  textSize(20);
  fill("white");
  background(46,139,87);

  foodObj.display();
  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  }) 

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Fed : "+lastFed%12 + "PM",350,30);
  }else if(lastFed==0){
    text("Last Fed : 12 AM",350,30);
  }else{
    text("Last Fed : "+ lastFed + "AM",250,30);
  }

  drawSprites();
  /*
  if(foodS!== undefined){
    text("food remaining: "+foodS,150,150);
    }
    */

}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){
   if(x<=0){
  x = 0; 
} else{
x=x-1;
 } 
 database.ref('/').update({ 
   Food:x 
  }) 
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
async function hour(){
  var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Tokyo"); 
  var responseJSON = await response.json(); 
  var dateTime = responseJSON.datetime;
  var hours = dateTime.slice(11,13);
  return hours;
 

}



