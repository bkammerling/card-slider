async function getCardData(start = 0, end = 12) {
  let cardData = await fetch(`/cards?_start=${start}&_end=${end}`)
    .then(response => response.json())
    .then(data => {
      return data;
    });
  return cardData;
}

getCardData(0,2).then(data => console.log(data));