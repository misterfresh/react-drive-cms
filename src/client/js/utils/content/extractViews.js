'use strict';
var _ = require('lodash');
var extractViews = function (dashboard) {
    var articles = [];
    var categories = [];
    for (var i = 0; i < dashboard.length; i++) {
        var row = dashboard[i];
        var category = {};
        var categoryId = _.result(_.find(categories, 'title', row.Category), 'id');
        var article = {
            id: i,
            title: row.Title,
            subtitle: row.Subtitle,
            imageName: row.Image,
            image: 'https://drive.google.com/uc?export=download&id=' + row['Image Id'],
            category: {
                id: (typeof categoryId !== 'undefined') ? categoryId : categories.length,
                title: row.Category,
                type: 'category'
            },
            type: 'article'
        };
        var copyArticle = JSON.parse(JSON.stringify(article));
        if (typeof categoryId !== 'undefined') {
            category = categories[categoryId];
            category.articles.push(copyArticle);
            categories[categoryId] = category;
        } else {
            category = {
                id: categories.length,
                title: row.Category,
                imageName: row.Image,
                image: 'https://drive.google.com/uc?export=download&id=' + row['Image Id'],
                articles: [copyArticle],
                type: 'category'
            };
            categories[category.id] = category;
        }
        article['driveId'] = row['Post Id'];
        article['lastUpdated'] = row['Last Updated'];
        article['category'] = category;

        articles[article.id] = article;
    }
    return {
        articles: articles,
        categories: categories
    };
};
module.exports = extractViews;