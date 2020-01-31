# WeatherForecast_Angular_And_Node
Reference Solution Video Desktop: https://www.youtube.com/watch?v=FVUoo_WO_Ho. \
Reference Solution Video Mobile: https://www.youtube.com/watch?v=1LnX7_5y-ds&t=2s.

# Overview
This responsive application allows users to search for weather information based on the current location or any other location entered by the user. The results will be displayed in Currently, Hourly and Weekly tabs which on clicking, provides a detailed description for that particular Tab. The detailed description provides interactive UI along with charts via Charts.js and Canvas.js. The application also allows to post on Twitter the current weather updates. Another important feature of the application was to add and remove cities to/from Favorites.

# Technolgies Used
Node.js, Express, Angular 7, Bootstrap, AJAX, JSON, HTML5, APIs, Amazon Web Services.

# APIs Used
Google Geocoding API, Forecast.io DarkSky API, IP API, Places AutoComplete API, Twitter API, Google Custom Search API

# Features
1. Autocomplete is implemented using Places AutoComplete API: https://developers.google.com/places/web-service/autocomplete?utm_source=google&utm_medium=cpc&utm_campaign=FY18-Q2-global-demandgen-paidsearchonnetworkhouseads-cs-maps_contactsal_saf&utm_content=text-ad-none-none-DEV_c-CRE_315916117409-ADGP_Hybrid+%7C+AW+SEM+%7C+SKWS+~+Place+Autocomplete-KWID_43700039136946060-kwd-446714566780-userloc_9073456&utm_term=KW_place%20autocomplete-ST_place+autocomplete&gclid=Cj0KCQiAvc_xBRCYARIsAC5QT9lfUjsD77VsMewlLwhJKJf-aLd_RpgQJ07Rjqv2wqw_kokaur3vuTEaAhKnEALw_wcB and Angular Material.
2. Real time validations are performed using two way data binding in Angular.
3. Users can search weather for current location which is caught using IP API.
4. In case the user want to share the weather they can do this using Twitter button which calls Twitter API and shares the weather details with a custom message, which users can write before sharing.
5. State Seal Images are obtained using custom Google Custom Search.
6. Bootstrap is used to make the website responsive and mobile friendly. 
7. Custom pipes are used in Angular to truncate sentences when long.
8. There are lot of animations like loading, adding and removing from favorites which were taken care of.
9. Error Handling for Edge Cases has been implmeneted (No city in favorite, same city in favorite etc).
10. Interactive Graphs and Charts are implemented using Charts.js and Canvas.js.
11. Modal Dialog Box added to provide detailed information in Weekly tab using Bootstrap.
12. Users can store favorite cities which are accessible at all times even after the website is closed. This is done using LocalStorage. They can append, delete from Favorites.
