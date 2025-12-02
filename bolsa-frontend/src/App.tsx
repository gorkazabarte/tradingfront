import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

interface Operation {
    date: string;
    symbol: string;
    buyPrice: number;
    sellPrice: number;
    shares: number;
    profit: number;
    returnPercent: number;
    sellType: string;
}

interface Company {
    name: string;
    ticker: string;
    reportTime: string;
}

export default function App() {
    const [nextInvestment, setNextInvestment] = useState(6000);
    const [opsPerDay, setOpsPerDay] = useState(5);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [stopLoss, setStopLoss] = useState<number>(2);
    const [takeProfit, setTakeProfit] = useState<number>(5);
    const [errorMessage, setErrorMessage] = useState("");

    const [operations] = useState<Operation[]>([
        { date: "2025-11-28", symbol: "AAPL", buyPrice: 180, sellPrice: 187, shares: 10, profit: 70, returnPercent: 3.8, sellType: "TP" },
        { date: "2025-11-27", symbol: "TSLA", buyPrice: 200, sellPrice: 190, shares: 5, profit: -50, returnPercent: -5, sellType: "SL" },
        { date: "2025-11-25", symbol: "GOOG", buyPrice: 120, sellPrice: 125, shares: 8, profit: 40, returnPercent: 4.2, sellType: "TP" },
    ]);

    const [earnings, setEarnings] = useState<Company[]>([]);
    const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);

    const [earningsPage, setEarningsPage] = useState(1);
    const [selectedPage, setSelectedPage] = useState(1);
    const itemsPerPage = 5;

    const mockEarnings: Company[] = [
        { name: "Apple Inc.", ticker: "AAPL", reportTime: "AMC" },
        { name: "Tesla Inc.", ticker: "TSLA", reportTime: "BMO" },
        { name: "Google LLC", ticker: "GOOG", reportTime: "AMC" },
        { name: "Microsoft Corp.", ticker: "MSFT", reportTime: "AMC" },
        { name: "Amazon.com Inc.", ticker: "AMZN", reportTime: "BMO" },
        { name: "Meta Platforms", ticker: "META", reportTime: "AMC" },
        { name: "Nvidia Corp.", ticker: "NVDA", reportTime: "BMO" },
        { name: "Intel Corp.", ticker: "INTC", reportTime: "AMC" },
        { name: "Netflix Inc.", ticker: "NFLX", reportTime: "AMC" },
        { name: "Adobe Inc.", ticker: "ADBE", reportTime: "BMO" },
        { name: "Salesforce.com", ticker: "CRM", reportTime: "AMC" },
        { name: "PayPal Holdings", ticker: "PYPL", reportTime: "AMC" },
        { name: "Cisco Systems", ticker: "CSCO", reportTime: "BMO" },
        { name: "Oracle Corp.", ticker: "ORCL", reportTime: "AMC" },
        { name: "AMD", ticker: "AMD", reportTime: "BMO" },
        { name: "IBM", ticker: "IBM", reportTime: "AMC" },
        { name: "Shopify Inc.", ticker: "SHOP", reportTime: "AMC" },
        { name: "Square Inc.", ticker: "SQ", reportTime: "BMO" },
        { name: "Uber Technologies", ticker: "UBER", reportTime: "AMC" },
        { name: "Lyft Inc.", ticker: "LYFT", reportTime: "BMO" },
    ];

    useEffect(() => {
        if (selectedDate) {
            setEarnings(
                mockEarnings.filter(c => !selectedCompanies.some(s => s.ticker === c.ticker))
            );
        } else {
            setEarnings([]);
        }

        if (selectedCompanies.length > opsPerDay) {
            setErrorMessage(`You reached the maximum number of selected companies (${opsPerDay}).`);
        } else {
            setErrorMessage("");
        }

        setEarningsPage(1);
        setSelectedPage(1);
    }, [selectedDate, selectedCompanies, opsPerDay]);

    const moveToSelected = (company: Company) => {
        if (selectedCompanies.length >= opsPerDay) {
            setErrorMessage(`You reached the maximum number of selected companies (${opsPerDay}).`);
            return;
        }
        setSelectedCompanies(prev => [...prev, company]);
        setEarnings(prev => prev.filter(c => c.ticker !== company.ticker));
        setErrorMessage("");
    };

    const moveBackToEarnings = (company: Company) => {
        setSelectedCompanies(prev => prev.filter(c => c.ticker !== company.ticker));
        setEarnings(prev => [...prev, company]);
        setErrorMessage("");
    };

    const paginatedEarnings = earnings.slice(
        (earningsPage - 1) * itemsPerPage,
        earningsPage * itemsPerPage
    );

    const paginatedSelected = selectedCompanies.slice(
        (selectedPage - 1) * itemsPerPage,
        selectedPage * itemsPerPage
    );

    const totalEarningsPages = Math.max(1, Math.ceil(earnings.length / itemsPerPage));
    const totalSelectedPages = Math.max(1, Math.ceil(selectedCompanies.length / itemsPerPage));

    const filteredOperations = operations.filter((op) => {
        const opDate = new Date(op.date);
        return !(selectedDate && opDate.toDateString() !== selectedDate.toDateString());
    });

    const totalProfit = filteredOperations.reduce((sum, op) => sum + op.profit, 0);
    const uniqueDays = Array.from(new Set(filteredOperations.map((op) => op.date))).length;
    const profitPerDay = uniqueDays > 0 ? totalProfit / uniqueDays : 0;

    const getHistoricalOperations = (days: number) => {
        const today = selectedDate || new Date();
        const thresholdDate = new Date(today);
        thresholdDate.setDate(today.getDate() - days);
        return operations.filter(op => new Date(op.date) >= thresholdDate && new Date(op.date) <= today);
    };

    return (
        <div className="container">
            <header className="header">
                <h1>Trading Dashboard</h1>
                <div className="top-date-filter">
                    <label>Select Date:</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date: Date | null) => setSelectedDate(date)}
                        placeholderText="Select a date"
                        dateFormat="yyyy-MM-dd"
                    />
                </div>
            </header>

            <div className="main-content">
                {/* Left Column */}
                <div className="left-content">
                    {/* Stats */}
                    <section className="stats">
                        <div className="stat-card">
                            <span>Total Profit</span>
                            <strong className={totalProfit >= 0 ? "positive" : "negative"}>
                                {totalProfit} $
                            </strong>
                        </div>
                        <div className="stat-card">
                            <span>Profit / Day</span>
                            <strong className={profitPerDay >= 0 ? "positive" : "negative"}>
                                {profitPerDay.toFixed(2)} $
                            </strong>
                        </div>
                    </section>

                    {/* Operations Table */}
                    <h2 className="table-title">Operations List: {selectedDate ? selectedDate.toDateString() : ""}</h2>
                    <div className="table-wrapper">
                        <table className="beautiful-table">
                            <thead>
                            <tr>
                                <th>Date</th>
                                <th>Symbol</th>
                                <th>Buy Price</th>
                                <th>Sell Price</th>
                                <th>Shares</th>
                                <th>Profit</th>
                                <th>Return (%)</th>
                                <th>Sell Type</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredOperations.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="empty-row">
                                        No operations match the selected date.
                                    </td>
                                </tr>
                            ) : (
                                filteredOperations.map((op, i) => (
                                    <tr key={i}>
                                        <td>{op.date}</td>
                                        <td>{op.symbol}</td>
                                        <td>{op.buyPrice}</td>
                                        <td>{op.sellPrice}</td>
                                        <td>{op.shares}</td>
                                        <td className={op.profit >= 0 ? "positive" : "negative"}>{op.profit} $</td>
                                        <td>{op.returnPercent}%</td>
                                        <td>{op.sellType}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* Historical Operations */}
                    <section className="historical-operations">
                        <h2>Historical Operations</h2>
                        {[5, 15, 30].map(days => (
                            <div key={days} className="historical-box">
                                <h3>Last {days} Days</h3>
                                <div className="table-wrapper">
                                    <table className="beautiful-table">
                                        <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Symbol</th>
                                            <th>Buy Price</th>
                                            <th>Sell Price</th>
                                            <th>Shares</th>
                                            <th>Profit</th>
                                            <th>Return (%)</th>
                                            <th>Sell Type</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {getHistoricalOperations(days).length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="empty-row">No operations</td>
                                            </tr>
                                        ) : (
                                            getHistoricalOperations(days).map((op, i) => (
                                                <tr key={i}>
                                                    <td>{op.date}</td>
                                                    <td>{op.symbol}</td>
                                                    <td>{op.buyPrice}</td>
                                                    <td>{op.sellPrice}</td>
                                                    <td>{op.shares}</td>
                                                    <td className={op.profit >= 0 ? "positive" : "negative"}>{op.profit} $</td>
                                                    <td>{op.returnPercent}%</td>
                                                    <td>{op.sellType}</td>
                                                </tr>
                                            ))
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </section>
                </div>

                {/* Right Column */}
                <div className="right-content">
                    {/* Earnings Section */}
                    <section className="earnings-section">
                        <h2>Earnings for {selectedDate ? selectedDate.toDateString() : ""}</h2>
                        <div className="earnings-boxes">
                            <div className="earnings-box">
                                <h3>Earnings</h3>
                                <ul>
                                    {paginatedEarnings.map((company, index) => (
                                        <li key={index}>
                                            <span>{company.ticker} ({company.reportTime})</span>
                                            <button onClick={() => moveToSelected(company)}>→</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="earnings-box selected-companies-box">
                                <h3>Selected Companies</h3>
                                <ul>
                                    {paginatedSelected.map((company, index) => (
                                        <li key={index}>
                                            <span>{company.ticker} ({company.reportTime})</span>
                                            <button onClick={() => moveBackToEarnings(company)}>←</button>
                                        </li>
                                    ))}
                                    {selectedCompanies.length === 0 && <p>No companies selected.</p>}
                                </ul>
                            </div>
                        </div>
                        {errorMessage && <div className="error-message">{errorMessage}</div>}

                        {/* NEW Submit button for Earnings section */}
                        <button
                            className="submit-button"
                            onClick={() => console.log("Submitted companies from Earnings:", selectedCompanies)}
                            disabled={selectedCompanies.length > opsPerDay}
                        >
                            Submit
                        </button>
                    </section>

                    {/* Trading Settings Section */}
                    <section className="trading-settings">
                        <h2>Trading Settings</h2>
                        <div className="trading-settings-grid">
                            <div className="trading-setting-item">
                                <label>Stop Loss (%)</label>
                                <input type="number" value={stopLoss} onChange={e => setStopLoss(Number(e.target.value))} />
                            </div>
                            <div className="trading-setting-item">
                                <label>Take Profit (%)</label>
                                <input type="number" value={takeProfit} onChange={e => setTakeProfit(Number(e.target.value))} />
                            </div>
                            <div className="trading-setting-item">
                                <label>Next Investment per Trade</label>
                                <input type="number" value={nextInvestment} onChange={e => setNextInvestment(Number(e.target.value))} />
                            </div>
                            <div className="trading-setting-item">
                                <label>Trades per Day</label>
                                <input type="number" value={opsPerDay} onChange={e => setOpsPerDay(Number(e.target.value))} />
                            </div>
                        </div>

                        {/* Existing Trading Settings Submit */}
                        <button
                            className="submit-button"
                            onClick={() => console.log("Submitted from Trading Settings")}
                        >
                            Submit
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
}
