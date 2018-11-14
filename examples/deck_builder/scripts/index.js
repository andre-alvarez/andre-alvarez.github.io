/**
 * index.js
 * - All our useful JS goes here, awesome!
 */

function submit_form (){
  var deckName = document.getElementById("deck-name").value;
  var deckList = document.getElementById("deck-list").value;
  deckList = deckList.replace(/(?:\r\n|\r|\n)/g, ';');
  console.log(deckName);
  console.log(deckList);
  var all = "deck-name="+deckName+"&deck-list="+deckList;
  document.getElementById("deck-data").value = all;
}
