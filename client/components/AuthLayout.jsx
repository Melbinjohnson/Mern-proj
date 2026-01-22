const AuthLayout = ({ children, title }) => (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative" 
         style={{ backgroundImage: `url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070')`,margin:"0" }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl mx-4">
        <h2 className="text-3xl font-bold text-white text-center mb-8">{title}</h2>
        {children}
      </div>
    </div>
  );
export default AuthLayout;