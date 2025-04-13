import { useState, useEffect } from "react";
import { getReport } from "../api/api";
import { exportToCSV, exportToPDF } from "../utils/exportUtils";

function Reports() {
    const [reportData, setReportData] = useState([]);

    useEffect(() => {
        async function fetchReport() {
            const data = await getReport();
            setReportData(data);
        }
        fetchReport();
    }, []);

    return (
        <div>
            <h2> Raport magazynowy</h2>
            <table border="1">
                <thead>
                <tr>
                    <th>Produkt</th>
                    <th>Ilość</th>
                    <th>Data aktualizacji</th>
                </tr>
                </thead>
                <tbody>
                {reportData.map((item, index) => (
                    <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.last_updated}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button onClick={() => exportToCSV(reportData)}> Eksportuj CSV</button>
            <button onClick={() => exportToPDF(reportData)}> Eksportuj PDF</button>
        </div>
    );
}

export default Reports;
