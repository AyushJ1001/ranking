import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export interface RankingData {
  rank: number;
  item: string;
  score: number;
}

export const exportToCSV = (data: RankingData[], filename: string = 'ranking') => {
  const csvContent = [
    ['Rank', 'Item', 'Score'],
    ...data.map(row => [row.rank.toString(), row.item, `${row.score}%`])
  ];
  
  const csvString = csvContent.map(row => 
    row.map(field => `"${field}"`).join(',')
  ).join('\n');
  
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (data: RankingData[], filename: string = 'ranking') => {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map(row => ({
      Rank: row.rank,
      Item: row.item,
      Score: `${row.score}%`
    }))
  );
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Rankings');
  
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportToImage = async (elementId: string, filename: string = 'ranking') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found');
    return;
  }
  
  // Store original styles to restore later
  const originalStyles = new Map();
  
  // Apply explicit styles for export to ensure visibility
  const applyExportStyles = (el: Element) => {
    const htmlEl = el as HTMLElement;
    originalStyles.set(el, {
      color: htmlEl.style.color,
      backgroundColor: htmlEl.style.backgroundColor,
      borderColor: htmlEl.style.borderColor
    });
    
    // Apply black text and proper borders for visibility
    htmlEl.style.color = '#000000';
    if (el.tagName === 'TABLE') {
      htmlEl.style.backgroundColor = '#ffffff';
      htmlEl.style.border = '1px solid #e2e8f0';
    }
    if (el.tagName === 'TH') {
      htmlEl.style.backgroundColor = '#f8fafc';
      htmlEl.style.color = '#000000';
      htmlEl.style.borderBottom = '1px solid #e2e8f0';
    }
    if (el.tagName === 'TD') {
      htmlEl.style.backgroundColor = '#ffffff';
      htmlEl.style.borderBottom = '1px solid #f1f5f9';
    }
    if (el.tagName === 'TR') {
      htmlEl.style.borderBottom = '1px solid #f1f5f9';
    }
  };
  
  // Apply styles to the element and all its children
  applyExportStyles(element);
  element.querySelectorAll('*').forEach(applyExportStyles);
  
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
    });
    
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL();
    link.click();
  } catch (error) {
    console.error('Error generating image:', error);
  } finally {
    // Restore original styles
    originalStyles.forEach((styles, el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.color = styles.color;
      htmlEl.style.backgroundColor = styles.backgroundColor;
      htmlEl.style.borderColor = styles.borderColor;
    });
    
    // Remove any explicitly set styles we added
    element.querySelectorAll('*').forEach(el => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.style.border === '1px solid #e2e8f0') htmlEl.style.border = '';
      if (htmlEl.style.borderBottom === '1px solid #e2e8f0' || htmlEl.style.borderBottom === '1px solid #f1f5f9') {
        htmlEl.style.borderBottom = '';
      }
    });
  }
};

export const exportToPDF = async (elementId: string, filename: string = 'ranking') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found');
    return;
  }
  
  // Store original styles to restore later
  const originalStyles = new Map();
  
  // Apply explicit styles for export to ensure visibility
  const applyExportStyles = (el: Element) => {
    const htmlEl = el as HTMLElement;
    originalStyles.set(el, {
      color: htmlEl.style.color,
      backgroundColor: htmlEl.style.backgroundColor,
      borderColor: htmlEl.style.borderColor
    });
    
    // Apply black text and proper borders for visibility
    htmlEl.style.color = '#000000';
    if (el.tagName === 'TABLE') {
      htmlEl.style.backgroundColor = '#ffffff';
      htmlEl.style.border = '1px solid #e2e8f0';
    }
    if (el.tagName === 'TH') {
      htmlEl.style.backgroundColor = '#f8fafc';
      htmlEl.style.color = '#000000';
      htmlEl.style.borderBottom = '1px solid #e2e8f0';
    }
    if (el.tagName === 'TD') {
      htmlEl.style.backgroundColor = '#ffffff';
      htmlEl.style.borderBottom = '1px solid #f1f5f9';
    }
    if (el.tagName === 'TR') {
      htmlEl.style.borderBottom = '1px solid #f1f5f9';
    }
  };
  
  // Apply styles to the element and all its children
  applyExportStyles(element);
  element.querySelectorAll('*').forEach(applyExportStyles);
  
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    // Restore original styles
    originalStyles.forEach((styles, el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.color = styles.color;
      htmlEl.style.backgroundColor = styles.backgroundColor;
      htmlEl.style.borderColor = styles.borderColor;
    });
    
    // Remove any explicitly set styles we added
    element.querySelectorAll('*').forEach(el => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.style.border === '1px solid #e2e8f0') htmlEl.style.border = '';
      if (htmlEl.style.borderBottom === '1px solid #e2e8f0' || htmlEl.style.borderBottom === '1px solid #f1f5f9') {
        htmlEl.style.borderBottom = '';
      }
    });
  }
};