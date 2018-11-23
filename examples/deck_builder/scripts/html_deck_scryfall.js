var arrayCards = [];
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
var sideBoard = "SIDEBOARD";
var sideboardListShow;

var landColor = [
  ["Forest", "Green", "G"],
  ["Island", "Blue", "U"],
  ["Mountain", "Red", "R"],
  ["Plains", "White", "W"],
  ["Swamp", "Black", "B"]
];

document.documentElement.style.setProperty("--main-width", mainCardWidth + "px");
document.documentElement.style.setProperty("--main-height", mainCardHeight + "px");
document.documentElement.style.setProperty("--main-font-size", txtSize + "px");
document.documentElement.style.setProperty("--main-padding", cardPadding + "px");
document.documentElement.style.setProperty("--main-margin", innerMargin + "px");
document.documentElement.style.setProperty("--split-width",splitCardWidth + "px");
idParent = "#page_" + page;
$("#cards").append("<div class='pagebreak' id='" + "page_" + page + "'></div>");
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
  var deckList = mainList + "<br><br>" + sideBoard + "<br><br>" + sideList
  var deckListShow = deckList
    .split("%2F").join("/").split("%27").join("'").split("%2C").join(",").split("+").join(" ");
  console.log(deckName);
  console.log(mainList);
  console.log(sideList);
  console.log(deckList);
  document.getElementById("deck-name").innerHTML = deckName;
  document.getElementById("deck-list").innerHTML = deckListShow;
  deckList = deckList.split("<br>");
  for (var j = 0; j < deckList.length; j++) {
    console.log(deckList[j]);
    var jCard = deckList[j].replace("+", " ").split(" ");
    if (jCard[0].replace(" ", "").toUpperCase() === sideBoard){
      sideboardListShow = deckListShow.split(jCard[0])[1];
      jCard[0] = 1;
      jCard[1] = sideBoard;
      console.log("sideboardListShow",sideboardListShow);
    }
    console.log(jCard[0]);
    console.log(jCard[0] * 2);
    console.log(jCard[1]);
    tmpArrays = new Array(jCard[0] * 1);
    for (var w = 0; w < jCard[0] * 1; w++) {
      tmpArrays[w] = jCard[1]
        .split("%2F") .join("/") .split("%27").join("'") .split("%2C").join(",") .split("+").join(" ");
      console.log(tmpArrays);
    }
    arrayCards = arrayCards.concat(tmpArrays);
    console.log(arrayCards);
    console.log(arrayCards.length);
  }
}

function readDataBase() {
  $.getJSON(
    "https://andre-alvarez.github.io/examples/deck_builder/scryfall-mod.json",
    getData
  ); //"/cards.json", getData);
  function getData(data) {
    var col = 0;
    var row = 0;
    var layout, colors, name, manaCost, type, text, pt, loyalty, img;
    //console.log(data);
    sideFlag = false;
    for (var i = 0; i < arrayCards.length; i++) {
      console.log(arrayCards[i]);
      if(arrayCards[i].toUpperCase() === sideBoard){
        console.log("sideFlag", sideFlag);
        sideFlag = true;
        createSideboardToken(col, row);
      } else {
        var cardName = arrayCards[i];
        var card = data.findIndex(p => p.name.includes(cardName));
        layout = data[card].layout;
        if (layout === "split") {
          console.log(splitCardSeparator);
          console.log("splited card");
          var splitCard = arrayCards[i].split(splitCardSeparator);
          //colors = data[card].card_faces[0].colors, data[splitCard[1]].colors];
          name = [data[card].card_faces[0].name, data[card].card_faces[1].name];
          manaCost = [data[card].card_faces[0].mana_cost, data[card].card_faces[1].mana_cost];
          type = [data[card].card_faces[0].type_line, data[card].card_faces[1].type_line];
          text = [data[card].card_faces[0].oracle_text, data[card].card_faces[1].oracle_text];
          layout = [data[card].layout, data[card].layout];
          img = data[card].image_uris.large;
          createSplitCard(layout, name, manaCost, type, text, col, row, img);
        } else if (layout === "transform") {
          console.log("transform");
          var names = [data[card].card_faces[0].name, data[card].card_faces[1].name];
          for (d=0; d< names.length; d++){
            // doubleCard = names[d]
            console.log(data[card].card_faces[d].name);
            colors = data[card].card_faces[d].colors;
            name = data[card].card_faces[d].name;
            manaCost = data[card].card_faces[d].mana_cost;
            text = data[card].card_faces[d].oracle_text;
            pt = data[card].card_faces[d].power + " / " + data[card].card_faces[d].toughness;
            loyalty = data[card].card_faces[d].loyalty;
            type = data[card].card_faces[d].type_line;
            img = data[card].card_faces[d].image_uris.large;
            console.log(col + " ; " + row);
            if(d > 0){
              cardsCount++
              if (col == 2) {
                col = 0;
                row++;
              }else{
                col++
              }
            }
            console.log(col + " ; " + row);
            nonSplitCards(layout, colors, name, manaCost, type, text, pt, loyalty, col, row, img);
            if(d == 0){
              newPage(cardsCount);
            }
          }
        } else {
          colors = data[card].colors;
          name = data[card].name;
          manaCost = data[card].mana_cost;
          text = data[card].oracle_text;
          pt = data[card].power + " / " + data[card].toughness;
          loyalty = data[card].loyalty;
          layout = data[card].layout;
          type = data[card].type_line;
          img = data[card].image_uris.large;
          nonSplitCards(layout, colors, name, manaCost, type, text, pt, loyalty, col, row, img);
        }
      }
      col++;
      console.log(col + " ; " + row);
      if (col == 3) {
        col = 0;
        row++;
      }
      console.log(col + " ; " + row);
      console.log("newPage function")
      newPage(cardsCount);
      cardsCount++
      console.log(col, row);
    }
  }
}
function nonSplitCards(layout, colors, name, manaCost, type, text, pt, loyalty, col, row, img) {
  if (type.includes("Creature")) {
    console.log("Creature card");
    createCreaturePlaneswalkerCard(layout, colors, name, manaCost, type, text, pt, col, row, img);
  } else if (type.includes("Land")) {
    console.log("Land card");
    createLandCard(layout, colors, name, manaCost, type, text, col, row, img);
  } else if (type.includes("Planeswalker")) {
    console.log("Planeswalker card");
    createCreaturePlaneswalkerCard(layout, colors, name, manaCost, type, text, loyalty, col, row, img);
  } else if (type.includes("Enchantment")) {
    console.log("Enchantment card");
    createNonPermanentCard(layout, colors, name, manaCost, type, text, col, row, img);
  } else if (type.includes("Artifact")) {
    console.log("Artifact card");
    createNonPermanentCard(layout, colors, name, manaCost, type, text, col, row, img);
  } else {
    console.log("Everything else");
    createNonPermanentCard(layout, colors, name, manaCost, type, text, col, row, img);
  }
}

function createSplitCard(layout, name, manaCost, type, text, col, row, img) {
  console.log("arguments", arguments);
  console.log("name length", name.length);
  var cardId = "card_" + col + "_" + row;
  var div = "<div></div>";
  var cardDiv = $(div)
    .addClass("card")
    .attr("id", cardId);
  if (text[1].includes("Aftermath")){
    layout[0] = "aftermath";
  }
  var imgDiv = $(div).addClass("card-img").append("<img src='" + img + "'/>");
  $(idParent).append(cardDiv);
  var colors = [];
  var searchStr = /[A-Z.]+/mg;
  for (j = 0; j < name.length; j++) {
    colors[j] = removeDuplicate(manaCost[j].match(searchStr));
    var cardSplitId = cardId + "_" + j;
    var cardSplitDiv = createCard(layout[j], name[j], manaCost[j], type[j],text[j], cardSplitId);
    $("#" + cardId).append(cardSplitDiv);
    modifyCss.call( $("#" + cardSplitId), layout[j], col, row, colors[j], splitCardWidth,  mainCardWidth );
  }
  $("#" + cardId).append(imgDiv);
}

function createCreaturePlaneswalkerCard( layout, colors, name, manaCost, type, text, pt_loyalty, col, row, img) {
  var cardId = "card_" + col + "_" + row;
  var div = "<div></div>";
  var pt_loyaltyBoxDiv = $(div).addClass("pt-loyalty-box");
  var pt_loyaltyDiv = $(div)
    .addClass("pt-loyalty")
    .append("<span>" + pt_loyalty + "</span>");
  console.log("layout", layout);
  var cardDiv = createCard(layout, name, manaCost, type, text, cardId);
  var imgDiv = $(div).addClass("card-img").append("<img src='" + img + "'/>");
  $(idParent).append(cardDiv.append(pt_loyaltyBoxDiv.append(pt_loyaltyDiv)).append(imgDiv));
  console.log("this: " + this);
  modifyCss.call($("#" + cardId), layout, col, row, colors, mainCardWidth, mainCardHeight);
}

function createLandCard(layout, colors, name, manaCost, type, text, col, row, img) {
  var cardId = "card_" + col + "_" + row;
  var div = "<div></div>";
  if (type.includes("Basic")) {
    console.log("Basic Land");
    console.log(name);
    for (i = 0; i < landColor.length; i++) {
      console.log(landColor[i][0]);
      if (landColor[i][0] === name) {
        colors = [landColor[i][2]];
        //manaCost = landColor[i][2];
        //text = "Tap to add " + landColor[i][2] + " to your mana pool.";
        console.log(colors, manaCost, text);
      }
    }
  } else {
    colors = ["#FFDF00"];
    console.log("colors", colors);
  }
  var cardDiv = createCard(layout, name, manaCost, type, text, cardId);
  var imgDiv = $(div).addClass("card-img").append("<img src='" + img + "'/>");
  $(idParent).append(cardDiv.append(imgDiv));
  modifyCss.call($("#" + cardId), layout, col, row, colors, mainCardWidth, mainCardHeight);
}

function createNonPermanentCard(layout, colors, name, manaCost, type, text, col, row, img){
  var cardId = "card_" + col + "_" + row;
  var div = "<div></div>";
  var cardDiv = createCard(layout, name, manaCost, type, text, cardId);
  var imgDiv = $(div).addClass("card-img").append("<img src='" + img + "'/>");
  $(idParent).append(cardDiv.append(imgDiv));
  modifyCss.call($("#" + cardId), layout, col, row, colors, mainCardWidth, mainCardHeight);
}

function createCard(layout, name, manaCost, type, text, cardId) {
  console.log("cardId", cardId);
  var div = "<div></div>";
  if (text === null) {
    text = "";
  }
  var nameBarDiv = $(div).addClass("name-bar");
  var nameDiv = $("<div></div>")
    .addClass("name")
    .text(name);
  var artSpaceDiv = $(div).addClass("art-space");
  var typeBarDiv = $(div).addClass("type-bar");
  var typeDiv = $(div)
    .addClass("type")
    .text(type);
  var txtSpaceDiv = $(div).addClass("text-space");
  console.log("text", text);
  var textHtml;
  if (type.includes("Planeswalker" || "Saga")) {
    textHtml = text.split("\n").join("<br><br>");
  } else {
    textHtml = text.split("\n").join("<br>");
  }
  var txtDiv = $(div)
    .addClass("text")
    .append(replaceManaInText(/\{([^}]+)\}/gm, textHtml));
  var manaCostDiv = $(div).addClass("mana-cost");
  console.log("manaCost", manaCost);
  if (manaCost != null) {
    var arrayMana = manaCost
      .split("}{") .join(";") .replace("{", "").replace("}", "") .split(";");
    for (i = arrayMana.length - 1; i > -1; i--) {
      var mana = arrayMana[i];
      console.log("mana", mana);
      var manaClass =
        "mana-icon icon-" +
        mana.replace("{", "").replace("}", "").replace("/", "");
      console.log("manaClass", manaClass);
      var manaP = $("<p></p>")
        .addClass(manaClass)
        .text(mana);
      manaCostDiv = manaCostDiv.append(manaP);
    }
  }
  console.log("layout", layout);
  if (layout.includes("split")) {
    var cardSplit = $(div)
      .addClass("card-split")
      .attr("id", cardId);
    return $(cardSplit)
      .append(nameBarDiv.append(nameDiv).append(manaCostDiv))
      .append(artSpaceDiv)
      .append(typeBarDiv.append(typeDiv))
      .append(txtSpaceDiv.append(txtDiv));
  } else if (layout.includes("aftermath")) {
    var cardAftermath = $(div)
      .addClass("card-aftermath")
      .attr("id", cardId);
    return $(cardAftermath)
      .append(nameBarDiv.append(nameDiv).append(manaCostDiv))
      .append(artSpaceDiv)
      .append(typeBarDiv.append(typeDiv))
      .append(txtSpaceDiv.append(txtDiv));
  } else {
    var cardDiv = $(div).addClass("card").attr("id", cardId);
    return $(cardDiv)
      .append(nameBarDiv.append(nameDiv).append(manaCostDiv))
      .append(artSpaceDiv)
      .append(typeBarDiv.append(typeDiv))
      .append(txtSpaceDiv.append(txtDiv));
  }
}

function modifyCss(layout, col, row, colors, cardWidth, cardHeight) {
  if (sideFlag){
    this.css({"font-style": "italic"});
    console.log("sideFlag", sideFlag);
  }
  console.log("layout", layout);
  if(col == 0){var multipler = 0;}else{var multipler = -1;}
  if (layout.includes("split")) {
    console.log(j, cardWidth);
    console.log(this.parent());
    this.css({"transform": "rotate(90deg) translate(" + (j * cardWidth - (cardPadding + 1)) + "px, -" + (cardHeight - (cardPadding + 1)) + "px)"
    });
    //For .card as absolute this.parent().css({"margin-left": col * mainCardWidth + "px","margin-top": row * mainCardHeight + "px"});
    this.parent().css({"margin-left": col * mainCardWidth + "px","margin-top": multipler * mainCardHeight + "px" });
    this.find(".art-space").height($(".art-space").height() / 2);
    cardHeight = cardHeight - (cardPadding + 1);
  } else if (layout.includes("aftermath")) {
    console.log(j, cardHeight);
    this.css({"transform": "translate(" + (j * cardWidth - (cardPadding + 1)) + "px," +  (j * mainCardHeight / 2 - (cardPadding + 1)) + "px)" });
    this.find(".art-space").height($(".art-space").height() / 2);
    cardHeight = mainCardHeight / 2 - (cardPadding + 1);
  } else {
    //For .card as absolute this.css({ "margin-left": col * cardWidth + "px", "margin-top": row * cardHeight + "px" });
    this.css({ "margin-left": col * cardWidth + "px", "margin-top": multipler * cardHeight + "px" });
  }
  var txtSpaceHeight = cardHeight - $(".name-bar").height() - this.find(".art-space").height() -  $(".type-bar").height() - 2 * cardPadding - innerMargin;
  console.log("txtSpaceHeight", txtSpaceHeight);
  this.find(".text-space").height(txtSpaceHeight);
  this.find(".pt-loyalty").width(this.find(".pt-loyalty > span").width());
  console.log("colors", colors,Array.isArray(colors),colors.length);
  if (Array.isArray(colors) && colors.length === 2) {
    this.find(".name-bar, .type-bar").css({"background-color": colorHEX(colors[0]),
      "background-image": "linear-gradient(to right," + colorHEX(colors[0]) + " 0%," + colorHEX(colors[1]) + " 100%)", "-webkit-print-color-adjust": "exact" });
  } else if (Array.isArray(colors) && colors.length > 2) {
    this.find(".name-bar, .type-bar").css({"background-color": colorHEX("#FFDF00"), "-webkit-print-color-adjust": "exact" });
  } else if (colors == null || (Array.isArray(colors) && colors.length === 0)) {
    this.find(".name-bar, .type-bar").css({"background-color": colorHEX("Gray"), "-webkit-print-color-adjust": "exact" });
  } else {
    console.log("else:", colors);
    console.log("hex color: " + colorHEX(colors[0]));
    this.find(".name-bar, .type-bar").css({"background-color": colorHEX(colors[0]), "-webkit-print-color-adjust": "exact" });
  }
}

function replaceManaInText(searchStr, str) {
  console.log("replaceManaInText");
  console.log(searchStr);
  var result, indices = [];
  while ((result = searchStr.exec(str)) !== null) {
    indices.push(result.index);
    console.log(result.index);
    console.log(result[0]);
  }
  var m = [];
  console.log(indices);
  for (i = 0; i < indices.length; i++) {
    console.log(i + " " + indices[i]);
    var c = str.charAt(indices[i]);
    var n = 0;
    do {
      n = n + 1;
      c = c + str.charAt(indices[i] + n);
    } while (str.charAt(indices[i] + n) !== "}");
    //c = c + str.charAt(indices[i] + n);
    console.log(c);
    m.push(c);
  }
  for (i = 0; i < m.length; i++) {
    str = str.replace( m[i], "<span class='mana-icon icon-" + m[i].replace("{", "").replace("}", "").replace("/", "") + "'>" + m[i].replace("{", "").replace("}", "").replace("/", "") + "</span>");
  }
  console.log(str);
  return str;
}

function colorHEX(colorId) {
  console.log(colorId,colorId.length);
  if (colorId.length === 1){
    for (var m = 0; m < landColor.length; m++) {
      console.log(landColor[m][0]);
      if (landColor[m][2] === colorId) {
        var cardColor = landColor[m][1];
      }
    }
  }else{
    var cardColor = colorId;
  }
  console.log(cardColor);
  if (cardColor === "White") {
    cardColor = "Yellow";
  }
  var percent = 50;
  var p = document.getElementById("cards");
  var newElement = document.createElement("div");
  newElement.setAttribute("id", "tempId");
  p.appendChild(newElement);
  newElement.style.color = cardColor;
  var cardRGB = window.getComputedStyle(newElement).color;
  console.log(cardRGB);
  var arrayRGB = cardRGB .replace("rgb(", "") .replace(")", "") .split(",");
  console.log(arrayRGB);
  //cardRGB = "rgb(" + Math.floor(arrayRGB[0]*0.5) + "," + Math.floor(arrayRGB[1]*0.5) + "," + Math.floor(arrayRGB[2]*0.5) + ")"
  console.log(arrayRGB[0]);
  console.log(arrayRGB[1]);
  console.log(arrayRGB[2]);
  var cardHEX =
    "#" +
    (0 | ((1 << 8) + arrayRGB[0] * 1 + (256 - arrayRGB[0] * 1) * percent / 100)).toString(16) .substr(1) +
    (0 | ((1 << 8) + arrayRGB[1] * 1 + (256 - arrayRGB[1] * 1) * percent / 100)).toString(16) .substr(1) +
    (0 | ((1 << 8) + arrayRGB[2] * 1 + (256 - arrayRGB[2] * 1) * percent / 100)).toString(16) .substr(1);
  console.log(cardHEX);
  var element = document.getElementById("tempId");
  element.parentNode.removeChild(element);
  return cardHEX;
}

function createSideboardToken(col, row){
  var cardId = "card_" + col + "_" + row;
  var div = "<div></div>";
  var cardDiv = $(div).addClass("card").attr("id", cardId);
  var sideboardList = "<strong>SIDEBOARD LIST</strong>:<br><br>" + sideboardListShow;
  $(idParent).append(cardDiv.append(sideboardList));
  modifyCss.call($("#" + cardId), "sidedeck", col, row, "#fff", mainCardWidth, mainCardHeight);
}

function newPage(cardsCount){
  console.log("cardsCount",cardsCount);
  if ((cardsCount) % 9 == 0) {
    console.log("new page");
    //page break;
    page++;
    idParent = "#page_" + page;
    $("#cards").append("<div class='pagebreak' id='" + "page_" + page + "'></div>");
  }
}

function removeDuplicate(arr){
  let unique_array = arr.filter(function(elem, index, self) {
      return index == self.indexOf(elem);
  });
  return unique_array
}

function showImgs(){
  var checkBox = document.getElementById("img-cb");
  if (checkBox.checked == true){
    document.documentElement.style.setProperty("--img-display", "block");
  } else {
    document.documentElement.style.setProperty("--img-display", "none");
  }
}
