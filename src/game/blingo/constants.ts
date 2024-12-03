export const ERRORDESCRIPTION : {[key: number]: string} = {
    0 : "Success",
    1 : "Insufficient balance.",
    2 : "Player not found or is logged out.",
    3 : "Bet is not allowed.",
    4 : "Player authentication failed due to invalid, not found or expired token.",
    5 : "Invalid hash code.",
    6 : "Player is frozen.",
    7 : "Bad parameters in the request, please check post parameters.",
    8 : "Game is not found or disabled.",
    9 : "Insufficient balance.",
    10 : "Bet limit has been reached.",
    11 : "Duplicated transaction.",
    12 : "Invalid transaction.",
    13 : "Bet/Round already started.",
    14 : "Transaction not found.",
    15 : "Bet/Round already closed",
    16 : "Round not found",
    20 : "Invalid user currency.",
    30 : "Provider not found",
    100 : "Internal server error.",
    120 : "Internal server error.",
    210 : "Reality check warning",
    310 : "Player's bet is out of his bet limits.",
    401 : "Unauthorized access",
}

export const ACTIONS = [ "SPIN", "CHOOSE_CELL", "NONE" ];
export const STATES = [ "STANDARD_SPIN", "FREE_PURCHASE_SPIN", "PURCHASE_SPIN", "COMPLETE" ];
export const SPINTYPES = [ "STANDARD", "RESPIN", "FREE_PURCHASE", "PURCHASE" ];

export const PAYTABLE : { [ key:number ] : number[] } = {
    100 : [ 2.5, 1, 0.5 ],
    8 : [ 250, 200, 50 ],
    7 : [ 120, 60, 25 ],
    6 : [ 60, 25, 10 ],
    5 : [ 50, 20, 8 ],
    4 : [ 40, 15, 7 ],
    3 : [ 25, 10, 5 ],
};

export const SYMBOLTYPES : { [ key:number ] : string } = {
    3 : "PURPLE_GEM"
};

export const SLINGOWINLINES : { [ key:number ] : number[] } = {
    0 : [ 0,1,2,3,4 ],
    1 : [ 5,6,7,8,9 ],
    2 : [ 10,11,12,13,14 ],
    3 : [ 15,16,17,18,19 ],
    4 : [ 20,21,22,23,24 ],
    5 : [ 0,5,10,15,20 ],
    6 : [ 1,6,11,16,21 ],
    7 : [ 2,7,12,17,22 ],
    8 : [ 3,8,13,18,23 ],
    9 : [ 4,9,14,19,24 ],
    10 : [ 0,6,12,18,24 ],
    11 : [ 4,8,12,16,20 ],
}

export const SLOTPAYLINES : { [ key:number ] : number[] } = {
    1 : [ 0, 1, 2, 3, 4 ],
    2 : [ 5, 6, 7, 8, 9 ],
    3 : [ 10, 11, 12, 13, 14 ],
    4 : [ 0, 6, 12, 8, 4 ],
    5 : [ 10, 6, 2, 8, 14 ],
    6 : [ 0, 1, 7, 3, 4 ],
    7 : [ 10, 11, 7, 13, 14 ],
    8 : [ 5, 11, 12, 13, 9 ],
    9 : [ 5, 1, 2, 3, 9 ],
    10 : [ 5, 1, 7, 3, 9 ],
}
