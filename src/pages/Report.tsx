const Report: React.FC = () => {
    const { token } = useAuth();
    const [reportData, setReportData] = useState<any[]>([]);

    useEffect(() => {
        if (!token) return;
        (async () => {
            const data = await getReport(token);
            setReportData(data);
        })();
    }, [token]);

    return (
        <div>
            <h2>Raport magazynowy</h2>
            <table border={1}>
                <thead>
                <tr>
                    <th>Produkt</th>
                    <th>Ilość</th>
                    <th>Data aktualizacji</th>
                </tr>
                </thead>
                <tbody>
                {reportData.map((item, i) => (
                    <tr key={i}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.last_updated}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button onClick={() => exportToCSV(reportData)}>Eksportuj CSV</button>
            <button onClick={() => exportToPDF(reportData)}>Eksportuj PDF</button>
        </div>
    );
};

export default Report;
