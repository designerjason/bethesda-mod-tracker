const $ = require("jquery");
const utils = require("./utility");
const search = require("./modsearch");
const Profile = require("./profile");
const Mod = require("./mod");
const localforage = require("localforage");

'use strict';

class ModOrganiser {
    constructor(profile, mod) {
        this.profile = new Profile();
        this.mod = new Mod();
    }

    Init() {
        // events triggered on load
        utils.tabNav();
        this.profile.list();
        this.mod.list();
        this.mod.listFilter();

        // do search on submit
        $(document).on('submit', '#mod-search', function(e) {
            const searchOptions = {
                searchText : $('input', this).val(),
                platform : $('#selectPlatform', this).val(),
                game : $('#selectGame', this).val()
            }
            search.modSearch(searchOptions);
            e.preventDefault();
        });

        // mod events
        $('#filterPlatform, #filterGame').on('change', () => this.mod.listFilter());
        $(document).on('click', '[data-addmod]', e => this.mod.add(e));
        $(document).on('click', '[data-removemod]', e => this.mod.remove(e));
        
        // profile events
        $(document).on('submit', '#form-addprofile', e => this.profile.add(e));
        $(document).on('click', '.removeprofile', e => this.profile.remove(e));
        $('#addtoprofile').on('submit', e => this.profile.save(e));
        $('#addtoprofile').on('change', 'select', () => this.profile.view());

        $(document).on('click', '.addprofile', function(e) {
            e.preventDefault();
            $('#form-addprofile').toggle();
        });
    }
}

const clsModOrganiser = new ModOrganiser();
clsModOrganiser.Init();
