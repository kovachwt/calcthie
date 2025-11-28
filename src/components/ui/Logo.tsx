interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo = ({ className = '', size = 'md' }: LogoProps) => {
  const dimensions = {
    sm: 32,
    md: 48,
    lg: 64,
  };

  const dimension = dimensions[size];

  return (
    <img
      src="/images/logo.png"
      alt="Calcthie Logo"
      width={dimension}
      height={dimension}
      className={className}
    />
  );
};
