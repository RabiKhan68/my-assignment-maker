export default function ShootingStars() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(20)].map((_, i) => (
        <span
          key={i}
          className="shooting-star"
          style={{
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
            animationDelay: Math.random() * 5 + "s",
            animationDuration: 2 + Math.random() * 3 + "s",
          }}
        />
      ))}
    </div>
  );
}