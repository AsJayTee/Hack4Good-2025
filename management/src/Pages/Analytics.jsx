import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./CSS/Analytics.css";
import piechart from '../Components/Assets/piechart.png'
import logo from '../Components/Assets/logo.png'
const Analytics = () => {
  const pdfRef = useRef(); // Reference to the content for PDF export

  // Sample data for the table
  const outOfStockItems = [
    { id: 1, item: "Laptop", demand: 120 },
    { id: 2, item: "Phone", demand: 85 },
    { id: 3, item: "Headphones", demand: 60 },
  ];

  // Function to download the PDF
  const downloadPDF = () => {
    const input = pdfRef.current;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
       
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      //Add title to the PDF
      pdf.setFontSize(20);
      pdf.text("Weekly Analytics", pdfWidth / 2, 20, { align: "center" });
      pdf.addImage(logo, "PNG", 8, 10,40,16.4);
      pdf.addImage(imgData, "PNG", 0, 50, pdfWidth, pdfHeight);
      pdf.save("Weekly Analytics.pdf");
    });
  };

  return (
    <div className="analytics-container">
      <h1>Analytics</h1>

      {/* Content to be exported as PDF */}
      <div ref={pdfRef}>
        {/* Two images side by side */}
        <div className="image-container">
          <div className="image-wrapper">
            <h2>Pie chart</h2>
            <img src={piechart} alt="piechart"/>
          </div>
          
        </div>

        {/* Table for out-of-stock items */}
        <h2>Most In-Demand Items (Out of Stock)</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Item</th>
              <th>Demand</th>
            </tr>
          </thead>
          <tbody>
            {outOfStockItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.item}</td>
                <td>{item.demand}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Download PDF Button */}
      <button className="download-button" onClick={downloadPDF}>
        Download PDF
      </button>
    </div>
  );
};

export default Analytics;
