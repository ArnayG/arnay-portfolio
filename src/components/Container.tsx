type ContainerProps = {
  className?: string;
  children: React.ReactNode;
};

/**
 * The page's single width constraint. Kept out of <main> so full-bleed
 * sections can sit outside it without resorting to 100vw tricks.
 */
export default function Container({ className = "", children }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-6 ${className}`}>{children}</div>
  );
}
