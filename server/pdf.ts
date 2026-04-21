import type * as Puppeteer from "puppeteer";
import puppeteer from "puppeteer";
import { storagePut } from "./storage";

let browser: Puppeteer.Browser | null = null;

/**
 * Initialize Puppeteer browser instance
 */
async function getBrowser(): Promise<Puppeteer.Browser> {
  if (!browser) {
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    } catch (error) {
      console.error("Failed to launch Puppeteer:", error);
      throw new Error("PDF generation service unavailable");
    }
  }
  return browser;
}

/**
 * Generate PDF from HTML content
 * @param htmlContent HTML string to convert to PDF
 * @param fileName Name for the PDF file
 * @returns Object with PDF URL and S3 key
 */
export async function generatePDFFromHTML(
  htmlContent: string,
  fileName: string
): Promise<{ url: string; key: string }> {
  let page: Puppeteer.Page | null = null;

  try {
    const browser = await getBrowser();
    page = await browser.newPage();

    // Set page size for printing
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Generate PDF with print settings
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
      },
      printBackground: true,
      preferCSSPageSize: true,
    });

    // Upload to S3
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9-_]/g, "_");
    const key = `resumes/${sanitizedFileName}-${timestamp}.pdf`;

    const result = await storagePut(key, pdfBuffer, "application/pdf");

    return {
      url: result.url,
      key: result.key,
    };
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    throw new Error("Failed to generate PDF");
  } finally {
    if (page) {
      await page.close();
    }
  }
}

/**
 * Close Puppeteer browser (for cleanup)
 */
export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

/**
 * Generate resume PDF from resume data
 * @param resumeHTML HTML representation of the resume
 * @param resumeTitle Title of the resume for file naming
 * @returns Object with PDF URL and S3 key
 */
export async function generateResumePDF(
  resumeHTML: string,
  resumeTitle: string
): Promise<{ url: string; key: string }> {
  // Wrap the resume HTML with proper styling for PDF
  const styledHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.5;
          color: #333;
          background: white;
        }
        
        @page {
          size: A4;
          margin: 0.5in;
        }
        
        h1 {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        
        h2 {
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 12px;
          margin-bottom: 8px;
          border-bottom: 2px solid #333;
          padding-bottom: 4px;
        }
        
        h3 {
          font-size: 11px;
          font-weight: bold;
          margin-top: 8px;
          margin-bottom: 2px;
        }
        
        p, li {
          font-size: 10px;
          margin-bottom: 4px;
        }
        
        ul {
          margin-left: 20px;
          margin-bottom: 8px;
        }
        
        li {
          margin-bottom: 3px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 12px;
          border-bottom: 2px solid #333;
          padding-bottom: 8px;
        }
        
        .contact-info {
          font-size: 9px;
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 4px;
        }
        
        .section {
          margin-bottom: 12px;
        }
        
        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2px;
        }
        
        .job-title {
          font-weight: bold;
          font-size: 11px;
        }
        
        .job-date {
          font-size: 9px;
          color: #666;
        }
        
        .company {
          font-size: 10px;
          color: #666;
          margin-bottom: 4px;
        }
        
        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .skill-tag {
          display: inline-block;
          background: #f0f0f0;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 9px;
        }
        
        .page-break {
          page-break-after: always;
        }
      </style>
    </head>
    <body>
      ${resumeHTML}
    </body>
    </html>
  `;

  return generatePDFFromHTML(styledHTML, resumeTitle);
}
