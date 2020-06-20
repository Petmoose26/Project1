// NAVIGATION FUNCTIONALITY
// Initial document set to show home page
document.getElementById("homePage").style.display = "block";
document.getElementById("foodPage").style.display = "none";
document.getElementById("drinkPage").style.display = "none";
document.getElementById("userPage").style.display = "none";

// SHOW HOME PAGE
// Data structure of each single meal
// var mealObj = {
//     mName:"Fried Chicken",
//     mRecipe:"",
//     mIngreQty:[{mIngre:"lemon", mInQty:"4 teaspoon"}],  <- ingredientName, Quantity
//     mPic:"",     < Meal Pic
//     mIngLen,     <- Number of Ingredent used in FOR loop
//     mID          <- Index the meal to retreive in array
// }

// // Array List of favorite Recipes
// var arrayR = [];
var fChoice = []; // choice to be selected
var mealDetail;  

$("#home").on("click", showHome);
function showHome() {
  console.log("Enter showHome");
  document.getElementById("homePage").style.display = "block";
  document.getElementById("foodPage").style.display = "none";
  document.getElementById("mealResult").style.display = "none";
  document.getElementById("drinkPage").style.display = "none";
  document.getElementById("userPage").style.display = "none";
}

//DROPDOWNS Functionality: Food and Drink page
$(".ui.dropdown").dropdown();


$("#food").on("click", showFoodPage);
function showFoodPage() {
  document.getElementById("homePage").style.display = "none";
  document.getElementById("foodPage").style.display = "block";
  document.getElementById("drinkPage").style.display = "none";
  document.getElementById("userPage").style.display = "none";
}

// Listener for Meal Search
$("#searchMeal").on("click", mealList);

// API call to retrieve Receipe Name, instruction, pic, quantity
function mealList(event) {
  //get user meal input
  var mealChoice = $("#mealInput").val();
  mealDetail=false;

  console.log("User input", mealChoice);

  // Clear any previous displayed items
  //$("#foodList").empty();

  var fURL =
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + mealChoice;

  $.ajax({
    url: fURL,
    method: "GET",
  }).then(processData);
} // end mealList

function processData(fObject) {
  console.log(
    "food object is:",
    fObject,
    " with ",
    fObject.meals.length,
    " meals inside"
  );

  var numFood = fObject.meals.length; // # of meals suggested

  for (var mealCnt = 0; mealCnt < numFood; mealCnt++) {
    //Create new mealObj
    var mealObj = {};
    mealObj["mName"] = fObject.meals[mealCnt].strMeal;
    mealObj["mInst"] = fObject.meals[mealCnt].strInstructions;
    mealObj["mPic"] = fObject.meals[mealCnt].strMealThumb;
    mealObj["mIngreQty"] = []; // Array to store multiple Ingredients for that same meal
    mealObj["mID"] = mealCnt;


    // Initialize the first ingredent and qty index
    var index = 1;

    // process and add all Ingredients in the obj. Return # of ingredients.
    var ingLen = pIngredient(fObject, mealObj,mealCnt, index);

    mealObj["mIngLen"] = ingLen; 
    console.log("This meal obj is: ", mealObj, mealObj.mID, ingLen);

    // save the list of objects in the foodChoice array. Allow LS and detail retrieve
    fChoice.push(mealObj);
    renderNamePic(mealObj);
  } // end For.
  console.log("The Suggested Chocies include in this food array:", fChoice);
} // end Process Data


function pIngredient(fObject, mealObj, mealCnt, index) {

  var ingre = "strIngredient" + index;
  var ingreQty = "strMeasure" + index;

  // If ingredent field is not blank AND searched <= max 20
  while ((fObject.meals[mealCnt][ingre] != "") && (index <= 20)) {
    // create Dict for Ingredient/Qty, on that index (ingredent #)
    mealObj["mIngreQty"][index] = {};

    // assign Ingredient Name, and Qty to this new key/value pair.
    mealObj["mIngreQty"][index - 1] = {
      'mIngre': fObject.meals[mealCnt][ingre],
      'mIQty': fObject.meals[mealCnt][ingreQty]
    };

    index++;
    // New property name base on next index
    var ingre = "strIngredient" + index;
    var ingreQty = "strMeasure" + index;
  } // end While

  // Return number of ingredients in this meal
  return (index-1);
} // end pIngredient




// Display Food on Food container "foodList"
function renderNamePic(mealObj) {
  var fName = $("<h2>").text(mealObj.mName).addClass("star outline icon");
  var fPic = $("<img>")
    .attr("src", mealObj.mPic)
    .addClass("ui fluid image rounded")
    .css("float", "left");
  
  fPic.attr("data-index", mealObj.mID);
  fPic.click(function () {
    mealDetail = true;
    console.log("Clicked on: ", $(this).attr("data-index"));
    renderNamePic(fChoice[$(this).attr("data-index")]);
  });

  var nPicCon = $("<div>")
    .append(fName, fPic)
    .addClass("seven wide column pusher");

  console.log("Enter renderNamePic, nPicCon is ", nPicCon);
  $("#foodList").append(nPicCon).css("display", "block");
  
  if (mealDetail == true) {
    $("#mealResult").empty();
    renderIng(mealObj, nPicCon);
    mealDetail = false;
  }
  
}

function renderIng(mealObj, nPicCon) {
  var i = 0;
  var iuiList = $("<div>").addClass("ui celled unordered list");

  console.log("Ingredent length: ", mealObj.mIngLen);
  while (i < mealObj.mIngLen) {
    var inDetail = $("<div>")
      .text(mealObj.mIngreQty[i].mIQty + " " + mealObj.mIngreQty[i].mIngre)
      .addClass("item");
    iuiList.append(inDetail);
    i++;
  } // end While

  renderInst(mealObj, iuiList, nPicCon);
} // end renderIng


function renderInst(mealObj, iuiList, nPicCon) {
  // Display Instruction on the right

  var item = $("<div>").addClass("item");
  var content = $("<div>").addClass("content");
  var direction = $("<a>").text("Directions").addClass("header");
  var description = $("<div>").addClass("description");
  var fInst = $("<p>").text(mealObj.mInst);
  var instC = $("<div>")
    .append(item, content, direction, description, fInst)
    .addClass("ui items");

  //var ingInstCon = $("<div>").append(iuiList,instC).addClass("seven wide column row");
  //var mContainer = $("<div>").append(nPicCon, ingInstCon).addClass("three column row");
  //var mContainer = $("<div>").append(nPicCon, iuiList,instC).addClass("three column row");

  nPicCon.append(fInst);
  var mContainer = $("<div>")
    .append(nPicCon, iuiList)
    .addClass("three column row");
  console.log("Before the whole mContainer", mContainer);
  $("#mealResult").append(mContainer).css("display","block");

} // end renderInst

$("#user").on("click", showUserProfile);
function showUserProfile() {
  console.log("Enter showUserProfile");
  document.getElementById("homePage").style.display = "none";
  document.getElementById("foodPage").style.display = "none";
  document.getElementById("drinkPage").style.display = "none";
  document.getElementById("userPage").style.display = "block";
}
