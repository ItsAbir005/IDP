import React, { useState } from 'react';
// No need for a specific import for Tailwind as it's processed by PostCSS

// Main App Component
const App = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-800 mb-8 text-center drop-shadow-lg leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Health Prediction</span> Dashboard
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
                <UVRiskPrediction />
                <HealthRiskPrediction />
                <SleepMetricsPrediction />
            </div>
            <footer className="mt-12 text-gray-600 text-sm text-center">
                <p>&copy; {new Date().getFullYear()} Health Predictor. All rights reserved.</p>
            </footer>
        </div>
    );
};

// Component for UV Risk Prediction
const UVRiskPrediction = () => {
    const [formData, setFormData] = useState({
        'Solar_Radiation': '',
        'Ozone_Level': '',
        'Altitude': '',
        'UV_Index': '',
    });
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setPrediction(null);

        for (const key in formData) {
            if (formData[key] === '' || isNaN(Number(formData[key]))) {
                setError(`Please enter a valid number for ${key.replace(/_/g, ' ')}`);
                setLoading(false);
                return;
            }
        }

        try {
            // !!! IMPORTANT: Added '/api' prefix here !!!
            const response = await fetch('/api/predict_uv_risk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.fromEntries(Object.entries(formData).map(([key, value]) => [key, parseFloat(value)])))
            });
            const data = await response.json();
            if (response.ok) {
                setPrediction(data.predicted_uv_risk_level);
            } else {
                setError(data.error || 'Failed to predict UV risk.');
            }
        } catch (err) {
            setError('Network error or server unavailable. Check if Flask backend is running and Vite proxy is configured correctly.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-purple-200 flex flex-col h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">☀️ UV Risk Prediction</h2>
            <form onSubmit={handleSubmit} className="space-y-4 flex-grow">
                {Object.keys(formData).map((key) => (
                    <div key={key}>
                        <label htmlFor={key} className="block text-gray-700 text-sm font-semibold mb-1">
                            {key.replace(/_/g, ' ')}
                        </label>
                        <input
                            type="number"
                            id={key}
                            name={key}
                            value={formData[key]}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150 ease-in-out shadow-sm"
                            placeholder={`Enter ${key.replace(/_/g, ' ')}`}
                            required
                        />
                    </div>
                ))}
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                    disabled={loading}
                >
                    {loading ? 'Predicting...' : 'Predict UV Risk'}
                </button>
            </form>
            {error && <p className="text-red-600 mt-4 text-center font-medium">{error}</p>}
            {prediction && (
                <div className="mt-6 p-4 bg-purple-50 border border-purple-300 rounded-xl text-center shadow-inner">
                    <h3 className="text-xl font-bold text-purple-800">Predicted UV Risk:</h3>
                    <p className="text-2xl font-extrabold text-indigo-700 mt-2">{prediction}</p>
                </div>
            )}
        </div>
    );
};

// Component for Health Risk Prediction
const HealthRiskPrediction = () => {
    const [formData, setFormData] = useState({
        'Heart Rate (bpm)': '',
        'SpO2 Level (%)': '',
        'Systolic Blood Pressure (mmHg)': '',
        'Diastolic Blood Pressure (mmHg)': '',
        'Body Temperature (°C)': '',
        'Fall Detection': 'no',
    });
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setPrediction(null);

        for (const key in formData) {
            if (key !== 'Fall Detection' && (formData[key] === '' || isNaN(Number(formData[key])))) {
                setError(`Please enter a valid number for ${key}`);
                setLoading(false);
                return;
            }
        }

        const dataToSend = { ...formData };
        for (const key in dataToSend) {
            if (key !== 'Fall Detection') {
                dataToSend[key] = parseFloat(dataToSend[key]);
            }
        }

        try {
            // !!! IMPORTANT: Added '/api' prefix here !!!
            const response = await fetch('/api/predict_health_risk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });
            const data = await response.json();
            if (response.ok) {
                setPrediction(data.predicted_health_risk_levels);
            } else {
                setError(data.error || 'Failed to predict health risk.');
            }
        } catch (err) {
            setError('Network error or server unavailable. Check if Flask backend is running and Vite proxy is configured correctly.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-indigo-200 flex flex-col h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">❤️ Health Risk Prediction</h2>
            <form onSubmit={handleSubmit} className="space-y-4 flex-grow">
                <div>
                    <label htmlFor="Heart Rate (bpm)" className="block text-gray-700 text-sm font-semibold mb-1">Heart Rate (bpm)</label>
                    <input
                        type="number" id="Heart Rate (bpm)" name="Heart Rate (bpm)" value={formData['Heart Rate (bpm)']} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-sm"
                        placeholder="Enter Heart Rate" required
                    />
                </div>
                <div>
                    <label htmlFor="SpO2 Level (%)" className="block text-gray-700 text-sm font-semibold mb-1">SpO2 Level (%)</label>
                    <input
                        type="number" id="SpO2 Level (%)" name="SpO2 Level (%)" value={formData['SpO2 Level (%)']} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-sm"
                        placeholder="Enter SpO2 Level" required
                    />
                </div>
                <div>
                    <label htmlFor="Systolic Blood Pressure (mmHg)" className="block text-gray-700 text-sm font-semibold mb-1">Systolic Blood Pressure (mmHg)</label>
                    <input
                        type="number" id="Systolic Blood Pressure (mmHg)" name="Systolic Blood Pressure (mmHg)" value={formData['Systolic Blood Pressure (mmHg)']} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-sm"
                        placeholder="Enter Systolic BP" required
                    />
                </div>
                <div>
                    <label htmlFor="Diastolic Blood Pressure (mmHg)" className="block text-gray-700 text-sm font-semibold mb-1">Diastolic Blood Pressure (mmHg)</label>
                    <input
                        type="number" id="Diastolic Blood Pressure (mmHg)" name="Diastolic Blood Pressure (mmHg)" value={formData['Diastolic Blood Pressure (mmHg)']} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-sm"
                        placeholder="Enter Diastolic BP" required
                    />
                </div>
                <div>
                    <label htmlFor="Body Temperature (°C)" className="block text-gray-700 text-sm font-semibold mb-1">Body Temperature (°C)</label>
                    <input
                        type="number" id="Body Temperature (°C)" name="Body Temperature (°C)" value={formData['Body Temperature (°C)']} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-sm"
                        placeholder="Enter Body Temperature" required
                    />
                </div>
                <div>
                    <label htmlFor="Fall Detection" className="block text-gray-700 text-sm font-semibold mb-1">Fall Detection</label>
                    <select
                        id="Fall Detection"
                        name="Fall Detection"
                        value={formData['Fall Detection']}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-sm bg-white"
                    >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                    disabled={loading}
                >
                    {loading ? 'Predicting...' : 'Predict Health Risk'}
                </button>
            </form>
            {error && <p className="text-red-600 mt-4 text-center font-medium">{error}</p>}
            {prediction && (
                <div className="mt-6 p-4 bg-indigo-50 border border-indigo-300 rounded-xl text-center shadow-inner">
                    <h3 className="text-xl font-bold text-indigo-800 mb-2">Predicted Health Risks:</h3>
                    {Object.entries(prediction).map(([key, value]) => (
                        <p key={key} className="text-lg text-gray-800 mb-1">
                            <strong className="text-indigo-700">{key}:</strong> {value}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};

// Component for Sleep Metrics Prediction
const SleepMetricsPrediction = () => {
    const [formData, setFormData] = useState({
        'Sleep Duration': '',
        'Quality of Sleep': '',
        'Physical Activity Level': '',
    });
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setPrediction(null);

        for (const key in formData) {
            if (formData[key] === '' || isNaN(Number(formData[key]))) {
                setError(`Please enter a valid number for ${key}`);
                setLoading(false);
                return;
            }
        }

        try {
            // !!! IMPORTANT: Added '/api' prefix here !!!
            const response = await fetch('/api/predict_sleep_metrics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.fromEntries(Object.entries(formData).map(([key, value]) => [key, parseFloat(value)])))
            });
            const data = await response.json();
            if (response.ok) {
                setPrediction(data.predicted_sleep_metrics);
            } else {
                setError(data.error || 'Failed to predict sleep metrics.');
            }
        } catch (err) {
            setError('Network error or server unavailable. Check if Flask backend is running and Vite proxy is configured correctly.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-green-200 flex flex-col h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">😴 Sleep Metrics Prediction</h2>
            <form onSubmit={handleSubmit} className="space-y-4 flex-grow">
                <div>
                    <label htmlFor="Sleep Duration" className="block text-gray-700 text-sm font-semibold mb-1">Sleep Duration (hours)</label>
                    <input
                        type="number" id="Sleep Duration" name="Sleep Duration" value={formData['Sleep Duration']} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150 ease-in-out shadow-sm"
                        placeholder="Enter Sleep Duration" required
                    />
                </div>
                <div>
                    <label htmlFor="Quality of Sleep" className="block text-gray-700 text-sm font-semibold mb-1">Quality of Sleep (1-10)</label>
                    <input
                        type="number" id="Quality of Sleep" name="Quality of Sleep" value={formData['Quality of Sleep']} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150 ease-in-out shadow-sm"
                        placeholder="Enter Quality of Sleep" required
                    />
                </div>
                <div>
                    <label htmlFor="Physical Activity Level" className="block text-gray-700 text-sm font-semibold mb-1">Physical Activity Level (minutes/week)</label>
                    <input
                        type="number" id="Physical Activity Level" name="Physical Activity Level" value={formData['Physical Activity Level']} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150 ease-in-out shadow-sm"
                        placeholder="Enter Physical Activity Level" required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                    disabled={loading}
                >
                    {loading ? 'Predicting...' : 'Predict Sleep Metrics'}
                </button>
            </form>
            {error && <p className="text-red-600 mt-4 text-center font-medium">{error}</p>}
            {prediction && (
                <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-xl text-center shadow-inner">
                    <h3 className="text-xl font-bold text-green-800 mb-2">Predicted Sleep Metrics:</h3>
                    {Object.entries(prediction).map(([key, value]) => (
                        <p key={key} className="text-lg text-gray-800 mb-1">
                            <strong className="text-green-700">{key}:</strong> {value}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default App;
