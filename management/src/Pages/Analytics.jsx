import React, { useRef, useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./CSS/Analytics.css";
import logo from '../Components/Assets/logo.png';


const Analytics = () => {
  const pdfRef = useRef(); // Reference to the content for PDF export
  const [outOfStockItems, setOutOfStockItems] = useState([]); // For out-of-stock items
  const [pieChartUrl, setPieChartUrl] = useState(""); // For pie chart image
  const [error, setError] = useState(null); // For error handling

  // Fetch data from backend
  useEffect(() => {
    // Fetch out-of-stock items
    fetch('http://127.0.0.1:5000/get_low_stock_products')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch low stock products.');
        }
        return response.json();
      })
      .then(data => setOutOfStockItems(data))
      .catch(err => setError(err.message));

    // Fetch pie chart image
    fetch('http://127.0.0.1:5000/get_in_demand_products')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch in-demand products chart.');
        }
        return response.json();
      })
      .then(data => {
        if (data.image) {
          // Construct a Base64 image URL
          const url = `data:image/png;base64,${data.image}`;
          setPieChartUrl(url); // Set the URL in state
        } else {
          throw new Error('No image data found.');
        }
      })
      .catch(err => setError(err.message));
  }, []);

  // Function to download the PDF
  const downloadPDF = () => {
    const input = pdfRef.current;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Add title and images to the PDF
      pdf.setFontSize(20);
      pdf.text("Weekly Analytics", pdfWidth / 2, 20, { align: "center" });
      pdf.addImage(logo, "PNG", 8, 10, 40, 16.4);
      pdf.addImage(imgData, "PNG", 0, 50, pdfWidth, pdfHeight);
      pdf.save("Weekly Analytics.pdf");
    });
  };

  return (
    <div className="analytics-container">
      <h1>Analytics</h1>

      {/* Display errors if any */}
      {error && <p className="error">{error}</p>}

      {/* Content to be exported as PDF */}
      <div ref={pdfRef}>
        {/* Pie chart image */}
        <div className="image-container">
          <div className="image-wrapper">
            <h2>Pie Chart</h2>
            {pieChartUrl ? (
              <img src={pieChartUrl} alt="In-Demand Products Chart" />
            ) : (
              <p>Image cannot be loaded</p>
            )}
          </div>
        </div>

        {/* Table for out-of-stock items */}
        <h2>Low stock products</h2>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {outOfStockItems.length > 0 ? (
              outOfStockItems.map((item, index) => (
                <tr key={index}>
                  <td>{item[0]}</td>
                  <td>{item[1]}</td>
                  <td>{item[2]}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">There are currently no low-stock items.</td>
              </tr>
            )}
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
