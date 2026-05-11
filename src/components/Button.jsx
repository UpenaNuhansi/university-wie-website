export default function Button({ children, type = 'button', ...props }) {
  return (
    <button
      type={type}
      className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      {...props}
    >
      {children}
    </button>
  );
}
