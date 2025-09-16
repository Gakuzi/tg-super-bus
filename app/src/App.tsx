import './styles/global.css';
import SetupWizard from './setup/SetupWizard';

export default function App() {
  return (
    <div style={{ padding: 16 }}>
      <h2>TG Super-Bus</h2>
      <SetupWizard />
    </div>
  );
}