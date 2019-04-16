const { getMissingIds, writeMissingIdsFile } = require('./missingIds');

jest.mock('fs', () => {
    const actual = jest.requireActual('fs');
    return {
        ...actual,
        writeFile: jest.fn((filePath, data, callback) => {
            callback(null);
        })
    }
})

describe('when getMissingIds is called', () => {
    describe('with no samAccounts that exist', () => {
        it('should return all the samAccountIds', done => {
            getMissingIds({
                existingAccountsPath: './testFiles/existing-accounts1.csv',
                samAccountsPath: './testFiles/sam-accounts1.csv',
            }, (err, missingIds) => {
                expect(missingIds).toEqual(['0013600001sq7Ys', '0013600001ms5al', '0013600001txwdG']);
                done();
            })
        })
    });
    describe('with 2 samAccounts that exist', () => {
        it('should return one missing samAccount', done => {
            getMissingIds({
                existingAccountsPath: './testFiles/existing-accounts2.csv',
                samAccountsPath: './testFiles/sam-accounts2.csv',
            }, (err, missingIds) => {
                expect(missingIds).toEqual(['0013600001txwdG']);
                done();
            })
        })
    });
})

describe('when writeMissingIdsFile is called', () => {
    it('should write a new file with ids separated by line breaks', done => {
        const missingIds = ['missingId1', 'missingId2'];
        const filePath = './filePath';
        const { writeFile } = require('fs');
        writeMissingIdsFile({ missingIds, filePath}, (err, result) => {
            expect(result).toEqual(`The file has been saved: "./filePath"`);
            expect(writeFile).toHaveBeenCalledTimes(1);
            const [ filePathMockCall, dataMockCall ] = writeFile.mock.calls[0];
            expect(filePathMockCall).toEqual(filePath);
            expect(dataMockCall).toEqual(`missingId1\nmissingId2`)
            done();
        })
    })
})