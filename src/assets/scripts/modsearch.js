const $ = require("jquery");
const localforage = require("localforage");
const searchUrl = 'https://devlicious.link/modorganiser/moddata.php';
export const modInfoUrl = 'https://bethesda.net/en/mods';

/* mod search functionality, ajax call etc */
export function modSearch({searchText, platform, game}) {
    const resultsEl = $('.table-results tbody');

    $.ajax({
        url: searchUrl,
        type: "GET",
        async: false,
        dataType: "jsonp",
        jsonp: false,
        jsonpCallback: "modData",
        data: {
            selectPlatform: platform,
            selectGame: game,
            searchText: encodeURI(searchText)
        },
        beforeSend: () => {
            resultsEl.empty();
            resultsEl.append(`<tr><td>Searching...</td></tr>`);
        },
        error: (__xhr, __ajaxOptions, thrownError) => {
            resultsEl.empty();
            resultsEl.append(`<tr><td>something went wrong, please try again...</td></tr>`);
            console.dir(thrownError);

        },
        success: () => console.log('callback success'),
        complete: (result) => {
            if(!result.responseJSON && !result.responseJSON.length) {
                resultsEl.empty().append(`<tr><td>No results found, please try again...</td></tr>`);
                return;
            }

            resultsEl.empty();
            $('.search-results').text(result.responseJSON.length);
            $('.search-term').text($('#searchText').val());

            $.each(result.responseJSON, (__key, val) => {
                let addModBtn;
                let itemData = {
                    'id': val.id,
                    'name': val.name,
                    'filesize': val.filesize,
                    'thm': val.thm,
                    'product': val.product,
                    'platform': val.platform
                };

                itemData = encodeURIComponent(JSON.stringify(itemData).replace(/"/g, "\""));
                
                localforage.getItem(val.id)
                .then((value) => {

                    addModBtn = `<button class="btn btn-small" data-id="${val.id}" data-addmod data-modinfo="${itemData}">Add to My Mods</button>`;
                    if(value !== null) {
                        addModBtn = `<button class="btn btn-small" disabled>Mod Owned</button>`;
                    }

                    resultsEl.append(`
                        <tr>
                            <td><img src="${val.thm}" width="50" height="50" alt=""></td>
                            <td>
                                <a href="${modInfoUrl}/${val.product.toLowerCase()}/mod-detail/${val.id}" target="_blank">${val.name}</a> 
                                <small class="f-text-small">(${val.filesize})</small>
                            </td>
                            <td>${addModBtn}</td>
                        </tr>
                    `);
                }).catch(err => console.log('modsearch error: ' + err));
            }); 
        }
    });
}