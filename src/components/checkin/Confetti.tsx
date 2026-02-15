import React, { useEffect, useState } from 'react';
import './styles/confetti.css';

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

export const Confetti: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 1,
      size: 4 + Math.random() * 8,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="confetti-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="confetti-particle"
          style={{
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `fall ${particle.duration}s linear ${particle.delay}s forwards`,
            backgroundColor: ['#FFD93D', '#1F9E9E', '#FF6B6B', '#4FC7BC', '#A8DADC'][
              Math.floor(Math.random() * 5)
            ],
          }}
        />
      ))}
    </div>
  );
};
