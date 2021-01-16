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

function addCarouselNav(element) {
  const carouselNav = `
    <div class="carousel-nav">
      <div class="carousel-navicon carousel-left disabled" data-id="${element.id}" data-direction="left">
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left" class="svg-inline--fa fa-chevron-left fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path></svg>
      </div>
      <div class="carousel-navicon carousel-right" data-id="${element.id}" data-direction="right">
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" class="svg-inline--fa fa-chevron-right fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path></svg>
      </div>
    </div>
  `;
  element.innerHTML += carouselNav;
}

function addListeners() {
  document.querySelectorAll('.carousel-navicon').forEach(item => {
    item.addEventListener('click', moveCarousel);
  })
  
}

function moveCarousel(e) {
  const carousel = document.getElementById(e.currentTarget.dataset.id);
  const carouselInner = carousel.childNodes[0];
  const card = carouselInner.firstElementChild;
  
  // calculate amount to move the carousel to see 1 extra card
  let transformAmount = card.offsetWidth + 26; // 26 to compensate for margins  

  // check how far we've transformed in order to not move too far and disable buttons at right time
  if(e.currentTarget.dataset.direction == 'left') {
    e.currentTarget.nextElementSibling.classList.remove('disabled');
    if(Math.abs(transformX(carouselInner)) - transformAmount <= 0) {
      e.currentTarget.classList.add('disabled');
    };
  } else {
    e.currentTarget.previousElementSibling.classList.remove('disabled');
    if(Math.abs(transformX(carouselInner)) + transformAmount >= carouselInner.offsetWidth - window.innerWidth) {
      e.currentTarget.classList.add('disabled');
    };
  }
  
  // if we're going forward/right, we want a negative X transformation
  if(e.currentTarget.dataset.direction == 'right') transformAmount=transformAmount*-1;
  carouselInner.style.transform = `translateX(${transformX(carouselInner) + transformAmount}px)`;
  
}

function transformX(element) {
  // get the amount an element has been transformed on the X-axis
  const style = window.getComputedStyle(element);
  const matrix = new WebKitCSSMatrix(style.transform);
  return matrix.m41;
}

expect(transformX(document.body)).to.be.a('number');

function carousel(containerId) {
  // get carousel container where we want to append our card slides
  const container = document.getElementById(containerId);
  // find the count from data attributes on the element
  const count = container.dataset.count || 6;

  getCardData(0,count).then(data => { 
    expect(data).to.have.lengthOf(count);
    const carouselHMTL = buildCards(data);
    container.innerHTML += `<div class="carousel-inner">${carouselHMTL}</div>`;
    addCarouselNav(container);
    addListeners();
  });
}