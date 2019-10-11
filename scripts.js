const apiKey = 'u7dKuz7ogJfmbkqNF9IcPeIE9MwYaXy3qRCOUtAM';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

$(watchForm);

function watchForm() {
    $('form').on('submit', event => {
        event.preventDefault();
        $('.search-results').html('');
        $('#error-message').html('');
        let state = $('#state-input').val().toLowerCase();
        let maxResults = $('#max-results').val();

        if (state !== '') {
            getParkList(state, maxResults);
        } else {
            alert('please enter a valid state');
        }
    })
}

function formatParams(params) {
    const query = Object.keys(params).map(
      key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    );
    return query.join('&');
  }

function getParkList(state, maxResults = 10) {
    const params = {
        api_key: apiKey,
        stateCode: state,
        limit: maxResults,
    };

    const queryString = formatParams(params);
    const url = searchURL + '?' + queryString;

    fetch(url).then(res => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(res.statusText);
        }
    })
        .then(res => displayResults(res))
        .catch(err => {
            $('#error-message').text(`You broke something: ${err.message}`)
        })
}

function displayResults(resJson) {
    console.log(resJson);
    for (let i = 0; i < resJson.data.length; i++) {
      const park = resJson.data[i];
      const description = park.description;
      const name = park.name;
      const url = park.url;
      const address = park.directionsInfo;
  
      $('#results-list').append(
          `
            <li>
                <h3>${name}</h3>
                <p>Description: ${description}</p>
                <p>URL : <a href="${url}">${url}</a></p>
                <p>Address: ${address}</p>
            </li>
          `
          )
          
    }

    $('.results').removeClass('hidden');
}