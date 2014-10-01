angular.module('gettext').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('de', {"hello":"hallo"});
    gettextCatalog.setStrings('es', {"hello":"hola"});
    gettextCatalog.setStrings('fr', {"hello":"bonjour"});
    gettextCatalog.setStrings('it', {"(hh:mm)":"(hh:mm)","<em>smartUp</em> is a web application for (smart) start-ups.<br>\n      It allows the management of customers, orders and service reports.<br>\n      It is open-source, fast, compact, extensible, resilient, international and mobile.<br>":"<em>smartUp</em> è un'applicazione web per (smart) start-ups.<br>\n       Consente la gestione di clienti, ordini e rapporti di servizio.<br>\n       E' open-source, veloce, compatta, estensibile, resiliente, internazionale e mobile.<br>","A Codice Fiscale or a P.IVA is required":"Un Codice Fiscale o una P.IVA è richiesto","A customer name is required":"Un nome cliente è richiesto","A date of service start is required":"Una data di inizio del servizio è richiesta","A duration must be in the form 'hh' or 'hh:mm', and at least one minute long":"Una durata deve essere nella forma 'hh' oppure 'hh:mm', ed almeno di un minuto","A location of service is required":"Un luogo del servizio è richiesto","A phone number is required":"Un numero di telefono è richiesto","A street address is required":"Un indirizzo stradale è richiesto","A user name is required":"Un nome utente è richiesto","About":"Info","Add new customer":"Aggiungi nuovo cliente","Address":"Indirizzo stradale","An email address is required":"Un indirzzo email è richiesto","An operator is required":"Un operatore è richiesto","An update is available: do you want to load it now?":"E' disponibile un aggiornamento: lo si vuole caricare adesso?","An update is ready":"E' disponibile un aggiornamento","Are you really sure to remove service report":"Sei veramente sicuro di rimuovere il rapporto di servizio","Are you really sure to remove user":"Sei veramente sicuro di rimuovere l'utente","Avatar":"Avatar","Avatar image":"Immagine avatar","Cache is being initialized":"La cache è inizializzata","Cache is in unknown state":"La cache è in uno stato non previsto","Cache is not updated (probably the manifest is unreachable)":"La cache non è aggiornata (probabilmente il manifesto è irraggiungibile)","Cache is not updated because you are offline":"La cache non è aggiornata perché si è offline","Cache is obsolete":"La cache è obsoleta","Cache is up-to-date":"La cache è aggiornata","Cache status is":"Lo stato della cache è","Checking for the presence of an update":"Si controlla la presenza di un aggiornamento","Codice Fiscale / P.IVA":"Codice Fiscale / P.IVA","Codice Fiscale contains invalid character(s)":"Codice Fiscale contiene caratteri non validi","Codice Fiscale control code doesn't match":"Il codice di controllo del Codice Fiscale non corrisponde","Codice Fiscale or P.IVA of the customer":"Codice Fiscale o P.IVA del cliente","Company logo":"Logo aziendale","Connect with Facebook":"Accedi con Facebook","Connect with Google+":"Accedi con Google+","Connect with Twitter":"Accedi con Twitter","Contacts":"Contatti","Current language is":"La lingua attuale è","Customer":"Cliente","Customer Card":"Scheda del cliente","Customer email address":"Indirizzo email del cliente","Customer name":"Nome del cliente","Customer phone number":"Numero di telefono del cliente","Customer street address":"Indirizzo stradale del cliente","Customer's signature":"Firma del cliente","Customers":"Clienti","Date":"Data","Date of service start":"Data di inizio del servizio","Delete customer":"Rimuovi cliente","Delete service report":"Rimuovi il rapporto di servizio","Delete user":"Rimuovi utente","Downloading an update":"Si scarica un aggiornamento","Duration":"Durata","Duration of service":"Durata del servizio","Edit customer":"Modifica il cliente","Edit service report":"Modifica il rapporto di servizio","Edit user":"Modifica l'utente","Email":"Email","Email address":"Indirizzo email","Email address is not valid":"L'indirizzo email non è valido","Fax":"Fax","Filter customers":"Filtra i clienti","Filter service reports":"Filtra i rapporti di servizio","Filter users":"Filtra gli utenti","Home":"Home","Id":"Id","Location":"Luogo","Location of service":"Luogo del servizio","Log in":"Accedi","Log out":"Esci","N":"N","Name":"Nome","New customer":"Nuovo cliente","New report":"Nuovo rapporto","New user":"Nuovo utente","No update is present":"Nessun aggiornamento presente","Notes":"Note","Number":"Numero","Operator":"Operatore","Operator of service":"Operatore del servizio","Operator's signature":"Firma dell'operatore","Orders":"Ordini","P.&nbsp;IVA":"P.&nbsp;IVA","P.IVA":"P.IVA","P.IVA contains invalid character(s)":"P.IVA contiene caratteri non validi","P.IVA control code doesn't match":"Il codice di controllo della P.IVA non corrisponde","Phone":"Telefono","Phone number":"Numero di telefono","Phone number is not valid":"Il numero di telefono non è valido","Place":"Luogo","Preparing the downloading an update":"Si prepara lo scarico di un aggiornamento","Print":"Stampa","Print customer":"Stampa il cliente","Print service report":"Stampa rapporto di servizio","Print user":"Stampa l'utente","Provider":"Fornitore","Register":"Registrati","Roles":"Ruoli","Save":"Salva","Service report":"Rapporto di servizio","Service report n":"Rapporto di servizio  n","Service reports":"Rapporti di servizio","Setup":"Impostazioni","Social connection provider":"Fornitore d'accesso sociale","This customer name is already in use":"Questo nome cliente è già in uso","This customer name is not valid":"Il nome del cliente non è valido","This is <em>{{ appName }}</em> home page for non registered users.<br>\n        Enter using one of your \"social\" accounts, or log in with these credentials: <br>":"Questa è la home page di <em>{{ appName }}</em> per gli utenti non registrati. <br />        Accedere utilizzando un proprio account \"social\", oppure loggarsi con queste credenziali: <br />","This is <em>{{ appName }}</em> home page for registerd users.":"Questa è la home page di <em>{{appName }}</em> per gli utenti registrati.","This user name is already present":"Questo nome utente è già presente","This value is nor a Codice Fiscale nor a P.IVA":"Questo valore non è né un Codice Fiscale né una P.IVA","Time of service start":"Orario di inizio del servizio","Toggle navigation":"Cambia navigazione","User email address":"Indirzzo email","User name":"Nome utente","User name is not valid":"Il nome utente non è valido","Username":"Nome utente","Users":"Utenti","You are offline":"Si è offline","You are online":"Si è online","cancel":"annulla","logged user":"utente connesso","otherwise register a new accout and log in.":"altrimenti registrare un nuovo account ed accedere.","password:":"password:","username:":"utente:","Service report n&#176;":"Rapporto di servizio  n&#176;","Customer name must be valid":"Il nome del cliente deve essere valido","Not yet available...":"Non ancora disponibile...","N&deg;":"N&deg;","Date of service begin":"Data di inizio del servizio"});
/* jshint +W100 */
}]);