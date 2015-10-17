'use strict';
var getPosts = function (data) {
    var fieldsObject = [];
    for (var i = 0; i < data.feed.entry.length; i++) {
        var row = data.feed.entry[i];
        var rowObject = {
            Title: row.gsx$title.$t,
            Subtitle: row.gsx$subtitle.$t,
            Image: row.gsx$image.$t,
            Category: row.gsx$category.$t
        };
        rowObject['Post Id'] = row.gsx$postid.$t;
        rowObject['Image Id'] = row.gsx$imageid.$t;
        rowObject['Last Updated'] = row.gsx$lastupdated.$t;
        fieldsObject.push(rowObject);
    }
    return fieldsObject;
};
module.exports = getPosts;