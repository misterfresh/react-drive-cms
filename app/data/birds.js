// Bird data for "Bird of the month", the Listen buttons and the sightings map.
// Edit this file to add birds or sightings; no other code needs to change.

// photo: a file in /assets, or leave it out and set postId to use that
//        post's header photo from the Google Sheet.
// photoCredit: { text, url } shown under the card, for photos that aren't yours.
// postId: the "Post Id" from the Google Sheet, if you've written about it.
// call:   a recording from xeno-canto.org (number, recordist, license), or
//         null if there's no good recording (none yet for the spoonbill).
export const birds = [
    {
        id: 'kakapo',
        name: 'Kakapo',
        scientific: 'Strigops habroptila',
        postId: '1GAWIMMiw4YNN9Lo9aY3i-DTWEYKRYFqODOYQpetKp2s',
        fact: "The world's only flightless parrot, and the heaviest. There are so few left that every single kakapo has a name and is individually monitored.",
        call: {
            xc: 295659,
            recordist: 'Johannes Fischer',
            license: 'CC BY-NC-SA 4.0',
            licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
        },
    },
    {
        id: 'eurasian-coot',
        name: 'Eurasian Coot',
        scientific: 'Fulica atra',
        postId: '1XND2Hxsj-XXbXus7vU7toJbA2L6TPkxL7fSq2HmJYCQ',
        fact: "Not a duck at all: coots belong to the rail family, and instead of webbed feet they have lobed toes that work like paddles.",
        call: {
            xc: 818951,
            recordist: 'Grzegorz Lorek',
            license: 'CC BY-NC-SA 4.0',
            licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
        },
    },
    {
        id: 'canada-goose',
        name: 'Canada Goose',
        scientific: 'Branta canadensis',
        postId: '16KOegLGNs8CA7srEvynqCnKF7HtoJ2Tkw1V3Q0NJl9A',
        fact: 'Canada geese usually pair for life, and their goslings stay with the family through their first winter.',
        call: {
            xc: 415272,
            recordist: 'Jeff Dyck',
            license: 'CC BY-NC-SA 4.0',
            licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
        },
    },
    {
        id: 'harpy-eagle',
        name: 'Harpy Eagle',
        scientific: 'Harpia harpyja',
        photo: '/assets/harpy_eagle_1.jpg',
        fact: "One of the most powerful eagles on Earth. Its back talons can grow longer than a grizzly bear's claws, strong enough to snatch sloths and monkeys from the rainforest canopy.",
        call: {
            xc: 708578,
            recordist: 'Alberto Lobato',
            license: 'CC BY-NC-SA 4.0',
            licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
        },
    },
    {
        id: 'gyrfalcon',
        name: 'Gyrfalcon',
        scientific: 'Falco rusticolus',
        photo: '/assets/gyrfalcon.jpg',
        photoCredit: {
            text: 'Photo: Ólafur Larsen, CC BY-SA 2.0, Wikimedia Commons',
            url: 'https://commons.wikimedia.org/wiki/File:Falco_rusticolus_white.jpg',
        },
        fact: 'The largest falcon in the world. Most gyrfalcons spend the whole year in the Arctic, hunting ptarmigan across the tundra.',
        call: {
            xc: 709104,
            recordist: 'Lars Edenius',
            license: 'CC BY-NC-SA 4.0',
            licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
        },
    },
    {
        id: 'bald-eagle',
        name: 'Bald Eagle',
        scientific: 'Haliaeetus leucocephalus',
        photo: '/assets/bald_eagle.jpg',
        postId: '1Jk3ag2f0lW4Kxt5fjnpz9wHBIFL5jGOV',
        fact: 'Bald eagles build the biggest nests of any North American bird, adding to the same nest year after year until it can weigh as much as a small car.',
        call: {
            xc: 451490,
            recordist: 'Paul Marvin',
            license: 'CC BY-NC-SA 4.0',
            licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
        },
    },
    {
        id: 'lidths-jay',
        name: "Lidth's Jay",
        nameLocal: 'ルリカケス',
        nameLang: 'ja',
        scientific: 'Garrulus lidthi',
        photo: '/assets/lidths_jay.jpg',
        fact: "Found only on Amami Ōshima and a few neighbouring islands in southern Japan, where it's protected as a Natural Monument.",
        call: {
            xc: 191092,
            recordist: 'Andrew Spencer',
            license: 'CC BY-NC-SA 4.0',
            licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
        },
    },
    {
        id: 'black-faced-spoonbill',
        name: 'Black-faced Spoonbill',
        nameLocal: '黑臉琵鷺',
        nameLang: 'zh-Hant',
        scientific: 'Platalea minor',
        photo: '/assets/black_faced_spoonbill.jpg',
        fact: "A rare wader that sweeps its spoon-shaped bill from side to side to catch fish. Conservation work has helped it recover from only a few hundred birds. Many spend the winter in Taiwan and at Hong Kong's Mai Po marshes.",
        call: null,
    },
    {
        id: 'grey-heron',
        name: 'Grey Heron',
        nameLocal: 'アオサギ',
        nameLang: 'ja',
        scientific: 'Ardea cinerea',
        photo: '/assets/grey_heron.jpg',
        postId: '1khLOTBVODqhZUHWiFBykFPQ3r5n8FAeK',
        fact: 'A patient hunter that stands perfectly still at the water\'s edge before striking. In flight it folds its neck into an S-shape, unlike cranes and storks.',
        call: {
            xc: 895619,
            recordist: 'Will Scott',
            license: 'CC BY-NC-SA 4.0',
            licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
        },
    },
]

export const getBird = (id) => birds.find((bird) => bird.id === id)

export const getBirdForPost = (postId) =>
    birds.find((bird) => bird.postId && bird.postId === postId)

// Changes on the 1st of every month, cycling through the list above.
export const getBirdOfTheMonth = (date = new Date()) =>
    birds[(date.getFullYear() * 12 + date.getMonth()) % birds.length]

// Pins on the sightings map. Coordinates: right-click a spot in Google Maps
// and click the numbers at the top of the menu to copy them.
// birdId: a bird from the list above (gives the Listen button and post link),
//         or leave it out and set name for any other bird.
// photo:  optional, a file name from app/data/myPhotos.js to show a thumbnail.
// Sightings with the same lat/lng share one pin.
const HOUSTON = { place: 'Houston, Texas', lat: 29.7604, lng: -95.3698 }
const COLLEGE_STATION = {
    place: 'College Station, Texas',
    lat: 30.628,
    lng: -96.3344,
}

export const sightings = [
    {
        birdId: 'eurasian-coot',
        place: 'Italian Gardens, Kensington Gardens, London',
        lat: 51.5101,
        lng: -0.1749,
        date: 'May 2022',
        zoom: 16,
        note: 'Coot chicks swimming in the pond, fed daily by visitors.',
    },
    {
        birdId: 'canada-goose',
        place: 'Italian Gardens, near Lancaster Gate, London',
        lat: 51.5109,
        lng: -0.1759,
        date: '',
        zoom: 16,
        note: 'Very friendly geese, happy to pose for an iPhone photoshoot.',
    },
    {
        name: 'Rooster',
        ...HOUSTON,
        photo: 'rooster',
        note: 'A rooster exploring under the palm fronds.',
    },
    {
        name: 'White duck',
        ...HOUSTON,
        photo: 'white-duck',
        note: 'Posing for the camera, with Egyptian geese by the lake behind it.',
    },
    {
        name: 'Domestic goose',
        ...HOUSTON,
        photo: 'domestic-goose',
        note: 'A curious goose coming over to say hello.',
    },
    {
        name: 'Ducks',
        ...HOUSTON,
        photo: 'ducks-on-the-pond',
        note: 'Dabbling on the pond in the evening light.',
    },
    {
        name: 'Mallards and grackles',
        ...COLLEGE_STATION,
        photo: 'mallards-and-grackles',
        note: 'Mallards wading between the stepping stones, watched by grackles.',
    },
]
