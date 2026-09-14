/**
 * Commercial Quote Parser & Redactor
 */
class DataRedactor {
  constructor() {
    this.patterns = [
      { name: "Payment Terms (Net 30/60/90)", regex: /net\s*(15|30|45|60|90)|prepayment|due upon receipt/gi },
      { name: "Incoterms / Freight Terms", regex: /(EXW|FOB|DDP|CIF|FCA|DAP)/gi },
      { name: "Tooling / NRE Fee Specified", regex: /(tooling|NRE|non-recurring engineering|fixture fee|mold cost)/gi },
      { name: "Minimum Order Quantity (MOQ)", regex: /(MOQ|minimum order quantity|min order)/gi },
      { name: "Lead Time / Delivery Schedule", regex: /(lead time|delivery schedule|ARO|weeks ARO|turnaround time)/gi },
      { name: "Warranty Term", regex: /(warranty|guarantee|\d+\s*(month|year)\s*warranty)/gi }
    ];
  }

  processText(text) {
    let flagsFound = [];
    this.patterns.forEach(p => {
      if (p.regex.test(text)) {
        flagsFound.push(p.name);
      }
    });

    let redactedText = text
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED EMAIL]')
      .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[REDACTED PHONE]');

    return {
      flagsFound,
      redactedText
    };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const redactor = new DataRedactor();
  const fileInput = document.getElementById('fileInput');
  const dropzone = document.getElementById('dropzone');
  const resultsCard = document.getElementById('resultsCard');
  const flagsContainer = document.getElementById('flagsContainer');
  const redactedOutput = document.getElementById('redactedOutput');
  const autofillBanner = document.getElementById('autofillBanner');
  const downloadTemplateLink = document.getElementById('downloadTemplateLink');

  if (downloadTemplateLink) {
    downloadTemplateLink.addEventListener('click', (e) => {
      e.preventDefault();
      const templateText =
"COMMERCIAL QUOTE INTAKE TEMPLATE\n" +
"---------------------------------\n" +
"Fill in what you know below. Leave anything unknown blank -- do not guess just to fill a field.\n" +
"Save this file, then upload it on the site to auto-fill the Custom Part Quote Audit tool.\n\n" +
"MATERIAL: \n" +
"UNIT PRICE: $\n" +
"SETUP: $\n" +
"TOOLING: $\n" +
"QUANTITY: \n" +
"PAYMENT TERMS: (e.g. Net 30)\n" +
"INCOTERM: (e.g. FOB, DDP)\n" +
"LEAD TIME: (e.g. 6 weeks ARO)\n" +
"WARRANTY: (e.g. 12 months)\n";
      const blob = new Blob([templateText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'commercial-quote-template.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener('click', () => fileInput.click());

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      fileInput.files = e.dataTransfer.files;
      handleFileSelect(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  });

  async function handleFileSelect(file) {
    let extractedText = "";

    try {
      if (file.type === "application/pdf" || file.name.endsWith('.pdf')) {
        extractedText = await extractTextFromPDF(file);
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith('.docx')) {
        extractedText = await extractTextFromDOCX(file);
      } else {
        extractedText = await file.text();
      }

      const result = redactor.processText(extractedText);
      displayResults(result);
      parseAndPopulateQuoteData(extractedText);

    } catch (error) {
      alert("Error reading document: " + error.message);
      console.error(error);
    }
  }

  async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(" ");
      fullText += `--- Page ${pageNum} ---\n` + pageText + "\n\n";
    }

    return fullText;
  }

  async function extractTextFromDOCX(file) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    return result.value;
  }

  function parseAndPopulateQuoteData(text) {
    const unitPriceMatch = text.match(/(?:unit\s*price|piece\s*price|ea\.?|price\/unit)[\:\$\s]*([\d\.,]+)/i);
    const setupMatch = text.match(/(?:setup|set-up|fixture\s*setup)[\:\$\s]*([\d\.,]+)/i);
    const toolingMatch = text.match(/(?:tooling|nre|non-recurring|fixture\s*cost)[\:\$\s]*([\d\.,]+)/i);
    const qtyMatch = text.match(/(?:quantity|qty|moq|order\s*size)[\:\s]*([\d\.,]+)/i);
    const materialMatch = text.match(/(?:material|alloy|substrate)[\:\s]*([a-zA-Z0-9\-\s]+)/i);

    const filledFieldIds = [];

    if (unitPriceMatch && document.getElementById('cp-base-unit')) {
      document.getElementById('cp-base-unit').value = unitPriceMatch[1].replace(/,/g, '');
      filledFieldIds.push('cp-base-unit');
    }
    if (setupMatch && document.getElementById('cp-setup')) {
      document.getElementById('cp-setup').value = setupMatch[1].replace(/,/g, '');
      filledFieldIds.push('cp-setup');
    }
    if (toolingMatch && document.getElementById('cp-tooling')) {
      document.getElementById('cp-tooling').value = toolingMatch[1].replace(/,/g, '');
      filledFieldIds.push('cp-tooling');
    }
    if (qtyMatch && document.getElementById('cp-qty')) {
      document.getElementById('cp-qty').value = qtyMatch[1].replace(/,/g, '');
      filledFieldIds.push('cp-qty');
    }
    if (materialMatch && document.getElementById('cp-material')) {
      document.getElementById('cp-material').value = materialMatch[1].trim();
      filledFieldIds.push('cp-material');
    }

    // Clear any previous highlights, then mark exactly which fields this upload actually touched.
    ['cp-base-unit', 'cp-setup', 'cp-tooling', 'cp-qty', 'cp-material'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('auto-filled');
    });
    filledFieldIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('auto-filled');
    });

    if (autofillBanner) {
      autofillBanner.classList.toggle('hidden', filledFieldIds.length === 0);
    }

    if (typeof calculateCustomPartBreakdown === 'function') {
      calculateCustomPartBreakdown();
    }
  }

  function displayResults(result) {
    if (resultsCard) resultsCard.classList.remove('hidden');
    
    if (flagsContainer) {
      flagsContainer.innerHTML = '';
      if (result.flagsFound.length === 0) {
        flagsContainer.innerHTML = '<span style="color:var(--text-dim);">No specific commercial terms automatically identified.</span>';
      } else {
        flagsContainer.innerHTML = '<strong>Identified Commercial Terms &amp; Provisions:</strong><br>';
        result.flagsFound.forEach(flag => {
          const badge = document.createElement('span');
          badge.className = 'flag-badge';
          badge.textContent = `📋 ${flag}`;
          flagsContainer.appendChild(badge);
        });
      }
    }

    if (redactedOutput) {
      redactedOutput.textContent = result.redactedText.substring(0, 3000) + 
        (result.redactedText.length > 3000 ? '\n\n[... Truncated Preview ...]' : '');
    }
  }
});