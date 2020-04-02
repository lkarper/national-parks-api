const apiKey = "fBWrsyL6g7fpylbMqtv5MH8VyINutWOVTlQ8azb0";

const baseURL = "https://developer.nps.gov/api/v1/parks";

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        fetchParks();
    });
}

function fetchParks() {
    const search = $('#state').val();
    const limit = $('#max-results').val();
    const url = `${baseURL}?stateCode=${search}&limit=${limit}&api_key=${apiKey}`;
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.log(response);
                throw new Error(response.statusText);
            }
        })
        .then(responseJson => {
            displayParks(responseJson);
        })
      .catch(error => console.log('error', error));
}

function displayParks(responseJson) {
    const parks = responseJson.data;
    $('#results').removeClass('hidden');
    $('#park-list').empty();
    $('#error-message').text('');
    if (parks.length === 1) {
        $('#num-parks-found').text(`${parks.length} park in ${$('#state option:selected').text()} returned`);
    } else {
        $('#num-parks-found').text(`${parks.length} parks in ${$('#state option:selected').text()} returned`);
    }
    if (parks.length === 0) {
        $('#error-message').text(`Sorry, no results found for "${$('#state').val()}".  Try a different query.`)
    }
    for (let park of parks) {
        const name = park.fullName;
        const description = park.description;
        const url = park.url;
        const address1 = obtainAddress1(park);
        const address2 = obtainAddress2(park);
        const states = park.states.split(",").join(", ");
        $('#park-list').append(
            `<li class="park-info">
                <h3 class="park-name">Name</h3> 
                <p>${name}</p>
                <h3 class="park-description">Description</h3> 
                <p>${description}</p>
                <h3 class="park-states">Found in the following states</h3> 
                <p>${states}</p>
                <a href="${url}" class="park-url">Visit Park Website</a>
                <h3 class="addresses-label">Addresses</h3>
                <div class="addresses">
                    ${address1}
                    ${address2}
                </div>
            </li>`);
    }
}

function obtainAddress1(park) {
    if (park.addresses.length === 0) {
        return "<p>Address not found.</p>"
    }
    let physicalAddressLines = "";
    if (park.addresses[0].line1) {
        physicalAddressLines = `${park.addresses[0].line1}<br>`;
    }
    if (park.addresses[0].line2) {
        physicalAddressLines = 
            `${physicalAddressLines}
            ${park.addresses[0].line2}<br>
            `;
    }
    if (park.addresses[0].line3){
        physicalAddressLines = 
        `${physicalAddressLines}
        ${park.addresses[0].line3}<br>
        `;
    }
    return `<section>
                <h4>${park.addresses[0].type} Address:</h4>
                <address>
                    ${physicalAddressLines}
                    ${park.addresses[0].city}, ${park.addresses[0].stateCode} ${park.addresses[0].postalCode}
                </address>
            </section>`;
}

function obtainAddress2(park) {
    if (park.addresses.length === 0) {
        return "<p>Address not found.</p>"
    }
    let physicalAddressLines = "";
    if (park.addresses[1].line1) {
        physicalAddressLines = `${park.addresses[1].line1}<br>`;
    }
    if (park.addresses[1].line2) {
        physicalAddressLines = 
            `${physicalAddressLines}
            ${park.addresses[1].line2}<br>
            `;
    }
    if (park.addresses[1].line3){
        physicalAddressLines = 
        `${physicalAddressLines}
        ${park.addresses[1].line3}<br>
        `;
    }
    return `<section>
                <h4>${park.addresses[1].type} Address:</h4>
                <address>
                    ${physicalAddressLines}
                    ${park.addresses[1].city}, ${park.addresses[1].stateCode} ${park.addresses[1].postalCode}
                </address>
            </section>`;
}

$(watchForm);