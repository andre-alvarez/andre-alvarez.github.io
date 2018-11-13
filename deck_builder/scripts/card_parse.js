var col_cnt = 0;
var row_cnt = 0;
var txt_size = 20;
var card_width = 500; //px
var card_height = card_width * 1.4; //px
var h_margin = 10; //px
var rect_rad = 10;
var name_type_dist = 200;
var v_margin = txt_size/2 + rect_rad;
var main_rect_y = v_margin/2 + rect_rad
var name_rect_y = h_margin;
var name_rect_height = txt_size + h_margin*2;
var type_rect_y = name_rect_y + name_type_dist; 
var type_rect_height = name_rect_height;
var text_y = type_rect_y + type_rect_height + v_margin;
var pt_height = txt_size + v_margin;
var pt_rect_y = card_height - v_margin - pt_height;
var pt_y = pt_rect_y + (pt_height)/2;
var arrayCards = [];
var tmpArrays = [];
var pdf;

console.log(window.location.search);
var user_input_data = window.location.search; 
user_input_data = user_input_data.split("&");
  console.log(window.location.search);
var deckName = user_input_data[0].replace("?deck-name=","");
deckName = deckName.replace("+"," ");
var deckList = user_input_data[1].replace("deck-list=","");
deckList = deckList.split("%0D%0A").join("<br>");
var deckListShow = deckList.split("%2F").join("/").split("%27").join("'").split("%2C").join(",").split("+").join(" ");
console.log(deckName);
console.log(deckList);
document.getElementById("deck-name").innerHTML = deckName;
document.getElementById("deck-list").innerHTML = deckListShow;
deckList = deckList.split("<br>");

for (var j=0; j<deckList.length; j++){
  console.log(deckList[j])
  var jCard = deckList[j].replace("+"," ").split(" ");
  console.log(jCard[0]);
  console.log(jCard[0]*2);
  console.log(jCard[1]);
  tmpArrays = new Array(jCard[0]*1);
  for (var w=0; w<jCard[0]*1; w++){
    tmpArrays[w] = jCard[1].split("%2F").join("/").split("%27").join("'").split("%2C").join(",").split("+").join(" ");
    console.log(tmpArrays);
  }
  arrayCards = arrayCards.concat(tmpArrays);
  console.log(arrayCards);
  console.log(arrayCards.length);
}

function setup() {
  console.log(Math.ceil(arrayCards.length/3));
  createCanvas(card_width*3+1, card_height*(Math.ceil(arrayCards.length/3))+1,P2D);
  noStroke();
  textSize(txt_size);
  loadJSON("cards.json", drawData);
  pdf = createPDF();
  pdf.beginRecord();
}

function drawData(data) {
  console.log(data);
  var card = arrayCards; //["Commit / Memory","Adorable Kitten","Assure / Assemble","Mountain","Lightning Strike","Adorable Kitten","Assure / Assemble","Mountain","Lightning Strike"]
  var pt_width = textWidth('00 / 00') + h_margin;
  var pt_rect_x = card_width - (pt_width + h_margin);
  var pt_x = pt_rect_x + (pt_width)/2;
  var col = col_cnt;
  var row = row_cnt;
  for(var i=0; i<card.length; i++) {
    console.log(card[i]);
    strokeWeight(1);
    stroke(51);
    fill("white");
    console.log(col*card_width + " ; " + row*card_height);
    rect(col*card_width, row*card_height, card_width, card_height);
    if (card[i].includes(" / ")) {
      rect(col*card_width + h_margin/2 + rect_rad , row*card_height + main_rect_y, card_width - h_margin - 2*rect_rad, card_height/2 - rect_rad - v_margin, rect_rad);
      rect(col*card_width + h_margin/2 + rect_rad , row*card_height + main_rect_y + (card_height - v_margin)/2, card_width - h_margin - 2*rect_rad, card_height/2 - rect_rad - v_margin, rect_rad);
      var card_split = card[i].split(" / ")
      if (data[card_split[0]].layout === "split"){
        fill(colorHEX(data[card_split[0]].colors[0]));
        rect(col*card_width + card_width - h_margin - name_rect_height, row*card_height + name_rect_y, name_rect_height, (card_height - v_margin)/2, rect_rad);
        rect(col*card_width + card_width - type_rect_y, row*card_height + name_rect_y, name_rect_height, (card_height - v_margin)/2, rect_rad);
        fill(colorHEX(data[card_split[1]].colors[0]));
        rect(col*card_width + card_width - h_margin - name_rect_height, row*card_height + name_rect_y + (card_height - v_margin)/2, name_rect_height, (card_height - v_margin)/2, rect_rad);
        rect(col*card_width + card_width - type_rect_y, row*card_height + name_rect_y + (card_height - v_margin)/2, name_rect_height, (card_height - v_margin)/2, rect_rad);
        strokeWeight(0);
        stroke(0);
        fill("black");
        rotate(HALF_PI);
        textAlign(LEFT, CENTER);
        text(data[card_split[0]].name, row*card_height + v_margin, -col*card_width - card_width + h_margin + name_rect_height/2);
        text(data[card_split[0]].manaCost, row*card_height + (card_height - v_margin)/2 - textWidth(data[card_split[0]].manaCost), -col*card_width - card_width + h_margin + name_rect_height/2); 
        text(data[card_split[0]].type, row*card_height + v_margin, -col*card_width - card_width - name_rect_height/2 + type_rect_y);
        text(data[card_split[1]].name, row*card_height + v_margin + (card_height - v_margin)/2, -col*card_width - card_width + h_margin + name_rect_height/2);
        text(data[card_split[1]].manaCost, row*card_height + (card_height - v_margin) - textWidth(data[card_split[1]].manaCost), -col*card_width - card_width + h_margin + name_rect_height/2); 
        text(data[card_split[1]].type, row*card_height + v_margin + (card_height - v_margin)/2, -col*card_width - card_width - name_rect_height/2 + type_rect_y);
        textAlign(LEFT, CENTER);
        text(data[card_split[0]].text, row*card_height + v_margin + h_margin,  -col*card_width - card_width - name_rect_height + text_y, card_height/2 - (v_margin + h_margin)*2);
        text(data[card_split[1]].text, row*card_height + v_margin + h_margin  + (card_height - v_margin)/2,  -col*card_width - card_width - name_rect_height + text_y, card_height/2 - (v_margin + h_margin)*2);
        rotate(-HALF_PI);
      } else if (data[card_split[0]].layout === "aftermath"){
        fill(colorHEX(data[card_split[0]].colors[0]));
        rect(col*card_width + h_margin/2, row*card_height + name_rect_y, card_width - h_margin, name_rect_height, rect_rad);
        rect(col*card_width + h_margin/2, row*card_height + type_rect_y/2, card_width - h_margin, type_rect_height, rect_rad);
        fill(colorHEX(data[card_split[1]].colors[0]));
        rect(col*card_width + card_width - h_margin - name_rect_height, row*card_height + name_rect_y + (card_height - v_margin)/2, name_rect_height, (card_height - v_margin)/2, rect_rad);
        rect(col*card_width + card_width - type_rect_y, row*card_height + name_rect_y + (card_height - v_margin)/2, name_rect_height, (card_height - v_margin)/2, rect_rad);
        strokeWeight(0);
        stroke(0);
        fill("black");
        textAlign(LEFT, CENTER);
        text(data[card_split[0]].name, col*card_width + h_margin/2 + rect_rad, row*card_height + name_rect_y + name_rect_height/2);
        text(data[card_split[0]].manaCost, col*card_width + card_width - h_margin - textWidth(data[card_split[0]].manaCost), row*card_height + name_rect_y + name_rect_height/2); 
        text(data[card_split[0]].type, col*card_width + h_margin/2 + rect_rad, row*card_height + type_rect_y/2 + type_rect_height/2); 
        textAlign(LEFT, CENTER);
        text(data[card_split[0]].text, col*card_width + h_margin*2, row*card_height + text_y - type_rect_y/2, card_width - h_margin*2 - rect_rad);
        rotate(HALF_PI);
        textAlign(LEFT, CENTER);
        text(data[card_split[1]].name, row*card_height + v_margin + (card_height - v_margin)/2, -col*card_width - card_width + h_margin + name_rect_height/2);
        text(data[card_split[1]].manaCost, row*card_height + (card_height - v_margin) - textWidth(data[card_split[1]].manaCost), -col*card_width - card_width + h_margin + name_rect_height/2); 
        text(data[card_split[1]].type, row*card_height + v_margin + (card_height - v_margin)/2, -col*card_width - card_width - name_rect_height/2 + type_rect_y);
        textAlign(LEFT, CENTER);
        text(data[card_split[1]].text, row*card_height + v_margin + h_margin  + (card_height - v_margin)/2,  -col*card_width - card_width - name_rect_height + text_y, card_height/2 - (v_margin + h_margin)*2);
        rotate(-HALF_PI);
      }
    } else {
    console.log("not slipt card");
      rect(col*card_width + h_margin/2 + rect_rad , row*card_height + main_rect_y, card_width - h_margin - 2*rect_rad, card_height - main_rect_y - v_margin,rect_rad);
      if (data[card[i]].layout === "normal") {
        console.log("normal: " + data[card[i]].types);
        if (data[card[i]].types.includes("Creature")) {
          fill(colorHEX(data[card[i]].colors[0]));
          rect(col*card_width + h_margin/2, row*card_height + name_rect_y, card_width - h_margin, name_rect_height, rect_rad);
          rect(col*card_width + h_margin/2, row*card_height + type_rect_y, card_width - h_margin, type_rect_height, rect_rad);
          fill("white");
          rect(col*card_width + pt_rect_x, row*card_height + pt_rect_y + rect_rad, pt_width, pt_height, rect_rad);
          strokeWeight(0);
          stroke(0);
          fill("black");
          textAlign(LEFT, CENTER);
          text(data[card[i]].name, col*card_width + h_margin/2 + rect_rad, row*card_height + name_rect_y + name_rect_height/2); 
          text(data[card[i]].manaCost, col*card_width + card_width - h_margin - textWidth(data[card[i]].manaCost), row*card_height + name_rect_y + name_rect_height/2);
          text(data[card[i]].type, col*card_width + h_margin/2 + rect_rad, row*card_height + type_rect_y + type_rect_height/2); 
          textAlign(LEFT, CENTER);
          text(data[card[i]].text, col*card_width + h_margin*2, row*card_height + text_y, card_width - h_margin*2 - rect_rad); 
          textAlign(CENTER, TOP);
          text(data[card[i]].power + " / " + data[card[i]].toughness, col*card_width + pt_x , row*card_height + pt_y);
        } else if (data[card[i]].types == "Land") {
          console.log("land");
          rect(col*card_width + h_margin/2, row*card_height + name_rect_y, card_width - h_margin, name_rect_height, rect_rad);
          rect(col*card_width + h_margin/2, row*card_height + type_rect_y, card_width - h_margin, type_rect_height, rect_rad);
          strokeWeight(0);
          stroke(0);
          fill("black");
          textAlign(LEFT, CENTER);
          text(data[card[i]].name, col*card_width + h_margin/2 + rect_rad, row*card_height + name_rect_y + name_rect_height/2); 
          text(data[card[i]].type, col*card_width + h_margin/2 + rect_rad, row*card_height + type_rect_y + type_rect_height/2);
        } else if (data[card[i]].types == "Instant" || "Sorcery" || "Enchantment") {
          fill(colorHEX(data[card[i]].colors[0]));
          rect(col*card_width + h_margin/2, row*card_height + name_rect_y, card_width - h_margin, name_rect_height, rect_rad);
          rect(col*card_width + h_margin/2, row*card_height + type_rect_y, card_width - h_margin, type_rect_height, rect_rad);
          strokeWeight(0);
          stroke(0);
          fill("black");
          textAlign(LEFT, CENTER);
          text(data[card[i]].name, col*card_width + h_margin/2 + rect_rad, row*card_height + name_rect_y + name_rect_height/2);
          text(data[card[i]].manaCost, col*card_width + card_width - h_margin - textWidth(data[card[i]].manaCost), row*card_height + name_rect_y + name_rect_height/2); 
          text(data[card[i]].type, col*card_width + h_margin/2 + rect_rad, row*card_height + type_rect_y + type_rect_height/2); 
          textAlign(LEFT, CENTER);
          text(data[card[i]].text, col*card_width + h_margin*2, row*card_height + text_y, card_width - h_margin*2 - rect_rad);
        }
      }
    }
    col++;
    console.log(col + " ; " + row);
    if (col == 3){
      col = 0;
      row++;
    }
    console.log(col + " ; " + row);
       
    if (i == card.length-1) {
      noLoop();
      pdf.save({
      filename: deckName,
        width: card_width * 3,
        height: card_height * 3
      });
    } else if(i % 9 == 0){
      pdf.nextPage();  
    }
  }
  function colorHEX(cardColor) {
    console.log(cardColor);
    if (cardColor === "White"){
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
    var arrayRGB = cardRGB.replace("rgb(","").replace(")","").split(",");
    console.log(arrayRGB);
    //cardRGB = "rgb(" + Math.floor(arrayRGB[0]*0.5) + "," + Math.floor(arrayRGB[1]*0.5) + "," + Math.floor(arrayRGB[2]*0.5) + ")"
    console.log(arrayRGB[0]);
    console.log(arrayRGB[1]);
    console.log(arrayRGB[2]);
    var cardHEX =  '#' +
       ((0|(1<<8) + arrayRGB[0]*1 + (256 - arrayRGB[0]*1) * percent / 100).toString(16)).substr(1) +
       ((0|(1<<8) + arrayRGB[1]*1 + (256 - arrayRGB[1]*1) * percent / 100).toString(16)).substr(1) +
       ((0|(1<<8) + arrayRGB[2]*1 + (256 - arrayRGB[2]*1) * percent / 100).toString(16)).substr(1);
    console.log(cardHEX);
    //var cardRGBalpha = cardRGB.replace("rgb","rgba").replace(")",", 0.5)");
    //console.log(cardRGBalpha);
    var element = document.getElementById("tempId");
    element.parentNode.removeChild(element);
    return cardHEX;
  }
}
