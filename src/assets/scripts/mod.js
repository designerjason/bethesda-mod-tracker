const $ = require("jquery");
const localforage = require("localforage");
const utils = require("./utility");
const search = require("./modsearch");
const Profile = require("./profile");

'use strict';

class Mod {
    constructor(profile) {
        this.profile = new Profile();
    }

    /* add a mod */
    add(target) {
        target.preventDefault();
        $(target.currentTarget).removeAttr('data-addmod').text('Mod Owned').attr('disabled', true);

        localforage.setItem($(target.currentTarget).data('id'), decodeURIComponent($(target.currentTarget).data('modinfo')))
        .then(() => {
            this.list();
            this.profile.list(this.profile.localprofiles);
        }).catch(err => console.log('add mod error: ' + err));
    }


    /* remove a mod */
    remove(target) {
        localforage.removeItem($(target.currentTarget).data('id'))
        .then(() => {
            this.list();
            this.listFilter();

            // we need the mods filter to finish first
            window.setTimeout(() => {
                this.profile.view(this.profile.localprofiles)
            }, 200);
        }).catch(err => console.log('remove mod error: ' + err));
    }


    /* list stored mods in localforage via 'my mods' */
    list() {
        const modList = $('#main-mymods-list');
        modList.empty();
        $('.select-profile-mods').empty();

        localforage.iterate((value) => {
            const jsonData = utils.str2json(value);
            modList.append(`
                <div class="mod-item ${jsonData.product} ${jsonData.platform}">
                <input type="checkbox" class="mod-toggle" data-product="${jsonData.product}" data-platform="${jsonData.platform}" data-id="${jsonData.id}">
                <a href="${search.modInfoUrl}/${jsonData.product.toLowerCase()}/mod-detail/${jsonData.id}" target="_blank">${jsonData.name}</a>
                <small class="f-text-small">(${jsonData.filesize})</small>
                <button class="btn btn-delete" data-removemod data-id="${jsonData.id}">x</button>
                </div>
            `);})
            
        .then(() => {
            this.listFilter();
            console.log('mods are listed');
        }).catch(err => console.log('listmodsfilter error: ' + err));
    }


    /* filter functionality for the 'my mods' page */
    listFilter() {
        let filterArr = [];
        let filterCls;
        const modItem = $('.mod-item');
        const filterPlatform = $('#filterPlatform input:checked').val();
        const filterGame = $('#filterGame input:checked').val();

        if (filterPlatform) {
            filterArr.push('.' + filterPlatform);
        }

        if (filterGame) {
            filterArr.push('.' + filterGame);
        }

        filterCls = filterArr.join('');
        
        modItem.hide();
        modItem.each(function (i) {
            if ($('.mod-item' + filterCls)[i] != null) {
                $($('.mod-item' + filterCls)[i]).show();
            }
        });
    }
}

module.exports = Mod;