export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>

      {/* Text */}
      <p className="mt-4 text-gray-600 font-medium">Loading, please wait...</p>
    </div>
  );
}
