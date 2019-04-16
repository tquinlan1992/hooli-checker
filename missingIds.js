const fs = require('fs'); // useful for navigating the file system
const parse = require('csv-parse/lib/sync'); // needed for parsing CSV file data
const async = require('async');
const { forEach } = require('lodash');

function readCsvFile(filePath, callback) {
    fs.readFile(filePath, (err, fileData) => {
        if (err) throw err;

        const data = parse(fileData, {
            trim: true,
            skip_empty_lines: true
        })
        callback(null, data);
    });
}

function handleResults(results) {
    const [existingAccounts, samAccounts] = results;
    const existingAccountsHooliIds = existingAccounts.slice(1).map(account => {
        const hooliId = account[1]
        return hooliId;
    })
    const missingHooliIds = [];
    samAccounts.slice(1).forEach(samAccount => {
        const [accountHooliId] = samAccount;
        let found = false;
        forEach(existingAccountsHooliIds, existingAccountId => {
            if (existingAccountId.startsWith(accountHooliId)) {
                found = true;
                return false;
            }
        });
        if (!found) {
            missingHooliIds.push(accountHooliId);
        }
    })
    return missingHooliIds;
}

function getMissingIds({ existingAccountsPath, samAccountsPath }, callback) {
    async.parallel([
        callback => {
            readCsvFile(existingAccountsPath, callback)
        },
        callback => {
            readCsvFile(samAccountsPath, callback)
        }
    ],
        (err, results) => {
            const missingHooliIds = handleResults(results);
            callback(null, missingHooliIds);
        }
    );
}

function writeMissingIdsFile({missingIds, filePath}, callback) {
    fs.writeFile(filePath, missingIds.join('\n'), (err) => {
        callback(null, `The file has been saved: "${filePath}"`);
      });
}

module.exports = {
    getMissingIds,
    writeMissingIdsFile
};