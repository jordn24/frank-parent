
require('dotenv').config();
const discord = require('discord.js');
const APIHandler = require('../Core/APIHandler');

const client = new discord.Client();

async function convertFoundLanguage(lang){
    const languageMap = {
        "abkhazian": "ab",
        "afar": "aa",
        "afrikaans": "af",
        "akan": "ak",
        "albanian": "sq",
        "amharic": "am",
        "arabic": "ar",
        "aragonese": "an",
        "armenian": "hy",
        "assamese": "as",
        "avestic": "ae",
        "aymara": "ay",
        "azerbaijani": "az",
        "bambara": "bm",
        "bashkir": "ba",
        "basque": "eu",
        "belarusian": "be",
        "bengali": "bn",
        "bislama": "bi",
        "bosnian": "bs",
        "breton": "br",
        "bulgarian": "bg",
        "burmese": "my",
        "catalan": "ca",
        "chamorro": "ch",
        "chechen": "ce",
        "chichewa, chewa, nyanja": "ny",
        "chinese": "zh",
        "church slavonic, old slavonic, old church slavonic": "cu",
        "chuvash": "cv",
        "cornish": "kw",
        "corsican": "co",
        "cree": "cr",
        "croatian": "hr",
        "czech": "cs",
        "danish": "da",
        "divehi, dhivehi, maldivian": "dv",
        "dutch, flemish": "nl",
        "dzongkha": "dz",
        "english": "en",
        "esperanto": "eo",
        "estonian": "et",
        "ewe": "ee",
        "faroese": "fo",
        "fijian": "fj",
        "finnish": "fi",
        "french": "fr",
        "western frisian": "fy",
        "fulah": "ff",
        "gaelic, scottish gaelic": "gd",
        "galician": "gl",
        "ganda": "lg",
        "georgian": "ka",
        "german": "de",
        "greek, modern (1453–)": "el",
        "kalaallisut, greenlandic": "kl",
        "guarani": "gn",
        "gujarati": "gu",
        "haitian, haitian creole": "ht",
        "hausa": "ha",
        "hebrew": "he",
        "herero": "hz",
        "hindi": "hi",
        "hiri motu": "ho",
        "hungarian": "hu",
        "icelandic": "is",
        "ido": "io",
        "igbo": "ig",
        "indonesian": "id",
        "interlingua (international auxiliary language association)": "ia",
        "interlingue, occidental": "ie",
        "inuktitut": "iu",
        "inupiaq": "ik",
        "irish": "ga",
        "italian": "it",
        "japanese": "ja",
        "javanese": "jv",
        "kannada": "kn",
        "kanuri": "kr",
        "kashmiri": "ks",
        "kazakh": "kk",
        "central khmer": "km",
        "kikuyu, gikuyu": "ki",
        "kinyarwanda": "rw",
        "kirghiz, kyrgyz": "ky",
        "komi": "kv",
        "kongo": "kg",
        "korean": "ko",
        "kuanyama, kwanyama": "kj",
        "kurdish": "ku",
        "lao": "lo",
        "latin": "la",
        "latvian": "lv",
        "limburgan, limburger, limburgish": "li",
        "lingala": "ln",
        "lithuanian": "lt",
        "luba-katanga": "lu",
        "luxembourgish, letzeburgesch": "lb",
        "macedonian": "mk",
        "malagasy": "mg",
        "malay": "ms",
        "malayalam": "ml",
        "maltese": "mt",
        "manx": "gv",
        "maori": "mi",
        "marathi": "mr",
        "marshallese": "mh",
        "mongolian": "mn",
        "nauru": "na",
        "navajo, navaho": "nv",
        "north ndebele": "nd",
        "south ndebele": "nr",
        "ndonga": "ng",
        "nepali": "ne",
        "norwegian": "no",
        "norwegian bokmål": "nb",
        "norwegian nynorsk": "nn",
        "sichuan yi, nuosu": "ii",
        "occitan": "oc",
        "ojibwa": "oj",
        "oriya": "or",
        "oromo": "om",
        "ossetian, ossetic": "os",
        "pali": "pi",
        "pashto, pushto": "ps",
        "persian": "fa",
        "polish": "pl",
        "portuguese": "pt",
        "punjabi, panjabi": "pa",
        "quechua": "qu",
        "romanian, moldavian, moldovan": "ro",
        "romansh": "rm",
        "rundi": "rn",
        "russian": "ru",
        "northern sami": "se",
        "samoan": "sm",
        "sango": "sg",
        "sanskrit": "sa",
        "sardinian": "sc",
        "serbian": "sr",
        "shona": "sn",
        "sindhi": "sd",
        "sinhala, sinhalese": "si",
        "slovak": "sk",
        "slovenian": "sl",
        "somali": "so",
        "southern sotho": "st",
        "spanish, castilian": "es",
        "sundanese": "su",
        "swahili": "sw",
        "swati": "ss",
        "swedish": "sv",
        "tagalog": "tl",
        "tahitian": "ty",
        "tajik": "tg",
        "tamil": "ta",
        "tatar": "tt",
        "telugu": "te",
        "thai": "th",
        "tibetan": "bo",
        "tigrinya": "ti",
        "tonga (tonga islands)": "to",
        "tsonga": "ts",
        "tswana": "tn",
        "turkish": "tr",
        "turkmen": "tk",
        "twi": "tw",
        "uighur, uyghur": "ug",
        "ukrainian": "uk",
        "urdu": "ur",
        "uzbek": "uz",
        "venda": "ve",
        "vietnamese": "vi",
        "volapük": "vo",
        "walloon": "wa",
        "welsh": "cy",
        "wolof": "wo",
        "xhosa": "xh",
        "yiddish": "yi",
        "yoruba": "yo",
        "zhuang, chuang": "za",
        "zulu": "zu",
        "spanish": "es",
        "arabic": "ar",
        "arab": "ar",
        "russian": "ru",
        "serbian": "sr", 
        "slovenian": "sl", 
        "tongan": "to",
        "indian": "hi",
        "turkish": "tr"
    };    

    return languageMap[lang];
}

async function convertGenreNameToId(genreName) {
    const genreMap = {
        "action": 28,
        "adventure": 12,
        "animation": 16,
        "comedy": 35,
        "crime": 80,
        "documentary": 99,
        "drama": 18,
        "family": 10751,
        "fantasy": 14,
        "history": 36,
        "horror": 27,
        "music": 10402,
        "mystery": 9648,
        "romance": 10749,
        "science fiction": 878,
        "tv movie": 10770,
        "thriller": 53,
        "war": 10752,
        "western": 37,
    };    

    const genreId = genreMap[genreName];
    return genreId;
}

async function calculateParams(input){
    let badKeywords = [
        "bad", "shit", "terrible",
        "ass", "rico", "duong",
        "ivan", "ricardo", "siskas",
        "dreadful", "poor", "jono",
        "milosh", "nathan"
    ]

    let goodKeywords = [
        "good", "excellent", "exceptional",
        "sick", "great", "entertaining",
        "thoughtful", "marvelous", "satisfying",
        "superb", "satisfactory", "jordan"
    ]
    let languageKeywords = [
        "spanish", "arabic", "arab", "russian", "serbian", "slovenian", "tongan", "indian",
        "turkish", "abkhazian", "afar", "afrikaans", "akan", "albanian", "amharic", "aragonese", "armenian",
        "assamese", "avaric", "avestan", "aymara", "azerbaijani", "bambara", "bashkir", "basque",
        "belarusian", "bengali", "bislama", "bosnian", "breton", "bulgarian", "burmese", "catalan",
        "chamorro", "chechen", "chichewa", "chinese", "church slavonic", "chuvash", "cornish",
        "corsican", "cree", "croatian", "czech", "danish", "divehi", "dutch", "dzongkha", "english",
        "esperanto", "estonian", "ewe", "faroese", "fijian", "finnish", "french", "western frisian",
        "fulah", "gaelic", "galician", "ganda", "georgian", "german", "greek", "kalaallisut",
        "guarani", "gujarati", "haitian", "hausa", "hebrew", "herero", "hindi", "hiri motu", "hungarian",
        "icelandic", "ido", "igbo", "indonesian", "interlingua", "interlingue", "inuktitut", "inupiaq",
        "irish", "italian", "japanese", "javanese", "kannada", "kanuri", "kashmiri", "kazakh",
        "central khmer", "kikuyu", "kinyarwanda", "kirghiz", "komi", "kongo", "korean", "kuanyama",
        "kurdish", "lao", "latin", "latvian", "limburgan", "lingala", "lithuanian", "luba-katanga",
        "luxembourgish", "macedonian", "malagasy", "malay", "malayalam", "maltese", "manx", "maori",
        "marathi", "marshallese", "mongolian", "nauru", "navajo", "north ndebele", "south ndebele",
        "ndonga", "nepali", "norwegian", "norwegian bokmål", "norwegian nynorsk", "sichuan yi", "occitan",
        "ojibwa", "oriya", "oromo", "ossetian", "pali", "pashto", "persian", "polish", "portuguese",
        "punjabi", "quechua", "romanian", "romansh", "rundi", "northern sami", "samoan", "sango",
        "sanskrit", "sardinian", "shona", "sindhi", "sinhala", "slovak", "slovenian", "somali",
        "southern sotho", "spanish", "sundanese", "swahili", "swati", "swedish", "tagalog", "tahitian",
        "tajik", "tamil", "tatar", "telugu", "thai", "tibetan", "tigrinya", "tonga", "tsonga", "tswana",
        "turkish", "turkmen", "twi", "uighur", "ukrainian", "urdu", "uzbek", "venda", "vietnamese",
        "volapük", "walloon", "welsh", "wolof", "xhosa", "yiddish", "yoruba", "zhuang", "zulu"
    ]
    let genreKeywords = [
        'action',
        'adventure',
        'animation',
        'comedy',
        'crime',
        'documentary',
        'drama',
        'family',
        'fantasy',
        'history',
        'horror',
        'music',
        'mystery',
        'romance',
        'science fiction',
        'sci fi',
        'scifi',
        'sci-fi',
        'tv movie',
        'thriller',
        'war',
        'western'
      ];

      let queryParams = {
        include_adult: 'false', 
        include_video: 'false',
        language:'en-US',
        page: 1,
        sort_by: 'popularity.asc',
        'vote_count.gte': 300,
        with_original_language: 'en'
      }

    if( goodKeywords.some(keyword => input.includes(keyword))){
        queryParams["vote_average.gte"] = 8;
    } else if (badKeywords.some(keyword => input.includes(keyword))) {
        queryParams["vote_average.lte"] = 5;
    }

    const foundLanguage = languageKeywords.find(keyword => input.includes(keyword));
    if (foundLanguage) {
        let convertedLang = await convertFoundLanguage(foundLanguage);
        // console.log("Found language:", foundLanguage);
        // console.log("Converted language:", convertedLang);
        queryParams["with_original_language"] = convertedLang;
        queryParams["vote_count.gte"] = '';
    }

    const foundGenre = genreKeywords.find(keyword => input.includes(keyword));
    if (foundGenre) {
        let genreCode =  await convertGenreNameToId(foundGenre);
        // console.log("Found genre:", foundGenre);
        // console.log("Genre code:", genreCode);
        queryParams["with_genres"] = genreCode;
    }

    return queryParams;
}

client.on('message', async message => {
    // Check if the message mentions a user named "Frank"
    const frankUser = message.mentions.users.find(user => user.username === 'Frank');
        
    if (frankUser) {
        // Check if the message contains "movie" and any of the specified words
        const messageContent = message.content.toLowerCase();

        if (messageContent.includes("movie")) {

            if(messageContent.includes("kieren")){
                message.channel.send("The Mask");
                message.channel.send("https://www.themoviedb.org/t/p/w600_and_h900_bestv2/xbbXp9px4o8Oe7IbGd0yIbla8mZ.jpg")
                return;
            }

            let url = process.env.MOVIE_API_URL;

            let queryParams = await calculateParams(messageContent)
            // console.log(queryParams)
            const bearerToken = process.env.MOVIE_API_ACCESS_TOKEN;
            const requestHeaders = { 'Authorization': `Bearer ${bearerToken}` }; 

            const config = {
                params: queryParams,
                headers: requestHeaders,
            };

            let response = await APIHandler.get(url, config);

            let totalPages = response.data.total_pages;

            if(totalPages == 0){ 
                message.reply("Didn't find anything")
                return; 
            }

            let randomPage = Math.floor(Math.random() * totalPages + 1);

            queryParams.page = randomPage;

            response = await APIHandler.get(url, config);

            // console.log(response);
            let randomPick = Math.floor(Math.random() * response.data.results.length);

            message.channel.send(response.data.results[randomPick].original_title);
            message.channel.send("https://image.tmdb.org/t/p/w600_and_h900_bestv2/" + response.data.results[randomPick].poster_path);
        } else if (messageContent.includes("tv")){
            let url = process.env.TV_API_URL;

            let queryParams = { 
                include_adult: 'false', 
                include_video: 'false',
                language:'en-US',
                page: 1,
                sort_by: 'popularity.asc',
                'vote_count.gte': 300,
                with_original_language: 'en'
            };

            const bearerToken = process.env.MOVIE_API_ACCESS_TOKEN;
            const requestHeaders = { 'Authorization': `Bearer ${bearerToken}` }; 

            const config = {
                params: queryParams,
                headers: requestHeaders,
            };

            let response = await APIHandler.get(url, config);

            let totalPages = response.data.total_pages;

            let randomPage = Math.floor(Math.random() * totalPages + 1);
            // Get Results from Random page
            queryParams.page = randomPage;

            response = await APIHandler.get(url, config);

            let randomPick = Math.floor(Math.random() * response.data.results.length);

            message.channel.send(response.data.results[randomPick].original_name);
            message.channel.send("https://image.tmdb.org/t/p/w600_and_h900_bestv2/" + response.data.results[randomPick].poster_path);
        }
    }
});

client.login(process.env.BOT_TOKEN);