import { useState } from 'react';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [train_no, setTrainNo] = useState('');
  const [period, setPeriod] = useState('1m');

  const fetchDelays = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/train-delay?train_no=${train_no}&period=${period}`);
      const data = await res.json();
      let DATA = {}
      for (let items of data){
        DATA[items[0]] = items[1]
      }
      setResult(DATA);
      
    } catch (err) {
      console.error('Error:', err);
      setResult({ error: 'Failed to fetch' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 font-mono text-sm">
      <h1 className="text-xl mb-2">Train Delay Checker</h1>
      <label className="block mb-2">
        Train Number:
        <input
          type="text"
          value={train_no}
          onChange={(e) => setTrainNo(e.target.value)}
          className="border p-1 rounded w-full"
        />
      </label>
      <label className="block mb-2">
        Period:
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border p-1 rounded w-full"
        >
          <option value="1w">1 week</option>
          <option value="1m">1 month</option>
          <option value="3m">3 month</option>
          <option value="6m">6 month</option>
          <option value="1y">1 year</option>
        
        </select>
      </label>

      <button onClick={fetchDelays} className="bg-blue-500 text-white px-3 py-1 rounded">
        {loading ? 'Loading...' : 'Check Delay'}
      </button>
      <pre className="mt-4 bg-gray-100 p-2 rounded"><h3>{train_no}</h3>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}

export default App;
