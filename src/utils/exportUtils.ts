import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export interface RankingData {
  rank: number;
  item: string;
  score: number;
}

// Helper function to apply export styles to an element and store original styles
const applyExportStylesWithStorage = (element: Element, originalStyles: Map<Element, any>) => {
  const htmlEl = element as HTMLElement;
  originalStyles.set(element, {
    color: htmlEl.style.color,
    backgroundColor: htmlEl.style.backgroundColor,
    borderColor: htmlEl.style.borderColor
  });
  
  // Apply black text and proper borders for visibility
  htmlEl.style.color = '#000000';
  if (element.tagName === 'TABLE') {
    htmlEl.style.backgroundColor = '#ffffff';
    htmlEl.style.border = '1px solid #e2e8f0';
  }
  if (element.tagName === 'TH') {
    htmlEl.style.backgroundColor = '#f8fafc';
    htmlEl.style.color = '#000000';
    htmlEl.style.borderBottom = '1px solid #e2e8f0';
  }
  if (element.tagName === 'TD') {
    htmlEl.style.backgroundColor = '#ffffff';
    htmlEl.style.borderBottom = '1px solid #f1f5f9';
  }
  if (element.tagName === 'TR') {
    htmlEl.style.borderBottom = '1px solid #f1f5f9';
  }
};

// Helper function to apply export styles to element and all its children
const applyExportStyles = (element: Element): Map<Element, any> => {
  const originalStyles = new Map();
  
  // Apply styles to the element and all its children
  applyExportStylesWithStorage(element, originalStyles);
  element.querySelectorAll('*').forEach(child => 
    applyExportStylesWithStorage(child, originalStyles)
  );
  
  return originalStyles;
};

// Helper function to restore original styles
const restoreOriginalStyles = (element: Element, originalStyles: Map<Element, any>) => {
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
};

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
  URL.revokeObjectURL(url);
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
  
  // Apply export styles and store original styles
  const originalStyles = applyExportStyles(element);
  
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
    restoreOriginalStyles(element, originalStyles);
  }
};

export const exportToPDF = async (elementId: string, filename: string = 'ranking') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found');
    return;
  }
  
  // Apply export styles and store original styles
  const originalStyles = applyExportStyles(element);
  
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
    restoreOriginalStyles(element, originalStyles);
  }
};