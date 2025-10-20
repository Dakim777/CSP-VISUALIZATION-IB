import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, FastForward, CheckCircle, XCircle, Users } from 'lucide-react';

const CSPVisualization = () => {
  const MAHASISWA = ['Ani', 'Budi', 'Citra', 'Dedi', 'Eka'];
  const DOMAIN = ['K1', 'K2'];
  
  const [algorithm, setAlgorithm] = useState('backtracking');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [assignment, setAssignment] = useState({});
  const [solutions, setSolutions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ iterations: 0, backtracks: 0 });

  const checkConstraints = (assign) => {
    const keys = Object.keys(assign);
    
    // C1: Ani != Budi
    if (keys.includes('Ani') && keys.includes('Budi')) {
      if (assign['Ani'] === assign['Budi']) return false;
    }
    
    // C2: Citra == Dedi
    if (keys.includes('Citra') && keys.includes('Dedi')) {
      if (assign['Citra'] !== assign['Dedi']) return false;
    }
    
    // C4: Ukuran kelompok minimal 2
    if (keys.length === MAHASISWA.length) {
      const K1 = keys.filter(k => assign[k] === 'K1');
      const K2 = keys.filter(k => assign[k] === 'K2');
      if (K1.length < 2 || K2.length < 2) return false;
    }
    
    return true;
  };

  const getGroups = (assign) => {
    const K1 = Object.keys(assign).filter(k => assign[k] === 'K1');
    const K2 = Object.keys(assign).filter(k => assign[k] === 'K2');
    return { K1, K2 };
  };

  const costFunction = (assign) => {
    if (Object.keys(assign).length !== MAHASISWA.length) return Infinity;
    
    let cost = 0;
    const { K1, K2 } = getGroups(assign);
    
    if (assign['Ani'] === assign['Budi']) cost += 1;
    if (assign['Citra'] !== assign['Dedi']) cost += 1;
    if (K1.length < 2) cost += 1;
    if (K2.length < 2) cost += 1;
    
    return cost;
  };

  const runBacktracking = () => {
    const foundSolutions = [];
    const stepLogs = [];
    let iterCount = 0;
    let backtrackCount = 0;

    const search = (assign, depth) => {
      iterCount++;
      
      if (Object.keys(assign).length === MAHASISWA.length) {
        if (checkConstraints(assign)) {
          foundSolutions.push({ ...assign });
          stepLogs.push({
            type: 'solution',
            assignment: { ...assign },
            message: `✓ Solusi ditemukan!`
          });
        }
        return;
      }

      const unassigned = MAHASISWA.filter(m => !(m in assign));
      const variable = unassigned[0];

      for (const value of DOMAIN) {
        const newAssign = { ...assign, [variable]: value };
        
        stepLogs.push({
          type: 'try',
          assignment: { ...newAssign },
          message: `Coba assign ${variable} = ${value}`
        });

        if (checkConstraints(newAssign)) {
          search(newAssign, depth + 1);
        } else {
          stepLogs.push({
            type: 'fail',
            assignment: { ...newAssign },
            message: `✗ ${variable} = ${value} melanggar constraint`
          });
          backtrackCount++;
        }
      }
    };

    search({}, 0);
    setLogs(stepLogs);
    setSolutions(foundSolutions);
    setStats({ iterations: iterCount, backtracks: backtrackCount });
  };

  const runHillClimbing = () => {
    const stepLogs = [];
    let current = {};
    MAHASISWA.forEach(m => {
      current[m] = Math.random() < 0.5 ? 'K1' : 'K2';
    });
    
    let currentCost = costFunction(current);
    stepLogs.push({
      type: 'init',
      assignment: { ...current },
      message: `Inisialisasi acak, H = ${currentCost}`
    });

    let iterCount = 0;
    const maxIter = 100;

    while (iterCount < maxIter && currentCost > 0) {
      iterCount++;
      
      const neighbors = MAHASISWA.map(student => {
        const newAssign = { ...current };
        newAssign[student] = current[student] === 'K1' ? 'K2' : 'K1';
        return newAssign;
      });

      let bestNeighbor = current;
      let bestCost = currentCost;

      neighbors.forEach(neighbor => {
        const nCost = costFunction(neighbor);
        if (nCost < bestCost) {
          bestCost = nCost;
          bestNeighbor = neighbor;
        }
      });

      if (bestCost >= currentCost) {
        stepLogs.push({
          type: 'stuck',
          assignment: { ...current },
          message: `Iterasi ${iterCount}: Terjebak di minimum lokal (H=${currentCost})`
        });
        break;
      }

      current = bestNeighbor;
      currentCost = bestCost;
      
      stepLogs.push({
        type: currentCost === 0 ? 'solution' : 'improve',
        assignment: { ...current },
        message: `Iterasi ${iterCount}: Pindah ke H = ${currentCost}`
      });
    }

    setLogs(stepLogs);
    setSolutions(currentCost === 0 ? [current] : []);
    setStats({ iterations: iterCount, backtracks: 0 });
  };

  const runAlgorithm = () => {
    setIsRunning(true);
    setCurrentStep(0);
    setAssignment({});
    setSolutions([]);
    setLogs([]);
    
    if (algorithm === 'backtracking') {
      runBacktracking();
    } else {
      runHillClimbing();
    }
  };

  useEffect(() => {
    if (isRunning && currentStep < logs.length) {
      const timer = setTimeout(() => {
        setAssignment(logs[currentStep].assignment);
        setCurrentStep(currentStep + 1);
      }, 500);
      return () => clearTimeout(timer);
    } else if (currentStep >= logs.length) {
      setIsRunning(false);
    }
  }, [isRunning, currentStep, logs]);

  const reset = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setAssignment({});
    setSolutions([]);
    setLogs([]);
    setStats({ iterations: 0, backtracks: 0 });
  };

  const skipToEnd = () => {
    if (logs.length > 0) {
      setCurrentStep(logs.length);
      setAssignment(logs[logs.length - 1].assignment);
      setIsRunning(false);
    }
  };

  const getConstraintStatus = () => {
    const keys = Object.keys(assignment);
    const status = [];
    
    if (keys.includes('Ani') && keys.includes('Budi')) {
      status.push({
        name: 'C1: Ani ≠ Budi',
        satisfied: assignment['Ani'] !== assignment['Budi']
      });
    }
    
    if (keys.includes('Citra') && keys.includes('Dedi')) {
      status.push({
        name: 'C2: Citra = Dedi',
        satisfied: assignment['Citra'] === assignment['Dedi']
      });
    }
    
    if (keys.length === MAHASISWA.length) {
      const { K1, K2 } = getGroups(assignment);
      status.push({
        name: 'C4: |K1| ≥ 2',
        satisfied: K1.length >= 2
      });
      status.push({
        name: 'C4: |K2| ≥ 2',
        satisfied: K2.length >= 2
      });
    }
    
    return status;
  };

  const { K1, K2 } = getGroups(assignment);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-indigo-900">
          CSP: Pembagian Tugas Kelompok
        </h1>
        <p className="text-center text-gray-600 mb-8">
          5 Mahasiswa → 2 Kelompok dengan Constraint
        </p>

        {/* Algorithm Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Pilih Algoritma</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setAlgorithm('backtracking')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                algorithm === 'backtracking'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Backtracking Search
            </button>
            <button
              onClick={() => setAlgorithm('hillclimbing')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                algorithm === 'hillclimbing'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Hill Climbing
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex gap-4 justify-center">
            <button
              onClick={runAlgorithm}
              disabled={isRunning}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition"
            >
              <Play size={20} /> Jalankan
            </button>
            <button
              onClick={skipToEnd}
              disabled={!isRunning || logs.length === 0}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              <FastForward size={20} /> Skip
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
            >
              <RotateCcw size={20} /> Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visualization */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <Users size={24} /> Penugasan Mahasiswa
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                <h3 className="font-bold text-blue-800 mb-3 text-center">Kelompok 1 (K1)</h3>
                <div className="space-y-2">
                  {K1.length > 0 ? (
                    K1.map(student => (
                      <div key={student} className="bg-blue-500 text-white px-3 py-2 rounded text-center font-semibold">
                        {student}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-center italic">Kosong</div>
                  )}
                </div>
              </div>

              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                <h3 className="font-bold text-green-800 mb-3 text-center">Kelompok 2 (K2)</h3>
                <div className="space-y-2">
                  {K2.length > 0 ? (
                    K2.map(student => (
                      <div key={student} className="bg-green-500 text-white px-3 py-2 rounded text-center font-semibold">
                        {student}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-center italic">Kosong</div>
                  )}
                </div>
              </div>
            </div>

            {/* Constraints */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3 text-gray-800">Status Constraint:</h3>
              <div className="space-y-2">
                {getConstraintStatus().map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded">
                    <span className="text-sm font-medium">{c.name}</span>
                    {c.satisfied ? (
                      <CheckCircle className="text-green-600" size={20} />
                    ) : (
                      <XCircle className="text-red-600" size={20} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Logs and Stats */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Log Algoritma</h2>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-indigo-50 p-3 rounded text-center">
                <div className="text-2xl font-bold text-indigo-600">{stats.iterations}</div>
                <div className="text-xs text-gray-600">Iterasi</div>
              </div>
              {algorithm === 'backtracking' && (
                <div className="bg-red-50 p-3 rounded text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.backtracks}</div>
                  <div className="text-xs text-gray-600">Backtracks</div>
                </div>
              )}
              <div className="bg-green-50 p-3 rounded text-center">
                <div className="text-2xl font-bold text-green-600">{solutions.length}</div>
                <div className="text-xs text-gray-600">Solusi</div>
              </div>
            </div>

            {/* Log Messages */}
            <div className="border rounded-lg h-96 overflow-y-auto p-4 bg-gray-50">
              {logs.slice(0, currentStep).map((log, idx) => (
                <div
                  key={idx}
                  className={`mb-2 p-3 rounded text-sm ${
                    log.type === 'solution'
                      ? 'bg-green-100 border-l-4 border-green-500'
                      : log.type === 'fail'
                      ? 'bg-red-100 border-l-4 border-red-500'
                      : log.type === 'stuck'
                      ? 'bg-yellow-100 border-l-4 border-yellow-500'
                      : 'bg-blue-50 border-l-4 border-blue-500'
                  }`}
                >
                  <div className="font-medium">{log.message}</div>
                </div>
              ))}
            </div>

            {/* Solutions Summary */}
            {solutions.length > 0 && currentStep >= logs.length && (
              <div className="mt-4 p-4 bg-green-50 border-2 border-green-500 rounded-lg">
                <h3 className="font-bold text-green-800 mb-2">Solusi Ditemukan!</h3>
                {solutions.map((sol, idx) => {
                  const groups = getGroups(sol);
                  return (
                    <div key={idx} className="text-sm mb-2">
                      <div><strong>K1:</strong> {groups.K1.sort().join(', ')}</div>
                      <div><strong>K2:</strong> {groups.K2.sort().join(', ')}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Problem Description */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Deskripsi Masalah</h2>
          <div className="text-sm text-gray-700 space-y-2">
            <p><strong>Mahasiswa:</strong> Ani, Budi, Citra, Dedi, Eka</p>
            <p><strong>Kelompok:</strong> K1 dan K2</p>
            <p><strong>Constraint:</strong></p>
            <ul className="list-disc ml-6">
              <li>C1: Ani dan Budi tidak boleh berada di kelompok yang sama</li>
              <li>C2: Citra harus berada di kelompok yang sama dengan Dedi</li>
              <li>C3: Eka tidak boleh sendirian (minimal 1 teman)</li>
              <li>C4: Setiap kelompok harus berisi minimal 2 mahasiswa</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSPVisualization;