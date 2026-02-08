export default function Home() {
  return (
    <main className="p-8 min-h-screen">
      <h1 className="text-5xl font-bold mb-4 text-blue-300">Grommet</h1>
      <p className="text-slate-300 mb-8 text-lg">Welcome to the Grommet inventory and order management system.</p>
      <div className="grid gap-6 md:grid-cols-2 max-w-3xl">
        <a href="/stock-manager" className="p-8 bg-slate-700 border-2 border-blue-500 text-white rounded-lg hover:border-blue-400 hover:bg-slate-600 hover:shadow-lg transition group">
          <h2 className="text-2xl font-bold mb-2 text-blue-300 group-hover:text-blue-200">Stock Manager</h2>
          <p className="text-slate-200">Manage product inventory and stock levels</p>
        </a>
        <a href="/orders" className="p-8 bg-slate-700 border-2 border-blue-500 text-white rounded-lg hover:border-blue-400 hover:bg-slate-600 hover:shadow-lg transition group">
          <h2 className="text-2xl font-bold mb-2 text-blue-300 group-hover:text-blue-200">Orders</h2>
          <p className="text-slate-200">View and manage customer orders</p>
        </a>
      </div>
    </main>
  );
}
