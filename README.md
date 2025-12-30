# Invoice Generator Web Application

A simple and professional Invoice Generator built using React.js that allows users to create GST invoices and download them as PDF files. This project is suitable for small businesses, freelancers, and educational purposes.

---

## Features

- Add project name and GST percentage  
- Dynamic item rows (description, unit, rate, quantity)  
- Automatic amount calculation  
- GST calculation  
- Total amount calculation  
- Generate and download invoices as PDF  
- Clean and professional invoice layout  

---

## Tech Stack

- Frontend: React.js  
- PDF Generation: jsPDF, jspdf-autotable  
- Styling: CSS  
- Build Tool: Vite / React Scripts  

---

## Project Structure

invoice-generator/
│
├── src/
│   ├── assets/
│   │   └── logo.png
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── public/
│
├── package.json
├── README.md
└── index.html

---

## Installation and Setup

### Step 1: Clone the repository
git clone https://github.com/vishanthkannan/invoice-generator.git

### Step 2: Navigate to the project directory
cd invoice-generator

### Step 3: Install dependencies
npm install

### Step 4: Start the development server
npm run dev

The application will be available at:
http://localhost:5173

---

## Application Flow

1. Enter the project name  
2. Specify the GST percentage  
3. Add invoice items:
   - Description
   - Unit
   - Rate
   - Quantity  
4. The application automatically calculates:
   - Item-wise amounts  
   - Subtotal  
   - GST amount  
   - Grand total  
5. Generate and download the invoice as a PDF file  

---

## Libraries Used

- jsPDF – PDF generation  
- jspdf-autotable – Table formatting in PDF  

---

## Use Cases

- Small businesses  
- Construction and service-based firms  
- Freelancers  
- Academic and learning projects  

---

## Future Enhancements

- Customer and billing details  
- Invoice number and date generation  
- Multiple invoice templates  
- Database integration  
- Email invoice functionality  
