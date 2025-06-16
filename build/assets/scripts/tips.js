const Stations = [
  // Switzerland
  'Zermatt Bus Terminal',
  'Interlaken Ost Bus Station',
  'Grindelwald Bus Terminal',
  'Lauterbrunnen Bahnhof',
  'Lucerne Bahnhofquai',
  'Chamonix-Mont-Blanc Sud (France, near Swiss border)',
  'Geneva Bus Station',
  'Bern PostAuto Terminal',
  'Gstaad Bus Station',
  'St. Moritz Bahnhof PostAuto',
  'Verbier Village',
  'Davos Platz Postautohaltestelle',
  'Andermatt Gotthardpass',
  'Täsch Bahnhof (Shuttle to Zermatt)',
  'Flims Dorf Post',

  // France
  'Chamonix Sud Bus Station',
  'Annecy Gare Routière',
  'Grenoble Gare Routière',
  'Nice Airport (Bus to Alps)',
  'Bourg-Saint-Maurice Gare Routière',
  'Morzine Gare Routière',
  'Les Gets Gare Routière',
  "Val d'Isère Centre",
  'Courchevel 1850',
  'Megève Place du Village',

  // Italy
  'Aosta Autostazione',
  'Bolzano Autostazione',
  'Trento Autostazione',
  "Cortina d'Ampezzo Autostazione",
  'Bormio Bus Station',
  'Livigno Centro',
  'Merano Autostazione',
  'Sestriere Bus Stop',
  'Ortisei (St. Ulrich) Autostazione',
  'Canazei Piazza Marconi',

  // Austria
  'Innsbruck Hauptbahnhof Bus Terminal',
  'Salzburg Süd Busbahnhof',
  'Mayrhofen Bahnhof',
  'Lech am Arlberg Postamt',
  'Kitzbühel Hahnenkammbahn',
  'Ischgl Seilbahn',
  'Zell am See Postplatz',
  'Bad Gastein Bahnhof',
  'St. Anton am Arlberg Bahnhof',
  'Sölden Postamt',

  // Germany
  'Garmisch-Partenkirchen Bahnhof (Bus Station)',
  'Berchtesgaden Busbahnhof',
  'Oberstdorf Busbahnhof',
  'Füssen Bahnhof (Bus Station)',
  'Mittenwald Bahnhof (Bus Station)',

  // Slovenia
  'Bled Bus Station',
  'Bohinj Jezero',
  'Kranjska Gora Avtobusna Postaja',
];

function inputTips(type) {
  const stationsList = [...Stations];

  const input = document.querySelector(`#${type}`);
  const wrapper = document.querySelector(`.js-${type}-tips`);
  const list = document.querySelector(`.js-${type}-list`);

  function detectMouseOut(e) {
    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    if (elements.indexOf(input) < 0 && elements.indexOf(wrapper) < 0) {
      wrapper.classList.remove('active');
      document.removeEventListener('mousemove', detectMouseOut);
    }
  }

  input.addEventListener('click', () => {
    wrapper.classList.toggle('active');
    document.addEventListener('mousemove', detectMouseOut);
  });
  input.addEventListener('change', () => {
    wrapper.classList.remove('active');
  });
  input.addEventListener('input', (e) => {
    populateList(
      list,
      stationsList.filter((item) => item.toLowerCase().startsWith(e.currentTarget.value.toLowerCase())),
    );
  });

  // набиваем списки
  populateList(list, stationsList);

  list.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'li') {
      input.value = e.target.textContent;
      input.focus();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  inputTips('departure');
  inputTips('arrival');
});

function populateList(list, array) {
  const html = array.map((station) => `<li class="tips__list-item">${station}</li>`).join('');
  list.innerHTML = html;
}
