import { chromium } from 'playwright';
import fs from 'fs-extra';
import path from 'path';

export interface CrawlResult {
  companyId: string;
  data: Record<string, number|string>;
  csvPath: string;
}

// Function to parse CSV data
const parseCSV = (csvContent: string): Record<string, number|string> => {
  const lines = csvContent.split('\n').filter(line => line.trim() !== '');
  const data: Record<string, number|string> = {};
  
  for (const line of lines) {
    // Skip the header line "公司基本資料"
    if (line.includes('公司基本資料')) continue;
    
    // Parse CSV line with quotes
    const match = line.match(/"([^"]+)","([^"]*)"/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      
      // Convert numeric values
      if (value && !isNaN(Number(value.replace(/[^\d.-]/g, '')))) {
        data[key] = Number(value.replace(/[^\d.-]/g, ''));
      } else {
        data[key] = value;
      }
    }
  }
  
  return data;
};

export const crawl = async (companyId: string): Promise<CrawlResult | null> => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto('https://mops.twse.com.tw/mops/#/web/t05st03', { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');

    // Wait for the input field to be available and type the company ID
    await page.waitForSelector('#companyId', { timeout: 60000 });
    await page.fill('#companyId', companyId);

    // Click the search button
    await page.click('#searchBtn');

    // Wait for the search results to load
    await page.waitForLoadState('networkidle');

    await page.waitForTimeout(1000);

    // Wait for the CSV download button to appear and click it
    await page.waitForSelector('button.csv', { timeout: 60000 });
    
    // Set up download path
    const downloadPath = '/tmp/domi/';
    await page.context().setDefaultTimeout(60000);
    
    // Start waiting for the download
    const downloadPromise = page.waitForEvent('download');
    
    // Click the CSV download button
    await page.click('button.csv');
    
    // Wait for the download to start
    const download = await downloadPromise;
    
    // Create the directory if it doesn't exist
    await fs.ensureDir(downloadPath);
    
    // Save the file to the specified path
    const fileName = `${companyId}_data.csv`;
    const csvFilePath = `${downloadPath}${fileName}`;
    await download.saveAs(csvFilePath);
    
    console.log(`CSV file downloaded to: ${csvFilePath}`);

    // Parse the CSV file
    const csvContent = await fs.readFile(csvFilePath, 'utf-8');
    const parsedData = parseCSV(csvContent);
    
    const result: CrawlResult = {
      companyId,
      data: parsedData,
      csvPath: csvFilePath
    };
    
    console.log(`Successfully parsed data for company ${companyId}`);
    return result;

  } catch (error) {
    console.error(`Error crawling company ${companyId}:`, error);
    return null;
  } finally {
    await browser.close();
  }
};

// Example usage:
const main = async () => {
  const result = await crawl('1101'); // Company ID 1101
  
  if (result) {
    console.log('Crawl Result:', JSON.stringify(result, null, 2));
    console.log('Company Name:', result.data['公司簡稱']);
    console.log('Industry:', result.data['產業類別']);
  } else {
    console.log('Failed to crawl company data');
  }
};

main().catch(console.error);
