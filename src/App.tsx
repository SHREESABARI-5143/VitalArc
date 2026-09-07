import { useState } from 'react';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import About from './pages/About';
import Workflow from './pages/Workflow';
import Model from './pages/Model';
import Results from './pages/Results';
import Demo from './pages/Demo';
import Data from './pages/Data'; // Add this import

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'about':
        return <About />;
      case 'workflow':
        return <Workflow />;
      case 'model':
        return <Model />;
      case 'results':
        return <Results />;
      case 'demo':
        return <Demo />;
      case 'data': // Add this case
        return <Data />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

export default App;