this["JST"] = this["JST"] || {};

this["JST"]["public/jst/form.jst.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<form>\n  <p>\n    Nombre de la WiFi<br />\n    <input type="text" name="ssid" size="24" />\n  </p>\n  <p>\n    Contrase&ntilde;a<br />\n    <input type="text" name="password" size="24" />\n  </p>\n</form>\n\n<div id="action">\n  <p>\n    <a href="#" class="submit">A&ntilde;adir lugar</a>\n  </p>\n  <p>\n    <a href="#" class="cancel">Cancelar</a>\n  </p>\n</div>\n';

}
return __p
};

this["JST"]["public/jst/venue.jst.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h3>' +
((__t = ( name )) == null ? '' : __t) +
'</h3>\n\n';
 if (type == "cartodb") { ;
__p += '\n\n  <p>' +
((__t = ( address )) == null ? '' : __t) +
'</p>\n  <p>' +
((__t = ( distance )) == null ? '' : __t) +
'm</p>\n\n';
 } else { ;
__p += '\n\n  <p>' +
((__t = ( location.address )) == null ? '' : __t) +
'</p>\n  <p>' +
((__t = ( location.distance )) == null ? '' : __t) +
'm</p>\n\n';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["public/jst/venues.jst.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<ul></ul>\n<div class="add">\n  <p>\n    &iquest;No aparece en la lista el lugar en el que est&aacute;s?\n  </p>\n  <p>\n    <a href="#">A&ntilde;adir lugar</a>\n  </p>\n</div>\n';

}
return __p
};

this["JST"]["public/jst/wifi.jst.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<dt>' +
((__t = ( ssid )) == null ? '' : __t) +
'</dt>\n<dd>' +
((__t = ( password )) == null ? '' : __t) +
'</dd>\n';

}
return __p
};

this["JST"]["public/jst/wifis.jst.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<ul></ul>\n<p>\n  &iquest;Conoces la nueva WiFi de este lugar?\n</p>\n<p>\n  <a href="#">A&ntilde;adir WiFi</a>\n</p>\n';

}
return __p
};