const xlsx = require("xlsx");

const filePath = "./customer_data.xlsx";  // Ensure file is in the same folder
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

console.log("Customer Data from Excel:", data);
