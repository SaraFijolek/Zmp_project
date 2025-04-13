import jsPDF from "jspdf";
import 'jspdf-autotable';


export function exportToCSV(data) {
    let csvContent = "data:text/csv;charset=utf-8,Produkt,Ilość,Data aktualizacji\n";
    data.forEach(item => {
        csvContent += `${item.name},${item.quantity},${item.last_updated}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "raport_magazynowy.csv");
    document.body.appendChild(link);
    link.click();
}


export function exportToPDF(data) {
    const doc = new jsPDF();
    doc.text("Raport magazynowy", 20, 10);
    const tableData = data.map(item => [item.name, item.quantity, item.last_updated]);
    doc.autoTable({ head: [["Produkt", "Ilość", "Data aktualizacji"]], body: tableData });
    doc.save("raport_magazynowy.pdf");
}
