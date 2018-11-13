// const API_URL = '/example.json?domain=';


const API_URL = 'http://apis.is/isnic?domain=';


/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
  let input;
  let results;

  function el(type, text) {
    const el = document.createElement(type);

    if (text) {
      el.appendChild(document.createTextNode(text));
    }
    return el;
  }

  function erase(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  function showMessage(villubod) {
    // setja skilaboð í results hlut í html
    erase(results);
    const error = el('string', villubod);
    results.appendChild(error);
  }


  function showResults(data) {
    erase(results);

    const dataObj = data[0];
    const dlElement = document.createElement('dl');

    if (dataObj) {
      const dateisocs = new Date(data[0].registered);
      dataObj.registered = dateisocs.toISOString().substr(0, 10);

      const dateisopa = new Date(data[0].expires);
      dataObj.expires = dateisopa.toISOString().substr(0, 10);

      const dateisola = new Date(data[0].lastChange);
      dataObj.lastChange = dateisola.toISOString().substr(0, 10);
    }

    const xd = {

      domain: 'Lén',
      registered: 'Skráð',
      lastChange: 'Seinast breytt',
      expires: 'Rennur út',
      registrantname: 'Skráningaraðili',
      email: 'Netfang',
      address: 'Heimilisfang',
      country: 'Land',
      phone: 'Símanúmer',
      city: 'Borg',
      postalCode: 'Póst númer',
    };


    for (const key in dataObj) {
      const dd = el('dd', xd[key]);
      const dt = el('dt', dataObj[key]);
      dlElement.appendChild(dd);
      dlElement.appendChild(dt);
    }

    results.appendChild(dlElement);


    if (!dataObj) {
      showMessage('Lén er ekki skráð');
    }
  }

  function showLoading() {
    const img = el('img');
    img.setAttribute('alt', 'loading gid');
    img.setAttribute('src', 'loading.gif');

    const imageDiv = el('div');
    imageDiv.classList.add('loading');
    imageDiv.appendChild(img);

    imageDiv.appendChild(document.createTextNode('Leita að léni… '));
    results.appendChild(imageDiv);
  }

  function fetchResults(domain) {
    let villubod;
    fetch(`${API_URL}${domain}`)
      .then((data) => {
        console.log(data);
        if (data.status === 431) {
          villubod = 'Lén verður að vera strengur.';
          throw new Error('Non 200 status');
        } else if (!data.ok) {
          villubod = 'Villa við að sækja gögn';
          throw new Error('Non 200 status');
        }
        return data.json();
      })
      .then(data => showResults(data.results))
      .catch((error) => {
        console.error('ERROR', error);
        showMessage(villubod);
      });
  }

  function onSubmit(e) {
    e.preventDefault();

    const domain = input.value;

    fetchResults(domain);
    showLoading();
  }

  function init(domains) {
    const form = domains.querySelector('form');
    input = form.querySelector('input');
    results = domains.querySelector('.results');

    form.addEventListener('submit', onSubmit);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');
  program.init(domains);
});
