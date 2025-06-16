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

document.addEventListener('DOMContentLoaded', () => {
  const departureList = [...Stations];
  const arrivalList = [...Stations];

  const departureInput = document.querySelector('#departure');
  const departureTipsWrapper = document.querySelector('.js-departure-tips');
  const departureTipsList = document.querySelector('.js-departure-list');

  const arrivalInput = document.querySelector('#arrival');
  const arrivalTipsWrapper = document.querySelector('.js-arrival-tips');
  const arrivalTipsList = document.querySelector('.js-arrival-list');

  departureInput.addEventListener('click', () => {
    departureTipsWrapper.classList.toggle('active');
  });
  departureInput.addEventListener('change', () => {
    departureTipsWrapper.classList.remove('active');
  });
  arrivalInput.addEventListener('click', () => {
    arrivalTipsWrapper.classList.add('active');
  });
  arrivalInput.addEventListener('change', () => {
    arrivalTipsWrapper.classList.remove('active');
  });

  // набиваем списки
  populateList(departureTipsList, departureList);
  populateList(arrivalTipsList, arrivalList);

  departureTipsList.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'li') {
      departureInput.value = e.target.textContent;
      departureInput.focus();
    }
  });
});

function populateList(list, array) {
  const html = array.map((station) => `<li class="tips__list-item">${station}</li>`).join('');
  list.innerHTML = html;
}
