import { Api } from './api.js'
const conf = window.appConf
//const GOOGLE_API_KEY = 'PASTE YOUR GOOGLE API KEY HERE'
const GOOGLE_API_KEY = 'AIzaSyBYOwC55SpcCZaG9d87UuHkxkQ8GRI_39M'

export const Drive = {
    ...Api,
    driveExportUrl: 'https://drive.google.com/uc?export=download&id=',

    async getSpreadsheet(fileId) {
        return this.get(
            `https://sheets.googleapis.com/v4/spreadsheets/${fileId}/values/Posts?alt=json&key=${GOOGLE_API_KEY}`,
            {
                credentials: 'omit',
            }
        ).then((response) => response.json())
    },

    async getDocument(fileId) {
        return this.get(
            `https://docs.google.com/feeds/download/documents/export/Export?id=${fileId}&exportFormat=html`,
            {
                credentials: 'omit',
            }
        ).then((response) => {
            return response.text()
        })
    },

    async getCategories() {
        const [getSpreadsheetError, spreadsheet] = await this.getSpreadsheet(
            conf.dashboardId
        )
        if (getSpreadsheetError) {
            console.log('getSpreadsheetError', getSpreadsheetError)
            return [getSpreadsheetError]
        }
        const rows = spreadsheet.values
        rows.shift()
        const categories = {}
        const articles = rows.values.map((row) => ({
            id: row?.[4],
            title: row?.[0],
            subtitle: row?.[1],
            imageName: row?.[3],
            image: this.driveExportUrl + row?.[5],
            categoryId: this.slug(row?.[2], 'category'),
            lastUpdated: row?.[6],
            date: this.formatDate(row?.[6]),
            uri: `/articles/${row?.[4]}/${this.slug(row?.[0], 'article')}`,
        }))
        articles.forEach((article) => {
            const categoryId = article.categoryId
            const isExistingCategory = Object.values(categories).some(
                (category) => category.id === categoryId
            )
            if (isExistingCategory) {
                categories[categoryId].articles.push(article.id)
            } else {
                categories[categoryId] = {
                    id: categoryId,
                    title: article.category,
                    imageName: article.imageName,
                    image: article.image,
                    articles: [article.id],
                    uri: `/categories/${categoryId}`,
                }
            }
        })
        return [
            null,
            {
                articles,
                categories,
            },
        ]
    },

    async getArticleHtml(articleId) {
        const [getDocumentError, doc] = await this.getDocument(articleId)
        if (getDocumentError) {
            console.log('getDocumentError', getDocumentError)
            return [getDocumentError]
        }
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

        return [
            null,
            `${styleStart}
        ${splitStyleEnd[0]}
        ${styleEnd}
        <div>${splitHtmlEnd[0]}</div>
        `,
        ]
    },

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
    },

    formatDate(lastUpdated) {
        const fullDateSplit = lastUpdated.split(' ')
        const dateSplit = fullDateSplit[0].split('/')
        const day = parseInt(dateSplit[0])
        const month = dateSplit[1]
        const year = dateSplit[2]
        const monthNames = [
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
        let daySuffix = 'th'
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
        return `${day}${daySuffix} of ${monthNames[month - 1]}`
    },
}
