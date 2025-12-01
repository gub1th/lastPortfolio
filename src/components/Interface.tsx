import { useStore } from '../store';

export const Interface = () => {
  const { currentSection, setSection } = useStore();

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none', // Allow clicking through to 3D scene
      zIndex: 10,
    }}>
      {/* Navigation Menu */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        pointerEvents: 'auto',
        display: 'flex',
        gap: '10px',
      }}>
        <button onClick={() => setSection('about')} style={btnStyle}>About</button>
        <button onClick={() => setSection('projects')} style={btnStyle}>Projects</button>
      </div>

      {/* Modal Overlay */}
      {currentSection && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'auto',
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '10px',
            maxWidth: '500px',
            position: 'relative',
          }}>
            <button 
              onClick={() => setSection(null)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '1.2rem',
              }}
            >
              ✕
            </button>
            
            {currentSection === 'about' && (
              <div>
                <h2>About Me</h2>
                <p>Hi! I'm a developer building cool 3D web experiences.</p>
                <p>I love React, Three.js, and creating interactive worlds.</p>
              </div>
            )}

            {currentSection === 'projects' && (
              <div>
                <h2>My Projects</h2>
                <ul>
                  <li><strong>Project A</strong>: A cool React app.</li>
                  <li><strong>Project B</strong>: A 3D game.</li>
                  <li><strong>Project C</strong>: This portfolio!</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const btnStyle = {
  padding: '10px 20px',
  borderRadius: '5px',
  border: 'none',
  backgroundColor: 'white',
  cursor: 'pointer',
  fontWeight: 'bold',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
};
