var tmpArrays = [];
var txtSize = 14;
var mainCardWidth = 300; //240.231; //px
var mainCardHeight = mainCardWidth * 1.4; //px
var cardPadding = 5;
var innerMargin = 10;
var splitCardWidth = mainCardHeight / 2;
var page = 1;
var idParent = "#cards";
var cardsCount = 1;
var splitCardSeparator = " // ";
var sideBoardTitle = "SIDEBOARD";
var sideboardListShow;
var allCards = [];
var mainBoard = [];
var sideBoard = [];
var imgBorder = 2;
var spellCols;
var manaCols;
var manaColsHeight = 200;
var manaChart = [];
var barWidth;
var allManaCosts = "";
var manaColor = [];
var manaSum;



var landColor = [
  ["Forest", "Green", "G"],
  ["Island", "Blue", "U"],
  ["Mountain", "Red", "R"],
  ["Plains", "White", "W"],
  ["Swamp", "Black", "B"]
];
var div = "<div></div>";
document.documentElement.style.setProperty("--main-width", mainCardWidth + "px");
document.documentElement.style.setProperty("--main-height", mainCardHeight + "px");
document.documentElement.style.setProperty("--main-font-size", txtSize + "px");
document.documentElement.style.setProperty("--main-padding", cardPadding + "px");
document.documentElement.style.setProperty("--main-margin", innerMargin + "px");
document.documentElement.style.setProperty("--split-width",splitCardWidth + "px");
document.documentElement.style.setProperty("--col-border",imgBorder + "px");
loadDeck();
readDataBase();

function loadDeck() {
  console.log("link",window.location.search);
  var user_input_data = window.location.search;
  user_input_data = user_input_data.split("&");
  console.log(window.location.search);
  var deckName = user_input_data[0].replace("?deck-name=", "");
  deckName = deckName.replace("+", " ");
  var mainList = user_input_data[1].replace("main-board=", "");
  mainList = mainList.split("%0D%0A").join("<br>");
  var sideList = user_input_data[2].replace("side-board=", "");
  sideList = sideList.split("%0D%0A").join("<br>");
  var deckList = mainList + "<br><br>" + sideBoardTitle + "<br><br>" + sideList
  var deckListShow = deckList
    .split("%2F").join("/").split("%27").join("'").split("%2C").join(",").split("+").join(" ");
  console.log(deckName);
  console.log(mainList);
  console.log(sideList);
  console.log(deckList);
  document.getElementById("deck-name").innerHTML = deckName;
  document.getElementById("deck-list").innerHTML = deckListShow;
  deckList = deckList.split("<br>");
  arrayMain = list2array(mainList);
  arraySide = list2array(sideList);
  allCards = arrayMain.concat([1, sideBoardTitle]).concat(arraySide);
  mainBoard = arrayMain.sort();
  sideBoard = arraySide.sort();
  console.log("allCards",allCards.length, allCards);
  console.log("mainBoard",mainBoard.length, mainBoard);
  console.log("sideBoard",sideBoard.length, sideBoard);
}

function list2array(cardList){
  cardList = cardList.split("<br>");
  var arrayCards = [];
  for (var j = 0; j < cardList.length; j++) {
    console.log(cardList[j]);
    var jCard = cardList[j].replace("+", " ").split(" ");
    tmpArrays = new Array(jCard[0] * 1);
    for (var w = 0; w < jCard[0] * 1; w++) {
      tmpArrays[w] = jCard[1]
        .split("%2F").join("/").split("%27").join("'").split("%2C").join(",").split("+").join(" ");
      console.log(tmpArrays);
    }
    arrayCards = arrayCards.concat(tmpArrays);
  }    
  return arrayCards
}

function readDataBase() {
  $.getJSON("https://andre-alvarez.github.io/examples/deck_builder/scryfall-mod.json", getData);
  //$.getJSON("file:///C:/Users/aalva103/Downloads/andre-alvarez.github.io-master/examples/deck_builder/scryfall-mod.json", getData);
  function getData(data) {
    var col = 0;
    var row = 0;
    idParent = "#mana-curve"
    $(idParent).append("<div id='mana-color'></div>")
    $(idParent).append("<div id='deck-curve'></div>")
    $(idParent).append("<div id='main-curve'></div>")
    $(idParent).append("<div id='side-curve'></div>")
    manaCurve(data, mainBoard,"main-curve");
    manaCurve(data, sideBoard,"side-curve");
	console.log(manaChart);
	manaCurveChart();
	manaColorBarChart();
	manaColorPieChart();
  }
}

function manaCurve(data, cards, idBoard ){
    var m, c, s;
    m = c = s = 0;
    var creatureCards = [];
    var manaCards = [];
    var spellCards = [];
    var layout, colors, name, manaCost, type, cmc, pt, loyalty, img;
    for (var i = 0; i < cards.length; i++) {
      var cardName = cards[i];
      var card = data.findIndex(p => p.name.includes(cardName));
      layout = data[card].layout;
      colors = data[card].colors;
      name = data[card].name;
      manaCost = data[card].mana_cost;
	  allManaCosts = allManaCosts + manaCost
      cmc = data[card].cmc;
      type = data[card].type_line;
      img = data[card].image_uris.large;
      console.log(cmc,name);
      if(type.includes("Land")){
        tmpArrays = new Array(2);
        tmpArrays[0] = cmc;
        tmpArrays[1] = name;
        tmpArrays[2] = img;
        manaCards[m] = tmpArrays;
        m++;
      /*} else if(type.includes("Creature")) {
        tmpArrays = new Array(2);
        tmpArrays[0] = cmc;
        tmpArrays[1] = name;
        tmpArrays[2] = img;
        creatureCards[c] = tmpArrays;
        creatureCards.sort(function(a,b){
             return a[0] - b[0];
        });
        c++;*/
      } else {
        tmpArrays = new Array(2);
        tmpArrays[0] = cmc;
        tmpArrays[1] = name;
        tmpArrays[2] = img;
        spellCards[s] = tmpArrays;  
        spellCards.sort(function(a,b){
             return a[0] - b[0];
        });
        s++;
      }
      console.log("counters",i,m,c,s);
    }
    console.log(manaCards.length, manaCards);
    //console.log(creatureCards.length, creatureCards);
    console.log(spellCards.length, spellCards);
    $("#" + idBoard)//.append("<div class='creatures card-container' id='" + idBoard + "-creatures'></div>")
    .append("<div class='spells card-container' id='" + idBoard + "-spells'></div>")
    .append("<div class='mana card-container' id='" + idBoard + "-mana'></div>");
    //addCards(creatureCards,idBoard + "-creatures");
    addSpellCards(spellCards,idBoard + "-spells");
    addManaCards(manaCards,idBoard + "-mana");
	imgWidthFix();
	console.log(manaChart);
}

function addSpellCards(cards,idBoard){
  console.log(cards.length, cards);
  var maxMana = cards[cards.length-1][0];
  console.log(maxMana);
  for (col = 0; col < maxMana+1; col++){
	var row = 0;
    var colDiv = $(div).addClass("column-wrapper column-" + col);
    for (j = 0; j<cards.length; j++){
      if(cards[j][0] === col){
        var cardId = "card-" + col + "-" + row;
        var cardDiv = $(div).addClass("card-image").attr("id", cardId).append("<input type='checkbox' id='cb-" + cardId + "' name='images' onclick=''><img src='" + cards[j][2] + "' alt='" + cards[j][1] + "'/>");
        colDiv = colDiv.append(cardDiv);
        row++
      }
    }
	if (row === 0){
      var cardDiv = $(div).addClass("card-image").attr("id", cardId).append("<div class='no-card'></div>");
      colDiv = colDiv.append(cardDiv);
	}
    $("#" + idBoard).append(colDiv);
	//console.log(manaChart[col],col,row)
	//manaChart.push(row)
	//manaChart[col] = [manaChart[col][0]|| 0 + row,col];
	manaChart[col] = manaChart[col]|| 0 + row;
  }
  spellCols = col
}

function addManaCards(cards,idBoard){
  console.log(cards.length, cards);
  var col = 0;
  var colDiv = $(div).addClass("column-wrapper column-" + col);
  for (j = 0; j<cards.length; j++){
    var row = 0;
    if(j > 0 && cards[j][1] != cards[j-1][1]){
	  $("#" + idBoard).append(colDiv);
	  col++;
      colDiv = $(div).addClass("column-wrapper column-" + col);
	}
      var cardId = "card-" + col + "-" + row;
      var cardDiv = $(div).addClass("card-image").attr("id", cardId).append("<img src='" + cards[j][2] + "' alt='" + cards[j][1] + "'/>");
      colDiv = colDiv.append(cardDiv);
      row++;
  }
  $("#" + idBoard).append(colDiv);
  manaCols = col
}

function imgWidthFix(){
	var maxCols = spellCols;
	if(manaCols > spellCols){
		maxCols = manaCols;
	}
	var divWidth = document.getElementById("deck-curve").offsetWidth
	console.log("width calc",divWidth,maxCols,barWidth,imgBorder,imgWidth);
	barWidth = divWidth/maxCols
	var imgWidth = divWidth/maxCols - 2*imgBorder;
	console.log(imgWidth, divWidth + "/" + maxCols + " - " + "2*" + imgBorder)
	document.documentElement.style.setProperty("--img-width", imgWidth + "px");
}

function manaCurveChart(){
  var textSize = 15
  document.documentElement.style.setProperty("--text-size",textSize + "px");
  var divWidth = document.getElementById("deck-curve").offsetWidth;
  //var maxValeu = console.log(Math.max.apply(Math, maxValeu.map(function (i) { return i[0];})));
  var maxValeu = Math.max(...manaChart);
  manaColsHeight = Math.ceil(maxValeu * (textSize * 1.1));
  var manaTarget = [1,0.6,1,1,0.6,0.3] ;
  var points ="0,0 ";
  var chartDiv = $(div).addClass("chart-area");
  $("#deck-curve").append(chartDiv);
  var cardDiv = document.getElementsByClassName("chart-area");
  var svgDiv = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svgDiv.setAttribute("height", manaColsHeight + 20);
  svgDiv.setAttribute("width", "100%");
  chartDiv.append(svgDiv);
  var xLabel = document.createElementNS("http://www.w3.org/2000/svg", "g");
  xLabel.setAttribute("class" , "labels x-labels");
  svgDiv.appendChild(xLabel);
  //manaChart = manaChart.map(function(i) { return [(i[0] / maxValeu * 100),i[1]];});
  //manaChartCols = manaChart.map(function(x) { return x / maxValeu * manaColsHeight; });
  manaChartCols = manaChart.map(function(x) { return Math.ceil(x * (textSize * 1.1)); });
  for (w = 0; w < manaChartCols.length; w++){
    //var colHeight = manaChart[w][0];
    var colHeight = manaChartCols[w];
	console.log("colHeight",manaColsHeight,colHeight)
    //var manaBar = $(div).addClass("mana-bar").append("<div class='mana-fill' style='height: " + colHeight + "%; top: " + (100 - colHeight) + "%;'></div>");
	var xLabel = document.getElementsByClassName("labels");
	console.log(xLabel);
	var xText = document.createElementNS("http://www.w3.org/2000/svg", "text");
	xText.setAttribute("x",((w*barWidth)+(barWidth/2)));
	xText.setAttribute("y",manaColsHeight + 15);
	xText.textContent = w;
	$(xLabel).append(xText);
	var manaBar = document.createElementNS("http://www.w3.org/2000/svg", "g");
	manaBar.setAttribute("class" , "bar");
	manaBar.setAttribute("transform" , "translate(" + (w*barWidth) + "," + (manaColsHeight - colHeight) + ")");
	var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	rect.setAttribute('width', barWidth);
	rect.setAttribute('height', colHeight);
	manaBar.append(rect);
	var manaBarText = document.createElementNS("http://www.w3.org/2000/svg", "text");
	manaBarText.setAttribute("x",((barWidth - (textSize * 1.1)) / 2));
	manaBarText.setAttribute("y", Math.ceil(colHeight/2 + textSize/2 - textSize*0.1) );
	manaBarText.textContent = ('0' + manaChart[w]).slice(-2);
	manaBar.append(manaBarText);
    svgDiv.appendChild(manaBar);
	var colTargetHeight = Math.ceil((manaTarget[w]||0.3)*manaColsHeight);
	var manaBarTarget = document.createElementNS("http://www.w3.org/2000/svg", "g");
	manaBarTarget.setAttribute("class" , "bar-target");
	manaBarTarget.setAttribute("transform" , "translate(" + (w*barWidth) + "," + (manaColsHeight - colTargetHeight) + ")");
	var rectTarget = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	rectTarget.setAttribute('width', barWidth);
	rectTarget.setAttribute('height', colTargetHeight);
	manaBarTarget.append(rectTarget);
    svgDiv.appendChild(manaBarTarget);
	points = points +((w*barWidth)+(barWidth/2)) + "," + (manaColsHeight - colTargetHeight) + " ";
  }
  points = points +((w*barWidth)) + "," + (manaColsHeight - ((manaTarget[w]||0.3)*manaColsHeight)) + " ";
  points = points +((w*barWidth)) + "," + manaColsHeight+ " 0," + manaColsHeight;
  //$("#deck-curve").append(chartDiv.append(svgDiv));
  var manaPline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  manaPline.setAttribute("fill" , "#00000059");
  manaPline.setAttribute("stroke" , "none");
  manaPline.setAttribute("stroke-width" , "3");
  manaPline.setAttribute("points" , points);
  svgDiv.appendChild(manaPline);
  
}


function manaColorBarChart(){
  var barHeight = 20;
  document.documentElement.style.setProperty("--bar-height",barHeight + "px");
  allManaCosts = allManaCosts.replace(/[0-9]/g, "X");
  allManaCosts = allManaCosts.replace(/XX/g, "X");
  var matches = allManaCosts.match(/[a-zA-Z]+/g);
  manaColor = [["Color Less","C","Gray",0],["Any Color","X","Gray",0],["Plains","W","Yellow",0],["Island","U","Blue",0],["Swamp","B","Black",0],["Forest","G","Green",0],["Mountain","R","Red",0]];
  for  (k = 0; k < matches.length; k++){
    for  (j = 0; j < manaColor.length; j++){
	  if (matches[k] === manaColor[j][1]){
		manaColor[j][3] = manaColor[j][3] + 1;
      }
	}
  }
  console.log("manaColor",manaColor);
  var divWidth = document.getElementById("mana-color").offsetWidth;
  var manaDl = $("<dl></dl>").addClass("mana-color-bar");
  for  (j = 0; j < manaColor.length; j++){
	  var percentage = Math.round((manaColor[j][3]/matches.length) * 100);
	  manaDd = $("<dd></dd>").addClass("color-" + manaColor[j][1]);
	  manaDd.append("<div class='mana-icon icon-" + manaColor[j][1] + "'></div>");
	  manaDd.append("<div class='bar' style=' width: " + percentage + "%; background-color: " + manaColor[j][2] + "'>"+ percentage + "% (" + manaColor[j][3] + ")</div>");
	  manaDl.append(manaDd);
  }
  $("#mana-color").append(manaDl);
}

function manaColorPieChart(){
  var barHeight = 20;
  var barWidth = 300;
  document.documentElement.style.setProperty("--bar-height",barHeight + "px");
  allManaCosts = allManaCosts.replace(/[0-9]/g, "X");
  allManaCosts = allManaCosts.replace(/XX/g, "X");
  var matches = allManaCosts.match(/[a-zA-Z]+/g);
  manaSum = matches.length;
  manaColor = [["Color Less","C","Gray",0],["Any Color","X","Gray",0],["Plains","W","Yellow",0],["Island","U","Blue",0],["Swamp","B","Black",0],["Forest","G","Green",0],["Mountain","R","Red",0]];
  for  (k = 0; k < manaSum; k++){
    for  (j = 0; j < manaColor.length; j++){
	  if (matches[k] === manaColor[j][1]){
		manaColor[j][3] = manaColor[j][3] + 1;
      }
	}
  }
  console.log("manaColor",manaColor);
  var totalMana = 24;
  var manaForm = $("<form class='mana-input-form' name='mana-input-form' onsubmit='return false' oninput='totalManaInput()'><input name='total-mana' value='" + totalMana + "'></form>");
  var divWidth = document.getElementById("mana-color").offsetWidth;
  var pieDiv = $("<div></div>").addClass("mana-color-pie pie");
  var legUl = $("<ul></ul>").addClass("mana-color-pie legend");
  for  (j = 0; j < manaColor.length; j++){
	  var manaRatio = (manaColor[j][3]/matches.length);
	  
	  legLi = $("<li></li>");
	  legLi.append("<div class='mana-icon icon-" + manaColor[j][1] + "'></div>");
	  //legLi.append("<em>" + manaColor[j][0] + "</em>");
	  legLi.append("<div class='mana-qnt'>(" + manaColor[j][3] + ")</span>");
	  legLi.append("<span id='mana-" + manaColor[j][1] + "'>" + Math.round(manaRatio * totalMana) + "</span>");
	  legLi.append("<div class='mana-bar' id='mana-bar-" + manaColor[j][1] + "' style=' width: " + Math.round(manaRatio * barWidth) + "px; background-color: " + manaColor[j][2] + "'></div>");
	  legUl.append(legLi);
  }
  $(pieDiv).append(manaForm);
  $("#mana-color").append(pieDiv);
  $("#mana-color").append(legUl);
  createPie(".mana-color-pie.legend", ".mana-color-pie.pie");
}

function totalManaInput(){
  var totalMana = document.getElementsByName("total-mana")[0].value;
  for  (j = 0; j < manaColor.length; j++){
	console.log("totalManaInput",manaColor[j][3],totalMana,manaSum);
	var manaRatio = (manaColor[j][3]/manaSum);
	document.getElementById("mana-" + manaColor[j][1]).innerHTML = Math.round(manaRatio * totalMana)
	//var legBar = document.getElementById("mana-bar-" + manaColor[j][1]);
  }
}

function sliceSize(dataNum, dataTotal) {
  return (dataNum / dataTotal) * 360;
}
function addSlice(sliceSize, pieElement, offset, sliceID, color) {
  $(pieElement).append("<div class='slice "+sliceID+"'><span></span></div>");
  var offset = offset - 1;
  var sizeRotation = -179 + sliceSize;
  $("."+sliceID).css({
    "transform": "rotate("+offset+"deg) translate3d(0,0,0)"
  });
  $("."+sliceID+" span").css({
    "transform"       : "rotate("+sizeRotation+"deg) translate3d(0,0,0)",
    "background-color": color
  });
}
function iterateSlices(sliceSize, pieElement, offset, dataCount, sliceCount, color) {
  var sliceID = "s"+dataCount+"-"+sliceCount;
  var maxSize = 179;
  if(sliceSize<=maxSize) {
    addSlice(sliceSize, pieElement, offset, sliceID, color);
  } else {
    addSlice(maxSize, pieElement, offset, sliceID, color);
    iterateSlices(sliceSize-maxSize, pieElement, offset+maxSize, dataCount, sliceCount+1, color);
  }
}
function createPie(dataElement, pieElement) {
  var listData = [];
  $(dataElement+" span").each(function() {
    listData.push(Number($(this).html()));
  });
  var listTotal = 0;
  for(var i=0; i<listData.length; i++) {
    listTotal += listData[i];
  }
  var offset = 0;
  var color = [
    "gray",
    "gray",  
    "yellow", 
    "blue", 
    "black", 
    "green", 
    "red"
  ];
  for(var i=0; i<listData.length; i++) {
    var size = sliceSize(listData[i], listTotal);
    iterateSlices(size, pieElement, offset, i, 0, color[i]);
    $(dataElement+" li:nth-child("+(i+1)+")").css("border-color", color[i]);
    offset += size;
  }
}
