const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

/**
 * Selenium Comprehensive E2E Test Suite (32 Cases)
 * Optimized for Mocha + Mochawesome UI Reporting.
 * Version 1.3 - Stability & Window Size Fixes
 */

const APP_URL = process.env.APP_URL || 'http://localhost:5173';

describe('Selenium E2E Test Suite - Tugas Testing QA', function() {
    this.timeout(60000); 
    let driver;

    before(async () => {
        let options = new chrome.Options();
        options.addArguments('--headless'); // Temporarily enabled
        options.addArguments('--window-size=1200,800'); 
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        
        if (!fs.existsSync('tests/selenium/screenshots')) {
            fs.mkdirSync('tests/selenium/screenshots', { recursive: true });
        }
    });

    afterEach(async function() {
        if (this.currentTest.state === 'failed') {
            let name = this.currentTest.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            let screenshot = await driver.takeScreenshot();
            fs.writeFileSync(path.join('tests/selenium/screenshots', `failed_${name}.png`), screenshot, 'base64');
        }
    });

    after(async () => {
        if (driver) await driver.quit();
    });

    // --- Robust Login Helper ---
    async function ensureLoggedIn() {
        await driver.get(APP_URL);
        let loginFields = await driver.findElements(By.id('username'));
        if (loginFields.length > 0) {
            await driver.findElement(By.id('username')).sendKeys('admin');
            await driver.findElement(By.id('password')).sendKeys('admin123', Key.RETURN);
            await driver.wait(until.elementLocated(By.css('header p')), 10000);
        }
    }

    // --- Helper to clear all data ---
    async function clearAllStudents() {
        await ensureLoggedIn();
        let deleteButtons = await driver.findElements(By.className('btn-icon-delete'));
        while (deleteButtons.length > 0) {
            try {
                await deleteButtons[0].click();
                await driver.wait(until.alertIsPresent(), 2000);
                await driver.switchTo().alert().accept();
                await driver.wait(until.stalenessOf(deleteButtons[0]), 5000);
                deleteButtons = await driver.findElements(By.className('btn-icon-delete'));
            } catch (e) {
                deleteButtons = await driver.findElements(By.className('btn-icon-delete'));
            }
        }
    }

    describe('1. Authentication Module (10 Cases)', () => {
        before(async () => await driver.get(APP_URL));

        it('1. should show login page title by default', async () => {
            let titleEl = await driver.wait(until.elementLocated(By.css('.auth-header h2')), 5000);
            await driver.wait(async () => (await titleEl.getText()).length > 0, 2000);
            let title = await titleEl.getText();
            assert.strictEqual(title, 'Masuk');
        });

        it('2. should switch to Forgot Password view', async () => {
            await driver.findElement(By.className('auth-link')).click();
            await driver.wait(until.elementLocated(By.xpath("//h2[text()='Lupa Password']")), 2000);
        });

        it('3. should switch back to Login view', async () => {
            await driver.findElement(By.className('auth-link')).click();
            await driver.wait(until.elementLocated(By.xpath("//h2[text()='Masuk']")), 2000);
        });

        it('4. should show error for empty username', async () => {
            await driver.findElement(By.css('button[type="submit"]')).click();
            let error = await driver.wait(until.elementLocated(By.xpath("//span[contains(text(), 'Username minimal 3 karakter')]")), 2000);
            assert.ok(await error.isDisplayed());
        });

        it('5. should show error for short username', async () => {
            await driver.findElement(By.id('username')).sendKeys('ab');
            await driver.findElement(By.css('button[type="submit"]')).click();
            let error = await driver.wait(until.elementLocated(By.xpath("//span[contains(text(), 'Username minimal 3 karakter')]")), 2000);
            assert.ok(await error.isDisplayed());
            await driver.findElement(By.id('username')).clear();
        });

        it('6. should show error for empty password', async () => {
            await driver.findElement(By.id('username')).clear();
            await driver.findElement(By.id('username')).sendKeys('admin');
            await driver.findElement(By.css('button[type="submit"]')).click();
            let error = await driver.wait(until.elementLocated(By.xpath("//span[contains(text(), 'Password minimal 6 karakter')]")), 2000);
            assert.ok(await error.isDisplayed());
        });

        it('7. should show error for short password', async () => {
            await driver.findElement(By.id('password')).sendKeys('123');
            await driver.findElement(By.css('button[type="submit"]')).click();
            let error = await driver.wait(until.elementLocated(By.xpath("//span[contains(text(), 'Password minimal 6 karakter')]")), 2000);
            assert.ok(await error.isDisplayed());
            await driver.findElement(By.id('password')).clear();
        });

        it('8. should show error for invalid credentials', async () => {
            await driver.findElement(By.id('username')).clear();
            await driver.findElement(By.id('username')).sendKeys('wrong');
            await driver.findElement(By.id('password')).clear();
            await driver.findElement(By.id('password')).sendKeys('wrongpass', Key.RETURN);
            
            // Wait for toast and verify text specifically
            let toastEl = await driver.wait(until.elementLocated(By.className('toast')), 5000);
            await driver.wait(async () => (await toastEl.getText()).length > 0, 2000);
            let toastText = await toastEl.getText();
            assert.ok(toastText.includes('Username atau password salah'));
        });

        it('9. should login successfully with admin/admin123', async () => {
            await driver.findElement(By.id('username')).clear();
            await driver.findElement(By.id('username')).sendKeys('admin');
            await driver.findElement(By.id('password')).clear();
            await driver.findElement(By.id('password')).sendKeys('admin123', Key.RETURN);
            await driver.wait(until.elementLocated(By.css('header p')), 5000);
            let header = await driver.findElement(By.css('header p')).getText();
            assert.ok(header.includes('Manajemen Pendaftaran Mahasiswa'));
        });

        it('10. should show successful login toast', async () => {
            let toastEl = await driver.wait(until.elementLocated(By.className('toast')), 5000);
            let toastText = await toastEl.getText();
            assert.ok(toastText.includes('Selamat datang'));
        });
    });

    describe('2. Student Form Validation (8 Cases)', () => {
        before(async () => await ensureLoggedIn());

        it('11. should show error for short student name', async () => {
            await driver.findElement(By.id('namaPendaftaran')).sendKeys('Ab');
            await driver.findElement(By.css('button[type="submit"]')).click();
            let error = await driver.wait(until.elementLocated(By.xpath("//span[contains(text(), 'Nama minimal 3 karakter')]")), 2000);
            assert.ok(await error.isDisplayed());
            await driver.findElement(By.id('namaPendaftaran')).clear();
        });

        it('12. should show error for short asal sekolah', async () => {
            await driver.findElement(By.id('asalSekolah')).sendKeys('Ab');
            await driver.findElement(By.css('button[type="submit"]')).click();
            let error = await driver.wait(until.elementLocated(By.xpath("//span[contains(text(), 'Asal sekolah minimal 3 karakter')]")), 2000);
            assert.ok(await error.isDisplayed());
            await driver.findElement(By.id('asalSekolah')).clear();
        });

        it('13. should show error for short tempat lahir', async () => {
            await driver.findElement(By.id('tempatLahir')).sendKeys('A');
            await driver.findElement(By.css('button[type="submit"]')).click();
            let error = await driver.wait(until.elementLocated(By.xpath("//span[contains(text(), 'Tempat lahir minimal 2 karakter')]")), 2000);
            assert.ok(await error.isDisplayed());
            await driver.findElement(By.id('tempatLahir')).clear();
        });

        it('14. should validate score cannot be > 100', async () => {
            let mat = await driver.findElement(By.id('nilaiMatematika'));
            await mat.clear();
            await mat.sendKeys('101');
            await driver.findElement(By.css('button[type="submit"]')).click();
            let validity = await mat.getAttribute('validationMessage');
            assert.ok(validity.length > 0 || (await driver.findElements(By.className('error-text'))).length > 0);
        });

        it('15. should validate score cannot be < 0', async () => {
            let mat = await driver.findElement(By.id('nilaiMatematika'));
            await mat.clear();
            await mat.sendKeys('-1');
            await driver.findElement(By.css('button[type="submit"]')).click();
            let validity = await mat.getAttribute('validationMessage');
            assert.ok(validity.length > 0 || (await driver.findElements(By.className('error-text'))).length > 0);
            await mat.clear();
            await mat.sendKeys('0');
        });

        it('16. should update Generated Code when switching to Viktor', async () => {
            let select = await driver.findElement(By.id('tempatTesKey'));
            await select.findElement(By.css('option[value="V"]')).click();
            let code = await driver.findElement(By.xpath("//div[contains(text(), 'Generated Code:')]//strong")).getText();
            assert.ok(code.startsWith('V'));
        });

        it('17. should update Generated Code when switching to Gedung B', async () => {
            let select = await driver.findElement(By.id('tempatTesKey'));
            await select.findElement(By.css('option[value="B"]')).click();
            let code = await driver.findElement(By.xpath("//div[contains(text(), 'Generated Code:')]//strong")).getText();
            assert.ok(code.startsWith('B'));
        });

        it('18. should clear form when clicking BATAL', async () => {
            await driver.findElement(By.id('namaPendaftaran')).sendKeys('Should Clear');
            await driver.findElement(By.xpath("//button[text()='BATAL']")).click();
            let val = await driver.findElement(By.id('namaPendaftaran')).getAttribute('value');
            assert.strictEqual(val, '');
        });
    });

    describe('3. CRUD & Persistence (8 Cases)', () => {
        before(async () => await ensureLoggedIn());

        it('19. should add student with Lulus status (Avg >= 70)', async () => {
            await driver.findElement(By.id('namaPendaftaran')).sendKeys('Student Lulus');
            await driver.findElement(By.id('asalSekolah')).sendKeys('SMA Lulus');
            await driver.findElement(By.id('tempatLahir')).sendKeys('Jakarta');
            await driver.findElement(By.id('tanggalLahir')).sendKeys('2005-01-01');
            await driver.findElement(By.id('nilaiMatematika')).clear();
            await driver.findElement(By.id('nilaiMatematika')).sendKeys('80');
            await driver.findElement(By.id('nilaiInggris')).clear();
            await driver.findElement(By.id('nilaiInggris')).sendKeys('80');
            await driver.findElement(By.id('nilaiUmum')).clear();
            await driver.findElement(By.id('nilaiUmum')).sendKeys('80');
            await driver.findElement(By.css('button[type="submit"]')).click();
            
            let status = await driver.wait(until.elementLocated(By.xpath("//tr[td[contains(text(), 'Student Lulus')]]//span")), 5000).getText();
            assert.strictEqual(status, 'Lulus');
        });

        it('20. should add student with Cadangan status (Avg 60-69)', async () => {
            await driver.findElement(By.id('namaPendaftaran')).sendKeys('Student Cadangan');
            await driver.findElement(By.id('asalSekolah')).sendKeys('SMA Cadangan');
            await driver.findElement(By.id('tempatLahir')).sendKeys('Bandung');
            await driver.findElement(By.id('tanggalLahir')).sendKeys('2005-01-01');
            await driver.findElement(By.id('nilaiMatematika')).clear();
            await driver.findElement(By.id('nilaiMatematika')).sendKeys('65');
            await driver.findElement(By.id('nilaiInggris')).clear();
            await driver.findElement(By.id('nilaiInggris')).sendKeys('65');
            await driver.findElement(By.id('nilaiUmum')).clear();
            await driver.findElement(By.id('nilaiUmum')).sendKeys('65');
            await driver.findElement(By.css('button[type="submit"]')).click();
            
            let status = await driver.wait(until.elementLocated(By.xpath("//tr[td[contains(text(), 'Student Cadangan')]]//span")), 5000).getText();
            assert.strictEqual(status, 'Cadangan');
        });

        it('21. should add student with Tidak Lulus status (Avg < 60)', async () => {
            await driver.findElement(By.id('namaPendaftaran')).sendKeys('Student Gagal');
            await driver.findElement(By.id('asalSekolah')).sendKeys('SMA Gagal');
            await driver.findElement(By.id('tempatLahir')).sendKeys('Surabaya');
            await driver.findElement(By.id('tanggalLahir')).sendKeys('2005-01-01');
            await driver.findElement(By.id('nilaiMatematika')).clear();
            await driver.findElement(By.id('nilaiMatematika')).sendKeys('50');
            await driver.findElement(By.id('nilaiInggris')).clear();
            await driver.findElement(By.id('nilaiInggris')).sendKeys('50');
            await driver.findElement(By.id('nilaiUmum')).clear();
            await driver.findElement(By.id('nilaiUmum')).sendKeys('50');
            await driver.findElement(By.css('button[type="submit"]')).click();
            
            let status = await driver.wait(until.elementLocated(By.xpath("//tr[td[contains(text(), 'Student Gagal')]]//span")), 5000).getText();
            assert.strictEqual(status, 'Tidak Lulus');
        });

        it('22. should edit student and update status automatically', async () => {
            let editBtn = await driver.findElement(By.xpath("//tr[td[contains(text(), 'Student Gagal')]]//button[contains(@class, 'btn-icon-edit')]"));
            await editBtn.click();
            await driver.findElement(By.id('nilaiMatematika')).clear();
            await driver.findElement(By.id('nilaiMatematika')).sendKeys('100');
            await driver.findElement(By.id('nilaiInggris')).clear();
            await driver.findElement(By.id('nilaiInggris')).sendKeys('100');
            await driver.findElement(By.id('nilaiUmum')).clear();
            await driver.findElement(By.id('nilaiUmum')).sendKeys('100');
            await driver.findElement(By.xpath("//button[text()='UPDATE']")).click();
            
            let status = await driver.wait(until.elementLocated(By.xpath("//tr[td[contains(text(), 'Student Gagal')]]//span")), 5000).getText();
            assert.strictEqual(status, 'Lulus');
        });

        it('23. should persist data after page refresh', async () => {
            await driver.navigate().refresh();
            await driver.wait(until.elementLocated(By.xpath("//td[contains(text(), 'Student Lulus')]")), 5000);
            let exists = await driver.findElements(By.xpath("//td[contains(text(), 'Student Lulus')]"));
            assert.strictEqual(exists.length, 1);
        });

        it('24. should not delete student if alert is cancelled', async () => {
            let deleteBtn = await driver.findElement(By.xpath("//tr[td[contains(text(), 'Student Lulus')]]//button[contains(@class, 'btn-icon-delete')]"));
            await deleteBtn.click();
            await driver.wait(until.alertIsPresent(), 2000);
            await driver.switchTo().alert().dismiss();
            let exists = await driver.findElements(By.xpath("//td[contains(text(), 'Student Lulus')]"));
            assert.strictEqual(exists.length, 1);
        });

        it('25. should delete student successfully after confirmation', async () => {
            let deleteBtn = await driver.findElement(By.xpath("//tr[td[contains(text(), 'Student Lulus')]]//button[contains(@class, 'btn-icon-delete')]"));
            await deleteBtn.click();
            await driver.wait(until.alertIsPresent(), 2000);
            await driver.switchTo().alert().accept();
            await driver.wait(until.stalenessOf(deleteBtn), 5000);
            let exists = await driver.findElements(By.xpath("//td[contains(text(), 'Student Lulus')]"));
            assert.strictEqual(exists.length, 0);
        });

        it('26. should show empty table message when all data is deleted', async () => {
            await clearAllStudents();
            let emptyMsg = await driver.wait(until.elementLocated(By.xpath("//td[contains(text(), 'Belum ada data')]")), 5000).getText();
            assert.strictEqual(emptyMsg, 'Belum ada data.');
        });
    });

    describe('4. UI/UX & Stats (6 Cases)', () => {
        before(async () => {
            await ensureLoggedIn();
            await clearAllStudents();
        });

        it('27. should show initial statistics as 0', async () => {
            let total = await driver.findElement(By.xpath("//div[div[text()='Total']]/div[contains(@class, 'stat-value')]")).getText();
            assert.strictEqual(total, '0');
        });

        it('28. should update total count when adding a student', async () => {
            await driver.findElement(By.id('namaPendaftaran')).sendKeys('Final Tester');
            await driver.findElement(By.id('asalSekolah')).sendKeys('Final High');
            await driver.findElement(By.id('tempatLahir')).sendKeys('Jakarta');
            await driver.findElement(By.id('tanggalLahir')).sendKeys('2000-01-01');
            await driver.findElement(By.css('button[type="submit"]')).click();
            
            await driver.wait(async () => {
                let total = await driver.findElement(By.xpath("//div[div[text()='Total']]/div[contains(@class, 'stat-value')]")).getText();
                return total === '1';
            }, 5000);
        });

        it('29. should show correct user name in NavBar', async () => {
            let navName = await driver.findElement(By.css('.user-profile div:first-child + div div:first-child')).getText();
            assert.strictEqual(navName, 'Administrator');
        });

        it('30. should show correct credits in footer', async () => {
            let footer = await driver.wait(until.elementLocated(By.className('footer')), 5000);
            let text = await footer.getText();
            assert.ok(text.includes('Muhamad Ilham & Oktavianus'));
        });

        it('31. should perform successful logout and clear session', async () => {
            let logoutBtn = await driver.wait(until.elementLocated(By.css('.logout-btn')), 5000);
            await driver.executeScript("arguments[0].click();", logoutBtn); // JS click for maximum reliability
            
            await driver.wait(until.elementLocated(By.xpath("//h2[text()='Masuk']")), 10000);
            let user = await driver.executeScript("return localStorage.getItem('current_user')");
            assert.strictEqual(user, null, 'LocalStorage was not cleared after logout');
        });
    });
});
