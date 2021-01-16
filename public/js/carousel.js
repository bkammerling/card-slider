var expect = chai.expect;

async function getCardData(start = 0, end = 20) {
  // get card data from json server with start and end parameters
  let cardData = await fetch(`/cards?_start=${start}&_end=${end}`)
    .then(response => response.json())
    .then(data => {
      return data;
    });
  return cardData;
}

function buildCards(cardArray) {
  let cardsHTML = '';
  cardArray.map(cardData => {
    const cardHTML = buildCard(cardData);
    expect(cardHTML).to.be.a('string');
    cardsHTML += cardHTML;
  })
  return cardsHTML;
}

function buildCard(cardData) {
  expect(cardData).to.have.property('title');
  const cardContent = `
    <div class="card" id="card-${cardData.id}">
      <div class="card-image">
        <img src="${cardData.image_url}" alt="Card header image describing ${cardData.subtitle}" />
      </div>
      <div class="card-body">
        <div class="card-header">
          <img src="images/icon.png" srcset="images/icon@2x.png 2x" alt="gohenry logo consisting of 3 red circles making the shape of go" />
          <div class="card-headertext">
            <h4 class="card-title">${cardData.title}</h4>
            <h5 class="card-subtitle">${cardData.subtitle}</h5>
          </div>
        </div>
        <p class="card-text">${cardData.text}</p>
        <a class="card-cta" href="https://www.gohenry.com/uk/" title="Visit gohenry website">Learn more</a>
      </div>
    </div>
  `;
  return cardContent;
}

function carousel(containerId) {
  // get carousel container where we want to append our card slides
  const container = document.getElementById(containerId);
  // find the count from data attributes on the element
  const count = container.dataset.count || 6;

  getCardData(0,count).then(data => { 
    expect(data).to.have.lengthOf(count);
    const carouselHMTL = buildCards(data);
    container.innerHTML += carouselHMTL;
  });
}