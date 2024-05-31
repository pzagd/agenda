export default function TabButton({ children, onSelect, isActive }) {
  return (
      <button className={isActive ? "active" : ""} onClick={onSelect}>
        {children}
      </button>
  );
}
