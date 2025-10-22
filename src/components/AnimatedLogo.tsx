import { useNavigate } from 'react-router-dom';

export const AnimatedLogo = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-center mb-8">
      <h1
        onClick={() => navigate('/')}
        className="simple-logo text-4xl sm:text-5xl md:text-6xl font-display font-bold relative select-none"
      >
        Vitro
      </h1>
    </div>
  );
};
