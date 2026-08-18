import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Helper to read file as ArrayBuffer
const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

// Helper to read file as text
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

// Convert CSV to Excel
export const csvToExcel = async (file: File): Promise<void> => {
  const text = await readFileAsText(file);
  const workbook = XLSX.read(text, { type: 'string' });
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const fileName = file.name.replace(/\.[^/.]+$/, '');
  saveAs(blob, `${fileName}.xlsx`);
};

// Convert Excel to CSV
export const excelToCsv = async (file: File): Promise<void> => {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const fileName = file.name.replace(/\.[^/.]+$/, '');
  saveAs(blob, `${fileName}.csv`);
};

// Convert JSON to CSV
export const jsonToCsv = async (file: File): Promise<void> => {
  const text = await readFileAsText(file);
  const jsonData = JSON.parse(text);
  
  // Handle both array of objects and single object
  const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
  
  if (dataArray.length === 0) {
    throw new Error('JSON file is empty');
  }
  
  // Get all unique keys from all objects
  const keys = [...new Set(dataArray.flatMap(obj => Object.keys(obj)))];
  
  // Create CSV header
  const header = keys.join(',');
  
  // Create CSV rows
  const rows = dataArray.map(obj => {
    return keys.map(key => {
      const value = obj[key];
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value).replace(/"/g, '""');
      const stringValue = String(value);
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  });
  
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const fileName = file.name.replace(/\.[^/.]+$/, '');
  saveAs(blob, `${fileName}.csv`);
};

// Convert CSV to JSON
export const csvToJson = async (file: File): Promise<void> => {
  const text = await readFileAsText(file);
  const workbook = XLSX.read(text, { type: 'string' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  const jsonString = JSON.stringify(jsonData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  const fileName = file.name.replace(/\.[^/.]+$/, '');
  saveAs(blob, `${fileName}.json`);
};

// Convert XML to JSON
export const xmlToJson = async (file: File): Promise<void> => {
  const text = await readFileAsText(file);
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, 'text/xml');
  
  // Check for parsing errors
  const parseError = xmlDoc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Invalid XML file');
  }
  
  // Convert XML to JSON
  const xmlToJsonRecursive = (node: Element): Record<string, unknown> => {
    const result: Record<string, unknown> = {};
    
    // Add attributes
    if (node.attributes.length > 0) {
      result['@attributes'] = {};
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        (result['@attributes'] as Record<string, string>)[attr.name] = attr.value;
      }
    }
    
    // Process child nodes
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent?.trim();
        if (text) {
          if (Object.keys(result).length === 0) {
            return text as unknown as Record<string, unknown>;
          }
          result['#text'] = text;
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const childElement = child as Element;
        const childResult = xmlToJsonRecursive(childElement);
        
        if (result[childElement.tagName]) {
          // If key exists, convert to array
          if (!Array.isArray(result[childElement.tagName])) {
            result[childElement.tagName] = [result[childElement.tagName]];
          }
          (result[childElement.tagName] as unknown[]).push(childResult);
        } else {
          result[childElement.tagName] = childResult;
        }
      }
    }
    
    return result;
  };
  
  const jsonResult = {
    [xmlDoc.documentElement.tagName]: xmlToJsonRecursive(xmlDoc.documentElement)
  };
  
  const jsonString = JSON.stringify(jsonResult, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  const fileName = file.name.replace(/\.[^/.]+$/, '');
  saveAs(blob, `${fileName}.json`);
};

// Convert JSON to XML
export const jsonToXml = async (file: File): Promise<void> => {
  const text = await readFileAsText(file);
  const jsonData = JSON.parse(text);
  
  const jsonToXmlRecursive = (obj: unknown, tagName: string = 'root'): string => {
    if (obj === null || obj === undefined) {
      return `<${tagName}></${tagName}>`;
    }
    
    if (typeof obj !== 'object') {
      return `<${tagName}>${escapeXml(String(obj))}</${tagName}>`;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => jsonToXmlRecursive(item, tagName)).join('\n');
    }
    
    let xml = `<${tagName}>`;
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (key === '@attributes') continue;
      xml += jsonToXmlRecursive(value, key);
    }
    xml += `</${tagName}>`;
    return xml;
  };
  
  const escapeXml = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };
  
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + jsonToXmlRecursive(jsonData);
  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
  const fileName = file.name.replace(/\.[^/.]+$/, '');
  saveAs(blob, `${fileName}.xml`);
};

// Get Excel sheet info
export const getExcelInfo = async (file: File): Promise<{ sheetCount: number; sheetNames: string[] }> => {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  return {
    sheetCount: workbook.SheetNames.length,
    sheetNames: workbook.SheetNames,
  };
};
