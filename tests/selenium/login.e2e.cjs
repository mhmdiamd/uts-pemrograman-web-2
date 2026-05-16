const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

/**
 * Selenium E2E Test for Tugas Testing QA
 * 
 * Prerequisites:
 * 1. Chrome browser installed
 * 2. npm install selenium-webdriver chromedriver
 * 3. App running on http://localhost:5173 (npm run dev)
 */

async function runTest() {
    // 1. Setup Driver
    let options = new chrome.Options();
    // options.addArguments('--headless'); // Uncomment for headless mode

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        console.log('--- Starting Selenium Test ---');
        
        // 2. Navigate to App
        console.log('Navigating to http://localhost:5173...');
        await driver.get('http://localhost:5173');

        // 3. Login Test
        console.log('Step 1: Performing Login...');
        await driver.wait(until.elementLocated(By.id('username')), 10000);
        await driver.findElement(By.id('username')).sendKeys('admin');
        await driver.findElement(By.id('password')).sendKeys('admin123', Key.RETURN);

        // Wait for dashboard (check for header change)
        await driver.wait(until.elementLocated(By.css('header p')), 10000);
        let headerElement = await driver.findElement(By.css('header p'));
        
        // Wait until the text actually updates to the dashboard title
        await driver.wait(async () => {
            let text = await headerElement.getText();
            return text.includes('Manajemen Pendaftaran Mahasiswa');
        }, 10000, 'Timed out waiting for dashboard header text');

        let statusText = await headerElement.getText();
        console.log('Current Page Status:', statusText);

        if (statusText.includes('Manajemen Pendaftaran Mahasiswa')) {
            console.log('✅ Login Successful');
        } else {
            throw new Error(`❌ Login Failed: Unexpected header text. Got: "${statusText}"`);
        }

        // 4. Add Student Test
        console.log('Step 2: Adding a new student...');
        
        // Fill Form
        await driver.findElement(By.id('namaPendaftaran')).sendKeys('Selenium Test Student');
        await driver.findElement(By.id('asalSekolah')).sendKeys('Automated High School');
        await driver.findElement(By.id('tempatLahir')).sendKeys('Test City');
        await driver.findElement(By.id('tanggalLahir')).sendKeys('2000-01-01');
        
        // Set Scores
        await driver.findElement(By.id('nilaiMatematika')).clear();
        await driver.findElement(By.id('nilaiMatematika')).sendKeys('90');
        await driver.findElement(By.id('nilaiInggris')).clear();
        await driver.findElement(By.id('nilaiInggris')).sendKeys('85');
        await driver.findElement(By.id('nilaiUmum')).clear();
        await driver.findElement(By.id('nilaiUmum')).sendKeys('95');

        // Submit
        console.log('Submitting form...');
        await driver.findElement(By.css('button[type="submit"]')).click();

        // 5. Verify in Table
        console.log('Step 3: Verifying student in table...');
        await driver.wait(until.elementLocated(By.xpath("//td[contains(text(), 'Selenium Test Student')]")), 5000);
        console.log('✅ Student successfully added and verified in table');

        // 6. Delete Student Test
        console.log('Step 4: Testing delete functionality...');
        // Find the delete button for our student (it's in the same row)
        let deleteBtn = await driver.findElement(By.xpath("//tr[td[contains(text(), 'Selenium Test Student')]]//button[contains(@class, 'btn-icon-delete')]"));
        await deleteBtn.click();

        // Handle Alert
        await driver.wait(until.alertIsPresent(), 2000);
        let alert = await driver.switchTo().alert();
        console.log('Alert text:', await alert.getText());
        await alert.accept();

        console.log('✅ Delete successful');

        console.log('--- All Tests Passed! ---');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        console.log('Closing browser...');
        await driver.quit();
    }
}

runTest();
