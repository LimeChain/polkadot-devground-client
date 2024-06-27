import './App.css';
import Monaco from './components/codeEditor';
import { Header } from './components/header';

function App() {
  return (
    <div className="flex h-screen w-screen flex-col items-stretch justify-stretch">
      <Header />
      <Monaco />
    </div>
  );
}

export default App;
