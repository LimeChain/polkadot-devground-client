import './App.css'
import Monaco from './components/codeEditor';
import { Header } from './components/header';


function App() {
  return (
    <div className="flex flex-col items-stretch justify-stretch w-screen h-screen">
      <Header />
      <Monaco />
    </div>
  )
}

export default App;
