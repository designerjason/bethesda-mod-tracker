const $ = require("jquery");
const localforage = require("localforage");

'use strict';

class ProfileManager {

    constructor(localprofiles) {
        this.localprofiles = localforage.createInstance({name: "profiles"});
    }

    
    /* add a new profile */
    add(target) {
        target.preventDefault();
        const profileName = target.currentTarget[0].value;
        const timestamp = Math.round((new Date()).getTime() / 1000);

        // if we don't have a profile name...
        if(!profileName) {
            console.log('need a profile name');
            return;
        }

        // create profile entry
        this.localprofiles.setItem('profile-' + timestamp, { "name": profileName, "mods": [] })
        .then(() => {
            $('#form-addprofile')[0].reset();
            $('#form-addprofile').toggle();
            this.list();
            console.log('profile added');
        }).catch(err => console.log('addprofile error: ' + err));
    }


    /* remove an existing profile */
    remove(target) {
        target.preventDefault();
        const selectedProfile = $('#addtoprofile').find('select option:selected').val();

        // remove profile entry
        this.localprofiles.removeItem(selectedProfile)
        .then(() => {
            console.log('profile deleted');
            this.list();
        }).catch(err => console.log('removeprofile error: ' + err));
    }


    /* view a selected profile */
    view() {
        const selectedVal = $('#addtoprofile').find('option:selected').val();

        if (selectedVal) {
            this.localprofiles.getItem(selectedVal)
            .then(function (value) {
                const modsActive = value.mods;

                // get status of each checked mod
                $('.mod-toggle').each(function () {
                    $(this).prop("checked", false);
                    if (modsActive.indexOf($(this).data('id')) !== -1) {
                        console.log('view profile id: ' + $(this).data('id'));
                        $(this).prop("checked", true);
                    } 
                });
            }).catch(err => console.log('view profile error: ' + err));
        }
    }


    /* save a new profile */
    save(target) {
        target.preventDefault();
        let modsActive = [];
        const selectedProfile = $(target.currentTarget).find('select option:selected');

        // get status of each checked (active) mod
        $('.mod-toggle').each(function () {
            if ($(this).is(':checked')) {
                modsActive.push($(this).data('id'));
            }
        });

        // save profile to storage, including which mods are enabled (active)
        this.localprofiles.setItem(selectedProfile.val(), { "name": selectedProfile.text(), "mods": modsActive })
        .then(() => {
            console.log('profile updated');
        }).catch(err => console.log('save profile error: ' + err));
    }


    /* generate the available profiles in the profile select dropdown */
    list() {
        const profileSelect = $('#addtoprofile select');
        profileSelect.empty();

        // generate the select option list
        this.localprofiles.iterate((value, key) => { profileSelect.append(`<option value="${key}">${value.name}</option>`) })
        .then(() => {
            profileSelect.prepend(`<option value="" selected disabled>select a profile</option>`);
            console.log('list profiles has completed');
        }).catch(err => console.log('prepend listprofiles error: ' + err));
    }
}

module.exports = ProfileManager;