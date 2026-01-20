import { useState } from "react";
import "./App.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "./assets/logo.png";

function App() {
  const [project, setProject] = useState("");
  const [gst, setGst] = useState(18);
  const [fileName, setFileName] = useState("");
  const [projectNote, setProjectNote] = useState("");



  const [items, setItems] = useState([
    { desc: "", unit: "", rate: "", qty: "", amount: 0 },
  ]);

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    newItems[index].amount =
      Number(newItems[index].rate) * Number(newItems[index].qty) || 0;
    setItems(newItems);
  };

  const addRow = () => {
    setItems([
      ...items,
      { desc: "", unit: "", rate: "", qty: "", amount: 0 },
    ]);
  };

  const deleteRow = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.length > 0 ? newItems : [{ desc: "", unit: "", rate: "", qty: "", amount: 0 }]);
  };

  const total = items.reduce((sum, i) => sum + i.amount, 0);
  const gstAmount = (total * gst) / 100;
  const grandTotal = total + gstAmount;

  /* ================= HEADER ================= */
  const drawHeader = (doc, today, project) => {
    doc.addImage(logo, "PNG", 10, 14, 48, 48);

    doc.setFont("times", "bold");
    doc.setFontSize(24);
    doc.text("VISH CREATIONS", 60, 34);

    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.text("INDUSTRIAL MAINTENANCE & SOLUTIONS", 60, 42);

    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.text(`DATE : ${today}`, 190, 36, { align: "right" });

    doc.setLineWidth(0.8);
    doc.line(10, 52, 200, 52);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text((project || "").toUpperCase(), 105, 64, { align: "center" });
  };

  /* ================= FOOTER ================= */
  const drawFooter = (doc) => {
    const pageHeight = doc.internal.pageSize.height;
    const footerY = pageHeight - 28;

    doc.setDrawColor(120, 120, 120);
    doc.setLineWidth(0.3);
    doc.line(20, footerY, 190, footerY);

    doc.setFont("times", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(30, 30, 30);
    doc.text("VISH CREATIONS", 105, footerY + 6, {
      align: "center",
    });

    doc.setFont("times", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(40, 40, 40);
    doc.text(
      "Sample Address, Industrial Area, City – 600000\n" +
        "Phone: 9XXXXXXXXX | Email: demo@example.com | GSTIN: XXABCDE1234X1Z1\n" +
        "This is a demo invoice for portfolio purposes only.",
      105,
      footerY + 12,
      { align: "center" }
    );
  };

  /* ================= PDF ================= */
  const generatePDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const today = new Date().toLocaleDateString("en-IN");

    const tableData = items
      .filter(
        (i) => i.desc && i.desc.trim() !== "" && Number(i.amount) > 0
      )
      .map((i, index) => [
        index + 1,
        i.desc.toUpperCase(),
        (i.unit || "").toUpperCase(),
        i.rate,
        i.qty,
        i.amount,
      ]);

    autoTable(doc, {
      startY: 75,
      margin: { left: 10, right: 10, bottom: 80, top: 72 },
      theme: "grid",

      head: [["S.no", "DESCRIPTION", "UNIT", "RATE", "QTY", "AMOUNT"]],
      body: tableData,

      styles: {
        font: "times",
        fontSize: 11,
        cellPadding: { top: 2, bottom: 2, left: 4, right: 4 },
        valign: "middle",
        overflow: "linebreak",
        lineHeight: 1.2,
      },

      headStyles: {
        font: "times",
        fontStyle: "bold",
        fontSize: 12,
        halign: "center",
        minCellHeight: 12,
      },

      columnStyles: {
        0: { cellWidth: 18, halign: "center" },
        1: { cellWidth: 78 },
        2: { cellWidth: 22, halign: "center" },
        3: { cellWidth: 25, halign: "right" },
        4: { cellWidth: 22, halign: "center" },
        5: { cellWidth: 30, halign: "right" },
      },

      didDrawPage: function () {
        drawHeader(doc, today, project);

        try {
          doc.saveGraphicsState();
          doc.setGState(new doc.GState({ opacity: 0.06 }));
          doc.addImage(logo, "PNG", 10, 70, 190, 190);
          doc.restoreGraphicsState();
        } catch {
          doc.addImage(logo, "PNG", 35, 95, 140, 140);
        }

        drawFooter(doc);
      },
    });

    const pageHeight = doc.internal.pageSize.height;
    const footerHeight = 30;

    let totalsY = doc.lastAutoTable.finalY + 12;
    const maxTotalsY = pageHeight - footerHeight - 25;

    if (totalsY > maxTotalsY) totalsY = maxTotalsY;

    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.text(`Total Amount : Rs. ${total}`, 140, totalsY);
    doc.text(`GST (${gst}%) : Rs. ${gstAmount}`, 140, totalsY + 8);
    doc.text(`Grand Total : Rs. ${grandTotal}`, 140, totalsY + 16);

    // ================= PROJECT NOTE =================
if (projectNote && projectNote.trim() !== "") {
  const noteY = totalsY + 28;

  doc.setFont("times", "normal");
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);

  doc.text("Project Note:", 14, noteY);

  doc.setFont("times", "italic");
  doc.text(
    projectNote,
    14,
    noteY + 6,
    { maxWidth: 180 }
  );
}

    const safeFileName = fileName
  ? fileName.toUpperCase().replace(/[^A-Z0-9]/g, "_")
  : "INVOICE";

doc.save(`${safeFileName}.pdf`);

  };

  /* ================= UI ================= */
  return (
    <div className="container">
      {/* HEADER */}
      <div className="header-ui">
        <img src={logo} alt="Vish Creations Logo" />
        <h2>Invoice Generator</h2>
      </div>

      {/* FORM SECTION */}
      <div className="form-section">
        <div className="form-section-title">Invoice Details</div>
        
        <div className="form-group">
          <h4>File Name</h4>
          <input
            type="text"
            placeholder="e.g., Maintenance_work"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <h4>Project Name</h4>
          <input
            type="text"
            placeholder="Enter project name"
            value={project}
            onChange={(e) => setProject(e.target.value)}
          />
        </div>

        <div className="form-group">
          <h4>Project Notes</h4>
          <textarea
            placeholder="Add any additional notes, terms, or special instructions for the invoice..."
            value={projectNote}
            onChange={(e) => setProjectNote(e.target.value)}
          />
        </div>
      </div>

      {/* ITEMS TABLE SECTION */}
      <div className="items-section">
        <div className="table-wrapper">
          <div className="table-header">
            <h3>Line Items</h3>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Unit</th>
                <th>Rate</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td>
                    <input
                      type="text"
                      value={item.desc}
                      placeholder="Item description"
                      onChange={(e) =>
                        handleChange(i, "desc", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.unit}
                      placeholder="Unit"
                      onChange={(e) =>
                        handleChange(i, "unit", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.rate}
                      placeholder="0"
                      onChange={(e) =>
                        handleChange(i, "rate", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.qty}
                      placeholder="0"
                      onChange={(e) =>
                        handleChange(i, "qty", e.target.value)
                      }
                    />
                  </td>
                  <td>₹ {item.amount.toFixed(2)}</td>
                  <td>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteRow(i)}
                      title="Delete this item"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-wrapper" style={{ paddingTop: 0 }}>
          <button className="add-item-btn" onClick={addRow}>
            Add New Item
          </button>
        </div>
      </div>

      {/* SUMMARY SECTION */}
      <div className="summary">
        <div className="summary-content">
          <div className="summary-card">
            <p>
              <span>Subtotal:</span>
              <span>₹ {total.toFixed(2)}</span>
            </p>
            <p>
              <span>GST Rate (%)</span>
              <input
                type="number"
                value={gst}
                onChange={(e) => setGst(e.target.value)}
              />
            </p>
            <p>
              <span>GST Amount:</span>
              <span>₹ {gstAmount.toFixed(2)}</span>
            </p>
          </div>

          <h3>Grand Total: ₹ {grandTotal.toFixed(2)}</h3>

          <button className="pdf-btn" onClick={generatePDF}>
            Download Invoice PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
