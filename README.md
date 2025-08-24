# Taiwan Company Profile Crawler (Playwright Edition)

This project is a web crawler built with TypeScript and Playwright to scrape company profile data from the Market Observation Post System (MOPS) of the Taiwan Stock Exchange (TWSE).

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/web_crawler.git
   cd web_crawler
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Usage

1. Open the `src/crawler.ts` file and change the company ID in the `crawl()` function call at the bottom of the file.

   ```typescript
   // Example usage:
   crawl('2330'); // Change '2330' to the desired company ID
   ```

2. Run the crawler:
   ```bash
   npm start
   ```

3. The crawler will create a JSON file named `<companyId>_profile.json` in the root directory of the project.
