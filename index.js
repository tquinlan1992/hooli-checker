const { getMissingIds, writeMissingIdsFile } = require('./missingIds');

function linkBuyerToFacility() {
    // your solution goes here
    getMissingIds({ 
        existingAccountsPath: './existing-accounts.csv', 
        samAccountsPath: './sam-accounts.csv' 
    }, (err, missingIds) => {
        writeMissingIdsFile({missingIds, filePath: './missingIds.txt'}, (err, result) => {
             console.log(result);
          });
    });
}

linkBuyerToFacility();
