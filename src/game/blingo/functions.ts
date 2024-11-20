let round = 0;

export const generateFunToken = () => {
    round++;
    if( round>100000 ) round = 0;
    const session = "fun@" + (Math.random() + 1).toString(36).substring(2) + String(round.toString(36)) + (Date.now().toString(36));
    return session;
}

export const generateStartGameResponse = () => {
    const response = {"game":{"userId":24177383,"gameInstanceId":88776505,"currencyCode":"EUR","state":"STANDARD_SPIN","action":"SPIN","stake":0.5,"totalStake":0.5,"spinsRemaining":10,"freeSpinsRemaining":0,"freePurchaseSpinsRemaining":5,"purchaseSpinsRemaining":40,"freeSpinsAwarded":0,"freePurchaseSpinsAwarded":0,"ticket":{"id":410,"rows":5,"columns":5,"cells":"8,17,35,54,61,3,18,34,46,68,12,21,38,57,69,1,19,31,58,74,10,16,33,53,70","matches":"0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0"},"spinPrice":0,"matchedPatterns":0,"totalPatternWin":0,"totalSymbolWin":0,"totalWin":0},"balance":{"cash":999.5,"bonus":0,"total":999.5,"currencyCode":"EUR"},"wrapper":{"postWager":true,"winProcessorRsp":null,"activeBalance":"CASH"},"response":0}
    return response;
}

const spins = [
    {"game":{"userId":24177383,"gameInstanceId":88776505,"currencyCode":"EUR","state":"STANDARD_SPIN","action":"CHOOSE_CELL","stake":0.5,"totalStake":0.5,"spinsRemaining":9,"freeSpinsRemaining":0,"freePurchaseSpinsRemaining":5,"purchaseSpinsRemaining":40,"freeSpinsAwarded":0,"freePurchaseSpinsAwarded":0,"spin":{"type":"STANDARD","symbols":["11","PG","J","54","J"],"jokerIndexes":[ 2, 4],"jokerCells":[ 37, 35, 34, 41, 33, 67, 74, 69, 68, 72],"superJokerIndexes":[],"superJokerCells":[],"respinIndexes":[],"matches":[],"symbolWins":[],"totalSymbolWin":0,"purpleGemIndexes":[ 1],"freeSpinIndexes":[]},"spinPrice":0,"matchedPatterns":0,"totalPatternWin":0,"totalSymbolWin":0,"totalWin":0},"response":0},

    {"game":{"userId":24177383,"gameInstanceId":88776505,"currencyCode":"EUR","state":"STANDARD_SPIN","action":"SPIN","stake":0.5,"totalStake":0.5,"spinsRemaining":8,"freeSpinsRemaining":0,"freePurchaseSpinsRemaining":5,"purchaseSpinsRemaining":40,"freeSpinsAwarded":0,"freePurchaseSpinsAwarded":0,"spin":{"type":"STANDARD","symbols":["11","PG","PG","51","68"],"jokerIndexes":[],"jokerCells":[],"superJokerIndexes":[],"superJokerCells":[],"respinIndexes":[],"matches":[{"number":68,"patterns":[]}],"symbolWins":[],"totalSymbolWin":0,"purpleGemIndexes":[ 1, 2],"freeSpinIndexes":[]},"spinPrice":0,"matchedPatterns":0,"totalPatternWin":0,"totalSymbolWin":0,"totalWin":0},"response":0},
    {"game":{"userId":24177383,"gameInstanceId":88776505,"currencyCode":"EUR","state":"STANDARD_SPIN","action":"SPIN","stake":0.5,"totalStake":0.5,"spinsRemaining":7,"freeSpinsRemaining":0,"freePurchaseSpinsRemaining":5,"purchaseSpinsRemaining":40,"freeSpinsAwarded":0,"freePurchaseSpinsAwarded":0,"spin":{"type":"STANDARD","symbols":["4","PG","37","57","D"],"jokerIndexes":[],"jokerCells":[],"superJokerIndexes":[],"superJokerCells":[],"respinIndexes":[],"matches":[{"number":4,"patterns":[]},{"number":37,"patterns":[]}],"symbolWins":[],"totalSymbolWin":0,"purpleGemIndexes":[ 1],"freeSpinIndexes":[]},"spinPrice":0,"matchedPatterns":0,"totalPatternWin":0,"totalSymbolWin":0,"totalWin":0},"response":0},
    {"game":{"userId":24177383,"gameInstanceId":88776505,"currencyCode":"EUR","state":"STANDARD_SPIN","action":"SPIN","stake":0.5,"totalStake":0.5,"spinsRemaining":6,"freeSpinsRemaining":0,"freePurchaseSpinsRemaining":5,"purchaseSpinsRemaining":40,"freeSpinsAwarded":0,"freePurchaseSpinsAwarded":0,"spin":{"type":"STANDARD","symbols":["6","27","40","57","68"],"jokerIndexes":[],"jokerCells":[],"superJokerIndexes":[],"superJokerCells":[],"respinIndexes":[],"matches":[],"symbolWins":[],"totalSymbolWin":0,"purpleGemIndexes":[],"freeSpinIndexes":[]},"spinPrice":0,"matchedPatterns":0,"totalPatternWin":0,"totalSymbolWin":0,"totalWin":0},"response":0},
    {"game":{"userId":24177383,"gameInstanceId":88776505,"currencyCode":"EUR","state":"STANDARD_SPIN","action":"SPIN","stake":0.5,"totalStake":0.5,"spinsRemaining":5,"freeSpinsRemaining":0,"freePurchaseSpinsRemaining":5,"purchaseSpinsRemaining":40,"freeSpinsAwarded":0,"freePurchaseSpinsAwarded":0,"spin":{"type":"STANDARD","symbols":["PG","24","34","PG","64"],"jokerIndexes":[],"jokerCells":[],"superJokerIndexes":[],"superJokerCells":[],"respinIndexes":[],"matches":[{"number":24,"patterns":[]}],"symbolWins":[],"totalSymbolWin":0,"purpleGemIndexes":[ 0, 3],"freeSpinIndexes":[]},"spinPrice":0,"matchedPatterns":0,"totalPatternWin":0,"totalSymbolWin":0,"totalWin":0},"response":0},
    {"game":{"userId":24177383,"gameInstanceId":88776505,"currencyCode":"EUR","state":"STANDARD_SPIN","action":"CHOOSE_CELL","stake":0.5,"totalStake":0.5,"spinsRemaining":4,"freeSpinsRemaining":0,"freePurchaseSpinsRemaining":5,"purchaseSpinsRemaining":40,"freeSpinsAwarded":0,"freePurchaseSpinsAwarded":0,"spin":{"type":"STANDARD","symbols":["11","J","34","46","J"],"jokerIndexes":[ 1, 4],"jokerCells":[ 18, 26, 22, 25, 67, 74, 72],"superJokerIndexes":[],"superJokerCells":[],"respinIndexes":[],"matches":[],"symbolWins":[],"totalSymbolWin":0,"purpleGemIndexes":[],"freeSpinIndexes":[]},"spinPrice":0,"matchedPatterns":0,"totalPatternWin":0,"totalSymbolWin":0,"totalWin":0},"response":0},

    {"game":{"userId":24177383,"gameInstanceId":88776505,"currencyCode":"EUR","state":"STANDARD_SPIN","action":"SPIN","stake":0.5,"totalStake":0.5,"spinsRemaining":3,"freeSpinsRemaining":0,"freePurchaseSpinsRemaining":5,"purchaseSpinsRemaining":40,"freeSpinsAwarded":0,"freePurchaseSpinsAwarded":0,"spin":{"type":"STANDARD","symbols":["12","16","35","46","PG"],"jokerIndexes":[],"jokerCells":[],"superJokerIndexes":[],"superJokerCells":[],"respinIndexes":[],"matches":[{"number":35,"patterns":[]}],"symbolWins":[],"totalSymbolWin":0,"purpleGemIndexes":[ 4],"freeSpinIndexes":[]},"spinPrice":0,"matchedPatterns":0,"totalPatternWin":0,"totalSymbolWin":0,"totalWin":0},"response":0},
    {"game":{"userId":24177383,"gameInstanceId":88776505,"currencyCode":"EUR","state":"STANDARD_SPIN","action":"SPIN","stake":0.5,"totalStake":0.5,"spinsRemaining":2,"freeSpinsRemaining":0,"freePurchaseSpinsRemaining":5,"purchaseSpinsRemaining":40,"freeSpinsAwarded":0,"freePurchaseSpinsAwarded":0,"spin":{"type":"STANDARD","symbols":["8","24","D","53","71"],"jokerIndexes":[],"jokerCells":[],"superJokerIndexes":[],"superJokerCells":[],"respinIndexes":[],"matches":[],"symbolWins":[],"totalSymbolWin":0,"purpleGemIndexes":[],"freeSpinIndexes":[]},"spinPrice":0,"matchedPatterns":0,"totalPatternWin":0,"totalSymbolWin":0,"totalWin":0},"response":0},
    {"game":{"userId":24177383,"gameInstanceId":88776505,"currencyCode":"EUR","state":"STANDARD_SPIN","action":"CHOOSE_CELL","stake":0.5,"totalStake":0.5,"spinsRemaining":2,"freeSpinsRemaining":0,"freePurchaseSpinsRemaining":5,"purchaseSpinsRemaining":40,"freeSpinsAwarded":0,"freePurchaseSpinsAwarded":0,"spin":{"type":"STANDARD","symbols":["9","28","RJ","49","67"],"jokerIndexes":[ 2],"jokerCells":[ 41, 33],"superJokerIndexes":[],"superJokerCells":[],"respinIndexes":[ 2],"matches":[{"number":49,"patterns":[]}],"symbolWins":[],"totalSymbolWin":0,"purpleGemIndexes":[ 2],"freeSpinIndexes":[]},"spinPrice":0,"matchedPatterns":0,"totalPatternWin":0,"totalSymbolWin":0,"totalWin":0},"response":0},
];
let sid = 0;
export const generateSpinResponse = () => {
    const response = {
        "game": {
            "userId": 24177383,
            "gameInstanceId": 88776505,
            "currencyCode": "EUR",
            "state": "STANDARD_SPIN",
            "action": "CHOOSE_CELL",
            "stake": 0.5,
            "totalStake": 0.5,
            "spinsRemaining": 9,
            "freeSpinsRemaining": 0,
            "freePurchaseSpinsRemaining": 5,
            "purchaseSpinsRemaining": 40,
            "freeSpinsAwarded": 0,
            "freePurchaseSpinsAwarded": 0,
            "spin": {
                "type": "STANDARD",
                "symbols": [
                    "11",
                    "PG",
                    "J",
                    "54",
                    "J"
                ],
                "jokerIndexes": [
                    2,
                    4
                ],
                "jokerCells": [
                    37,
                    35,
                    34,
                    41,
                    33,
                    67,
                    74,
                    69,
                    68,
                    72
                ],
                "superJokerIndexes": [],
                "superJokerCells": [],
                "respinIndexes": [],
                "matches": [],
                "symbolWins": [],
                "totalSymbolWin": 0,
                "purpleGemIndexes": [
                    1
                ],
                "freeSpinIndexes": []
            },
            "spinPrice": 0,
            "matchedPatterns": 0,
            "totalPatternWin": 0,
            "totalSymbolWin": 0,
            "totalWin": 0
        },
        "response": 0
    };

    return response;
}

const chooseCells = [
    {"game":{"userId":24177383,"gameInstanceId":88776505,"currencyCode":"EUR","state":"STANDARD_SPIN","action":"CHOOSE_CELL","stake":0.5,"totalStake":0.5,"spinsRemaining":9,"freeSpinsRemaining":0,"freePurchaseSpinsRemaining":5,"purchaseSpinsRemaining":40,"freeSpinsAwarded":0,"freePurchaseSpinsAwarded":0,"spin":{"type":"STANDARD","symbols":["11","PG","J","54","J"],"jokerIndexes":[ 2],"jokerCells":[ 37, 35, 34, 41, 33],"superJokerIndexes":[],"superJokerCells":[],"respinIndexes":[],"matches":[{"number":69,"patterns":[]}],"symbolWins":[],"totalSymbolWin":0,"purpleGemIndexes":[],"freeSpinIndexes":[]},"spinPrice":0,"matchedPatterns":0,"totalPatternWin":0,"totalSymbolWin":0,"totalWin":0},"response":0},
    {"game":{"userId":24177383,"gameInstanceId":88776505,"currencyCode":"EUR","state":"STANDARD_SPIN","action":"SPIN","stake":0.5,"totalStake":0.5,"spinsRemaining":9,"freeSpinsRemaining":0,"freePurchaseSpinsRemaining":5,"purchaseSpinsRemaining":40,"freeSpinsAwarded":0,"freePurchaseSpinsAwarded":0,"spin":{"type":"STANDARD","symbols":["11","PG","J","54","J"],"jokerIndexes":[],"jokerCells":[],"superJokerIndexes":[],"superJokerCells":[],"respinIndexes":[],"matches":[{"number":69,"patterns":[]},{"number":34,"patterns":[]}],"symbolWins":[],"totalSymbolWin":0,"purpleGemIndexes":[],"freeSpinIndexes":[]},"spinPrice":0,"matchedPatterns":0,"totalPatternWin":0,"totalSymbolWin":0,"totalWin":0},"response":0},

    {"game":{"userId":24177383,"gameInstanceId":88776505,"currencyCode":"EUR","state":"STANDARD_SPIN","action":"CHOOSE_CELL","stake":0.5,"totalStake":0.5,"spinsRemaining":4,"freeSpinsRemaining":0,"freePurchaseSpinsRemaining":5,"purchaseSpinsRemaining":40,"freeSpinsAwarded":0,"freePurchaseSpinsAwarded":0,"spin":{"type":"STANDARD","symbols":["11","J","34","46","J"],"jokerIndexes":[ 1],"jokerCells":[ 18, 26, 22, 25],"superJokerIndexes":[],"superJokerCells":[],"respinIndexes":[],"matches":[{"number":67,"patterns":[]}],"symbolWins":[],"totalSymbolWin":0,"purpleGemIndexes":[],"freeSpinIndexes":[]},"spinPrice":0,"matchedPatterns":0,"totalPatternWin":0,"totalSymbolWin":0,"totalWin":0},"response":0},
    {"game":{"userId":24177383,"gameInstanceId":88776505,"currencyCode":"EUR","state":"STANDARD_SPIN","action":"SPIN","stake":0.5,"totalStake":0.5,"spinsRemaining":4,"freeSpinsRemaining":0,"freePurchaseSpinsRemaining":5,"purchaseSpinsRemaining":40,"freeSpinsAwarded":0,"freePurchaseSpinsAwarded":0,"spin":{"type":"STANDARD","symbols":["11","J","34","46","J"],"jokerIndexes":[],"jokerCells":[],"superJokerIndexes":[],"superJokerCells":[],"respinIndexes":[],"matches":[{"number":67,"patterns":[]},{"number":18,"patterns":[]}],"symbolWins":[],"totalSymbolWin":0,"purpleGemIndexes":[],"freeSpinIndexes":[]},"spinPrice":0,"matchedPatterns":0,"totalPatternWin":0,"totalSymbolWin":0,"totalWin":0},"response":0},

];
let cid = 0;
export const generateChooseCellResponse = () => {
    const response = {};
    return response;
}
const collects = [
    {"wrapper":{},"balance":{"cash":999.5,"bonus":0,"total":999.5,"currencyCode":"EUR"},"game":{"userId":24177383,"ticket":{"id":686,"rows":5,"columns":5,"cells":"11,24,36,56,71,9,17,44,58,69,3,18,34,49,63,12,29,32,53,70,2,28,37,52,74","matches":"0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0"},"state":"PURCHASE_ENTRY"},"response":0}
];
let ctid = 0;
export const generateCollectResponse = () => {
    const response = {};
    return response;
}