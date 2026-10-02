const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Construct file URL
    const htmlPath = path.resolve('../multi_cloud_architecture_blueprint.html');
    const fileUrl = 'file://' + htmlPath;
    console.log('Opening:', fileUrl);

    // Wait until network is idle so scripts (marked/mermaid) can load
    await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 60000 });

    // Wait a bit extra to ensure mermaid rendering is complete
    console.log('Waiting for diagrams to render...');
    await new Promise(r => setTimeout(r, 5000)); 

    const pdfPath = path.resolve('../multi_cloud_architecture_blueprint.pdf');
    
    // Generate PDF
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true, // IMPORTANT: to keep the dark theme background
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    console.log('PDF successfully generated at:', pdfPath);
    await browser.close();
    
    // Cleanup HTML
    if(fs.existsSync(htmlPath)) {
        fs.unlinkSync(htmlPath);
        console.log('Cleaned up temp HTML file.');
    }

  } catch (error) {
    console.error('Error generating PDF:', error);
    process.exit(1);
  }
})();
