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


export const collectAll = async (companyId_list: Array<string>): Promise<CommpanyList> => {
    const companyList: Array<CrawlResult> = [];
    for (const companyId of companyId_list) {
        const crawlResult = await crawl(companyId);
        if (!crawlResult) continue;
        companyList.push(crawlResult);
    }
    return new CommpanyList(companyList);
}


// Example usage:
const main = async () => {
    const result = await collectAll(['1101', '2301']); // Company IDs
    
    // Save all company data to a CSV file
    result.saveToCsv('/tmp/domi/output/all_companies.csv');
};

main().catch(console.error);