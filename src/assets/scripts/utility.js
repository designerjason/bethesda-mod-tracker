const $ = require("jquery");

'use strict'

/* format a string into json object */
export function str2json(str, notevil) {
    try {

        if(!notevil) {
            return (new Function("", "var json = " + str + "; return JSON.parse(JSON.stringify(json));"))();
        }

        return JSON.parse(str
            .replace(/([\$\w]+)\s*:/g, function (_, $1) {
                return '"' + $1 + '":';
            })
            .replace(/'([^']+)'/g, function (_, $1) {
                return '"' + $1 + '"';
            })
        );

    } catch (e) {
        return false;
    }
}


/* tabbed nav functionality */
export function tabNav() {
    $('#main-search').show();
    $('#main-mymods').hide();
    $('[data-switcher]').on('click', 'a', (e) => {
        e.preventDefault();
        $('.nav-main a').removeClass('active');
        $(e.currentTarget).addClass('active');
        //this.listModsFilter();

        $('.main-tab').hide();
        $(e.currentTarget.hash).show();
    })
}