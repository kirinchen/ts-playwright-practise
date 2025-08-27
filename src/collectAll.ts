import { crawl, CrawlResult } from "./crawler";
import fs from 'fs-extra';

export class CommpanyList {
    companyList: Array<CrawlResult>;

    constructor(companyList: Array<CrawlResult>) {
        this.companyList = companyList;
    }

    public saveToCsv(path: string): void {
        if (this.companyList.length === 0) {
            console.log('No company data to save');
            return;
        }

        // Get all unique keys from all company data
        const allKeys = new Set<string>();
        this.companyList.forEach(company => {
            Object.keys(company.data).forEach(key => allKeys.add(key));
        });

        // Convert Set to Array and sort for consistent column order
        const columnNames = Array.from(allKeys).sort();

        // Create CSV header
        const csvHeader = ['companyId', ...columnNames].join(',');

        // Create CSV rows
        const csvRows = this.companyList.map(company => {
            const row = [company.companyId];
            columnNames.forEach(key => {
                const value = company.data[key] || '';
                // Convert to string and escape commas and quotes in the value
                const stringValue = String(value);
                const escapedValue = stringValue.includes(',') || stringValue.includes('"')
                    ? `"${stringValue.replace(/"/g, '""')}"`
                    : stringValue;
                row.push(escapedValue);
            });
            return row.join(',');
        });

        // Combine header and rows
        const csvContent = [csvHeader, ...csvRows].join('\n');

        // Ensure directory exists and save file
        fs.ensureDirSync(path.substring(0, path.lastIndexOf('/')));
        fs.writeFileSync(path, csvContent, 'utf-8');

        console.log(`CSV file saved to: ${path}`);
        console.log(`Total companies: ${this.companyList.length}`);
        console.log(`Total columns: ${columnNames.length}`);
    }
}

const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};


export const collectAll = async (companyId_list: Array<string>): Promise<CommpanyList> => {
    const companyList: Array<CrawlResult> = [];
    for (const companyId of companyId_list) {
        try {
            console.log(`Processing company ID: ${companyId}`);
            const crawlResult = await crawl(companyId);
            if (!crawlResult) {
                console.log(`No data found for company ID: ${companyId}`);
                continue;
            }
            companyList.push(crawlResult);
            console.log(`Successfully processed company ID: ${companyId}`);
        } catch (error) {
            console.error(`Error processing company ID ${companyId}:`, error);
        }
        await sleep(2000);
    }
    return new CommpanyList(companyList);
}



// Example usage:
const main = async () => {
    const result = await collectAll([
        '6945',
        '6549',
        '6940',
        '7583',
        '6543',
        '1594',
        '5863',
        '6939',
        '6938',
        '6935',
        '6934',
        '6932',
        '7578',
        '7610',
        '1623',
        '6539',
        '6898',
        '5859',
        '7575',
        '6536',
        '6892',
        '6891',
        '6493',
        '4773',
        '7607',
        '6927',
        '6926',
        '6920',
        '7566',
        '6886',
        '2256',
        '6884',
        '2255',
        '6883',
        '7562',
        '6882',
        '7561',
        '2252',
        '6483',
        '4765',
        '8999',
        '6917',
        '6915',
        '2644',
        '6912',
        '6879',
        '6911',
        '7558',
        '6878',
        '6910',
        '6518',
        '2249',
        '6876',
        '2245',
        '7551',
        '6474',
        '6473',
        '3678',
        '6908',
        '6868',
        '6867',
        '2237',
        '6864',
        '6467',
        '6858',
        '6857',
        '7530',
        '6850',
        '4738',
        '4732',
        '3659',
        '6849',
        '6848',
        '6847',
        '6842',
        '4724',
        '6839',
        '7516',
        '6833',
        '6832',
        '6831',
        '6798',
        '6797',
        '6434',
        '6793',
        '1480',
        '6035',
        '3633',
        '7507',
        '6827',
        '3595',
        '6826',
        '6825',
        '6820',
        '6428',
        '6787',
        '6786',
        '6784',
        '6780',
        '6028',
        '6027',
        '2942',
        '6819',
        '2940',
        '6818',
        '6817',
        '3585',
        '6816',
        '6815',
        '6814',
        '7850',
        '6812',
        '6810',
        '7455',
        '6775',
        '3184',
        '8098',
        '2938',
        '3616',
        '7849',
        '5297',
        '7848',
        '7847',
        '7846',
        '6808',
        '7843',
        '7842',
        '7841',
        '7840',
        '6407',
        '6764',
        '7443',
        '6403',
        '9957',
        '3603',
        '7839',
        '7837',
        '7836',
        '7834',
        '7833',
        '7832',
        '8119',
        '7831',
        '7799',
        '7797',
        '7796',
        '6758',
        '7795',
        '7794',
        '6755',
        '7792',
        '7791',
        '7790',
        '6750',
        '7829',
        '7828',
        '7827',
        '7826',
        '7825',
        '5271',
        '7822',
        '7821',
        '7789',
        '4590',
        '7820',
        '7788',
        '4197',
        '7786',
        '3158',
        '6748',
        '7427',
        '7785',
        '4195',
        '4194',
        '7783',
        '8102',
        '7782',
        '6744',
        '7781',
        '7780',
        '2072',
        '2071',
        '4589',
        '4980',
        '7819',
        '5267',
        '7818',
        '4587',
        '7816',
        '4585',
        '7815',
        '7814',
        '5262',
        '7813',
        '4582',
        '7812',
        '8458',
        '7811',
        '7779',
        '7810',
        '7419',
        '7777',
        '7776',
        '4186',
        '6738',
        '6737',
        '7773',
        '6734',
        '7772',
        '8058',
        '7770',
        '6699',
        '6730',
        '1780',
        '6696',
        '7808',
        '7806',
        '4575',
        '5254',
        '7805',
        '4573',
        '7803',
        '7801',
        '4570',
        '7769',
        '4178',
        '7768',
        '6729',
        '7767',
        '7765',
        '7764',
        '6725',
        '7763',
        '4172',
        '7762',
        '6723',
        '7761',
        '4170',
        '6722',
        '7760',
        '3097',
        '6682',
        '5248',
        '5246',
        '4565',
        '5240',
        '4169',
        '7759',
        '7758',
        '7757',
        '7756',
        '3485',
        '7754',
        '7752',
        '7750',
        '6677',
        '6676',
        '6673',
        '4559',
        '6272',
        '4553',
        '7748',
        '6709',
        '3117',
        '6707',
        '7744',
        '6705',
        '3473',
        '6704',
        '7742',
        '4150',
        '6665',
        '4546',
        '4544',
        '7738',
        '7737',
        '7731',
        '7730',
        '6652',
        '6650',
        '1343',
        '4537',
        '7729',
        '7726',
        '7725',
        '7724',
        '4132',
        '6648',
        '4925',
        '1293',
        '7719',
        '7716',
        '8359',
        '7711',
        '6999',
        '6639',
        '2761',
        '6638',
        '2760',
        '6995',
        '6634',
        '6599',
        '6990',
        '6595',
        '7707',
        '4117',
        '7706',
        '2758',
        '4115',
        '7702',
        '8345',
        '2750',
        '6987',
        '6986',
        '6984',
        '6983',
        '6622',
        '6621',
        '6980',
        '6620',
        '6586',
        '5547',
        '6583',
        '6580',
        '1271',
        '6979',
        '2741',
        '6618',
        '6977',
        '6976',
        '6614',
        '6973',
        '8298',
        '6972',
        '6971',
        '6610',
        '1269',
        '6572',
        '1260',
        '8329',
        '2733',
        '6963',
        '6961',
        '6565',
        '6564',
        '6563',
        '4441',
        '6959',
        '6559',
        '7595',
        '6555',
        '7590',
        '4431',
        '6947',
        '6946'
    ]); // Company IDs

    // Save all company data to a CSV file
    result.saveToCsv('/tmp/domi/output/all_companies.csv');
};

main().catch(console.error);