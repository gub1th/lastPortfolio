import Phaser from 'phaser';
import { useEffect, useRef } from 'react';
import { Interface } from './components/Interface';
import { initGame } from './game/PhaserGame';

function App() {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) {
      gameRef.current = initGame();
    }

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <>
      <div id="phaser-container" style={{ width: '100%', height: '100%' }} />
      <Interface />
    </>
  );
}

export default App;
