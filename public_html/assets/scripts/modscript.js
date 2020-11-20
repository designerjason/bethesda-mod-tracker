'use strict';

class ModOrganiser {

  constructor(debugMode) {
    this.debugMode = true;
    this.modSearchUrl = 'https://devlicious.link/modorganiser/moddata.php';
    this.modInfoUrl = 'https://bethesda.net/en/mods';
  }

	Init()
	{

		var localprofiles = localforage.createInstance({
		  name: "profiles"
		});

    this.navInit();
		this.modSearch();
		this.addMod(localprofiles);
    this.removeMod(localprofiles);
		this.addProfile(localprofiles);
		this.saveProfile(localprofiles);
    this.removeProfile(localprofiles);
		this.viewProfile(localprofiles);
		this.listMods();
    this.listModsFilter();
		this.listProfiles(localprofiles);

    $('#addtoprofile').on('change', 'select', (e)=> {
      this.viewProfile(localprofiles);
    });

    $('#filterPlatform, #filterGame').on('change', (e)=> {
      this.listModsFilter();
    });
	}

  navInit() {
    $('#main-search').show();
    $('#main-mymods').hide();
    $('[data-switcher]').on('click', 'a', (e)=> {
      e.preventDefault();
      $('.nav-main a').removeClass('active');
      $(e.currentTarget).addClass('active');
      this.listModsFilter();
      if(this.debugMode) {
        console.log('current nav: '+e.currentTarget.hash);
      }
      $('.main-tab').hide();
      $(e.currentTarget.hash).show();
    })
  }

  str2json(str, notevil) {
    try {
      if (notevil) {
        return JSON.parse(str
          .replace(/([\$\w]+)\s*:/g, function(_, $1) {
            return '"' + $1 + '":';
          })
          .replace(/'([^']+)'/g, function(_, $1) {
            return '"' + $1 + '"';
          })
        );
      } else {
        return (new Function("", "var json = " + str + "; return JSON.parse(JSON.stringify(json));"))();
      }
    } catch (e) {
      return false;
    }
  }

	modSearch()
	{
		$(document).on('submit', '#mod-search', function(e) {
			var searchTxt = $('input', this).val();
			var platformVal = $('#selectPlatform', this).val();
			var gameVal = $('#selectGame', this).val();

			$('.search-text').text( searchTxt );
			$('.result-info').removeClass( 'f-hidden' );

			$.ajax({
    		async: false,
    		url: 'https://devlicious.link/modorganiser/moddata.php',
    		dataType: "jsonp",
        jsonp: false,
        jsonpCallback: "modData",
    		data: {
 					//number_results: 50,
    			selectPlatform: platformVal,
    			selectGame: gameVal,
					searchText: searchTxt
  			},
    		type: "GET",

				beforeSend: () => {

					$('.table-results tbody').empty();
					$('.table-results tbody').append(`
						<tr>
							<td>Searching...</td>
						</tr>`
					);
				},

        error: (xhr, ajaxOptions, thrownError) => {
          $('.table-results tbody').empty();
          $('.table-results tbody').append(`
            <tr>
              <td>something went wrong, please try again...</td>
            </tr>`
          );

          console.dir(thrownError);
        },
        success: function(response) {
            console.log('callback success');
        },
	    	complete: (result)=> {
          if(result.responseJSON && result.responseJSON.length) {
            $('.table-results tbody').empty();
            $('.search-meta').show();
            $('.search-results').text(result.responseJSON.length);
            $('.search-term').text( $('#searchText').val() );

            $.each(result.responseJSON, (key, val)=> {

              let itemData = {
                'id' : val.id,
                'name' : val.name,
                'filesize' : val.filesize,
                'thm' : val.thm,
                'product' : val.product,
                'platform' : val.platform
              };

              itemData = escape( JSON.stringify(itemData).replace(/"/g, "\"") );
              var addModBtn;

              localforage.getItem(val.id).then( (value)=> {

                if(value === null) {
                  addModBtn = `<button class="btn btn-small" data-id="${val.id}" data-addmod data-modinfo="${itemData}">Add to My Mods</button>`;
                }else{
                  addModBtn = `<button class="btn btn-small" disabled>Mod Owned</button>`;
                }

                $('.table-results tbody').append(`
                  <tr>
                    <td><img src="${val.thm}" width="50" height="50" alt=""></td>
                    <td><a href="${this.modInfoUrl}/${val['product'].toLowerCase()}/mod-detail/${val.id}" target="_blank">${val.name}</a> <small class="f-text-small">(${val.filesize})</small></td>
                    <td>${addModBtn}</td>
                  </tr>`
                );

              }).catch( (err)=> {
                console.log('modsearch error: '+err);
              });
            });
          } else {
            $('.table-results tbody').empty();
            $('.table-results tbody').append(`
              <tr>
                <td>No results found, please try again...</td>
              </tr>`
            );
          }
	    	}
			});
      e.preventDefault();
		});
	}

	listMods()
	{

		$('#main-mymods-list').empty();
		$('.select-profile-mods').empty();

		localforage.iterate( (value)=> {

			let jsonData = this.str2json(value);

			$('#main-mymods-list').append(`
				<div class="mod-item ${jsonData.product} ${jsonData.platform}">
        <input type="checkbox" class="mod-toggle" data-product="${jsonData.product}" data-platform="${jsonData.platform}" data-id="${jsonData.id}">
          <a href="${this.modInfoUrl}/${jsonData['product'].toLowerCase()}/mod-detail/${jsonData.id}" target="_blank">${jsonData.name}</a> <small class="f-text-small">(${jsonData.filesize})</small><button class="btn btn-delete" data-removemod data-id="${jsonData.id}">x</button>
        </div>`
			);

		}).then( ()=> {
      this.listModsFilter();

      if(this.debugMode) {
		    console.log('mods are listed');
      }
		}).catch( (err)=> {
		    console.log('listmodsfilter error: '+err);
		});
	}

  listModsFilter()
  {

    let filterArr = [];
    let filterCls;
    let filterPlatform = $('#filterPlatform input:checked').val();
    let filterGame = $('#filterGame input:checked').val();

    if(filterPlatform){
      filterArr.push('.'+filterPlatform);
    }

    if(filterGame ){
      filterArr.push('.'+filterGame);
    }

    filterCls = filterArr.join('');

    if(this.debugMode) {
      console.log(filterCls);
    }

    $('.mod-item').hide();
    $('.mod-item').each( function(i, el) {
      if( $('.mod-item'+filterCls)[i] != null ) {
        $($('.mod-item'+filterCls)[i]).show();
      }
    });
  }

	listProfiles(localprofiles)
	{

		localforage.iterate( ()=> {

		}).then( ()=> {

			$('#addtoprofile select').empty();
			localprofiles.iterate( (value, key)=> {

				$('#addtoprofile select').append(`
					<option value="${key}">${value.name}</option>`
				);

			}).then( ()=> {
        $('#addtoprofile select').prepend(`
          <option value="" selected>select a profile</option>`
        );
        if(this.debugMode) {
  			  console.log('list profiles has completed');
        }
			}).catch( (err)=> {
			    console.log('prepend listprofiles error: '+err);
			});


		}).catch( (err)=> {
		  console.log('listprofiles error: '+err);
		});
	}

	addMod(localprofiles)
	{

		$(document).on('click', '[data-addmod]', (e)=> {
			e.preventDefault();
			$(e.currentTarget).removeAttr('data-addmod')
			.text('Mod Owned')
			.attr('disabled', true);

			localforage.setItem( $(e.currentTarget).data('id'), unescape( $(e.currentTarget).data('modinfo') ) ).then( ()=> {
					this.listMods();
					this.listProfiles(localprofiles);
			}).catch( (err)=> {
			    console.log('addmod error: '+err);
			});

		});

	}

  removeMod(localprofiles)
  {
    $(document).on('click', '[data-removemod]', (e)=> {
			localforage.removeItem( $(e.currentTarget).data('id') ).then( ()=> {
					this.listMods();
          this.listModsFilter();

          // we need the mods filter to finish first
          window.setTimeout ( ()=>{
            this.viewProfile(localprofiles)
          }, 100 );

			}).catch( (err)=> {
			    console.log('removemod error: '+err);
			});

		});
  }

	addProfile(localprofiles)
	{

    $(document).on('click', '.addprofile', (e)=> {
      e.preventDefault;
      $('#form-addprofile').toggle();
    });

		$(document).on('submit', '#form-addprofile', (e)=> {
      e.preventDefault();
			let profileName = e.currentTarget[0].value;
			let timestamp = Math.round((new Date()).getTime() / 1000);
			// Unlike localStorage, you can store non-strings.
			localprofiles.setItem( 'profile-'+timestamp, {"name": profileName, "mods":[] } ).then( ()=> {
          $('#form-addprofile')[0].reset();
          $('#form-addprofile').toggle();
          if(this.debugMode) {
          	console.log('profile added');
          }
					this.listProfiles(localprofiles);
			}).catch( (err)=> {
			    // This code runs if there were any errors
			    console.log('addprofile error: '+err);
			});
		});
	}

  removeProfile(localprofiles)
	{
		$(document).on('click', '.removeprofile', (e)=> {
      e.preventDefault();
			var selectedProfile = $('#addtoprofile').find('select option:selected').val();
			// Unlike localStorage, you can store non-strings.
			localprofiles.removeItem( selectedProfile ).then( ()=> {
          if(this.debugMode) {
					  console.log('profile deleted');
          }
					this.listProfiles(localprofiles);
			}).catch( (err)=> {
			    console.log('removeprofile error: '+err);
			});
		});
	}

	saveProfile(localprofiles)
	{
		$('#addtoprofile').on('submit', (e)=> {
			e.preventDefault();
			var modsActive = [];
			var selectedProfile = $(e.currentTarget ).find('select option:selected');

		$('.mod-toggle').each( function() {
			if( $(this).is(':checked') ) {
				modsActive.push( $(this).data('id') );
			}
		});

		localprofiles.setItem( selectedProfile.val(), {"name": selectedProfile.text(), "mods": modsActive } ).then( ()=> {
      if(this.debugMode) {
        console.log('profile updated');
      }
		}).catch( (err)=> {
		    console.log('saveprofile error: '+err);
		});

	});
	}

	viewProfile(localprofiles)
	{
    let selectedVal = $('#addtoprofile').find('option:selected').val();

    if(selectedVal) {
      localprofiles.getItem( selectedVal ).then(function(value) {
          var modsActive = value.mods;

          $('.mod-toggle').each( function() {

            if( modsActive.indexOf( $(this).data('id') ) !== -1 ) {
              if(this.debugMode) {
                console.log('view profile id: '+ $(this).data('id') );
              }
              $(this).prop( "checked", true );
            } else {
              $(this).prop( "checked", false );
            }
          });

      }).catch( (err)=> {
          console.log('viewprofile error: '+err);
      });
    }
	}

}

const clsModOrganiser = new ModOrganiser();
clsModOrganiser.Init();
