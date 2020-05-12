import Api from './api.js'
const conf = window.appConf

class Drive extends Api {
    constructor() {
        super()
        this.getSpreadsheet = this.getSpreadsheet.bind(this)
        this.getDocument = this.getDocument.bind(this)
        this.getCategories = this.getCategories.bind(this)
        this.getArticleHtml = this.getArticleHtml.bind(this)
        this.driveExportUrl = 'https://drive.google.com/uc?export=download&id='
        this.slug = this.slug.bind(this)
        this.formatDate = this.formatDate.bind(this)
    }

    getSpreadsheet(fileId) {
        return this.get(
            `https://spreadsheets.google.com/feeds/list/${fileId}/od6/public/values?alt=json`,
            {
                credentials: 'omit',
            }
        )
            .then((response) => response.json())
            .catch((error) => console.log('error', error))
    }

    getDocument(fileId) {
        return this.get(
            `https://docs.google.com/feeds/download/documents/export/Export?id=${fileId}&exportFormat=html`,
            {
                credentials: 'omit',
            }
        )
            .then((response) => {
                return response.text()
            })
            .catch((error) => console.log('error', error))
    }

    getCategories() {
        return this.getSpreadsheet(conf.dashboardId).then((sheetData) => {
            let articles = {}
            let categories = {}

            sheetData.feed.entry
                .map((row) => ({
                    title: row.gsx$title.$t,
                    subtitle: row.gsx$subtitle.$t,
                    image: row.gsx$image.$t,
                    category: row.gsx$category.$t,
                    postId: row.gsx$postid.$t,
                    imageId: row.gsx$imageid.$t,
                    lastUpdated: row.gsx$lastupdated.$t,
                }))
                .forEach((row) => {
                    let category = {}

                    let categoryId = this.slug(row.category, 'category')

                    let existingCategory = Object.values(categories).find(
                        (category) => category.id === categoryId
                    )

                    let article = {
                        id: row.postId,
                        title: row.title,
                        subtitle: row.subtitle,
                        imageName: row.image,
                        image: this.driveExportUrl + row.imageId,
                        categoryId,
                        lastUpdated: row.lastUpdated,
                        date: this.formatDate(row.lastUpdated),
                        uri: `/articles/${row.postId}/${this.slug(
                            row.title,
                            'article'
                        )}`,
                    }

                    if (existingCategory) {
                        categories[categoryId].articles.push(row.postId)
                    } else {
                        category = {
                            id: categoryId,
                            title: row.category,
                            imageName: row.image,
                            image: this.driveExportUrl + row.imageId,
                            articles: [row.postId],
                            uri: `/categories/${categoryId}`,
                        }
                        categories[categoryId] = category
                    }
                    articles[row.postId] = article
                })
            return {
                articles,
                categories,
            }
        })
    }

    getArticleHtml(articleId) {
        return this.getDocument(articleId).then((doc) => {
            let styleStart = '<style type="text/css">'
            let styleEnd = '</style>'
            let splitStyleStart = doc.split(styleStart)
            let splitStyleEnd = splitStyleStart[1].split(styleEnd)

            let htmlStart = '<body '
            let htmlStart2 = '>'
            let htmlEnd = '</body>'
            let splitHtmlStart = splitStyleEnd[1].split(htmlStart)
            let splitHtmlStart2 = splitHtmlStart[1].split(htmlStart2)
            let htmlClass = splitHtmlStart2[0]
            let htmlStartFull = htmlStart + htmlClass + htmlStart2
            splitHtmlStart = splitStyleEnd[1].split(htmlStartFull)
            let splitHtmlEnd = splitHtmlStart[1].split(htmlEnd)
            return (
                styleStart +
                splitStyleEnd[0] +
                styleEnd +
                '<div>' +
                splitHtmlEnd[0] +
                '</div>'
            )
        })
    }

    slug(str, type = 'type') {
        str = str.replace(/^\s+|\s+$/g, '')
        str = str.toLowerCase()

        let from = 'ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;'
        let to = 'aaaaaeeeeeiiiiooooouuuunc------'
        for (let i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
        }

        str = str
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')

        if (str.length < 4) {
            str = type + '_' + str
        }
        return str
    }

    formatDate(lastUpdated) {
        var fullDateSplit = lastUpdated.split(' ')
        var dateSplit = fullDateSplit[0].split('/')
        var day = parseInt(dateSplit[0])
        var month = dateSplit[1]
        var year = dateSplit[2]
        var monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ]
        var daySuffix = 'th'
        switch (day) {
            case 1:
                daySuffix = 'st'
                break
            case 2:
                daySuffix = 'nd'
                break
            case 3:
                daySuffix = 'rd'
                break
        }
        return day + daySuffix + ' of ' + monthNames[month - 1] + ' ' + year
    }
}

export default new Drive()
