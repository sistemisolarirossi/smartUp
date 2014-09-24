angular.module('gettext').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('de', {"hello":"hallo"});
    gettextCatalog.setStrings('es', {"hello":"hola"});
    gettextCatalog.setStrings('fr', {"hello":"bonjour"});
    gettextCatalog.setStrings('it', {"<em>smartUp</em> is a web application for (smart) start-ups.<br>\n      It allows the management of customers, orders and invoices.<br>\n      It is fast, small, modern and mobile.<br>":"<em>smartUp</em> è un'applicazione web per (smart) start-ups.<br>\n       Consente la gestione di clienti, ordini e fatture.<br>\n       E' veloce, compatto, moderno e mobile.<br>","hello":"Ciao"});
    gettextCatalog.setStrings('it', {"<em>smartUp</em> is a web application for (smart) start-ups.<br>\n      It allows the management of customers, orders and invoices.<br>\n      It is fast, small, modern and mobile.<br>":"<em>smartUp</em> è un'applicazione web per (smart) start-ups.<br>\n       Consente la gestione di clienti, ordini e fatture.<br>\n       E' veloce, compatto, moderno e mobile.<br>"});
/* jshint +W100 */
}]);