import React, { useState, useEffect } from 'react';
import { MessageCircle, MapPin, ChevronRight, Heart, ArrowUp, Loader2 } from 'lucide-react';
import { db } from './firebase'; 
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

function App() {
  const WHATSAPP_NUMBER = "62895412755110";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isShrunk, setIsShrunk] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(data);
      setLoading(false);
    }, (error) => {
      console.error("Firebase Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsShrunk(true);
      } else {
        setIsShrunk(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const orderViaWA = (productName) => {
    const message = `Halo MakTika, saya mau pesan *${productName}*. Apakah masih tersedia ?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleFloatingBtnClick = (e) => {
    if (isShrunk) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] font-sans text-slate-900 pb-28">
      <header className="bg-white pb-8 shadow-sm">
        <div className="h-40 bg-orange-100 relative">
           <img 
            src="https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?auto=format&fit=crop&q=80&w=800" 
            className="w-full h-full object-cover opacity-80" 
            alt="Banner"
           />
           <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-xl flex items-center justify-center text-4xl">
                👵
              </div>
           </div>
        </div>
        <div className="mt-12 text-center px-4">
          <h1 className="text-2xl font-black tracking-tight text-[#433422]">MakTika</h1>
          <p className="text-[#A78B71] text-sm mt-1 font-medium italic">Sajian Snack Tradisional Premium</p>
          
          <div className="flex justify-center gap-3 mt-4">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="p-2 bg-[#E8F5E9] rounded-full text-green-600 hover:bg-green-200 transition-colors">
              <MessageCircle size={20}/>
            </a>
            <a 
              href="https://maps.app.goo.gl/WX9pra9e3e1oM2A88" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 bg-[#E3F2FD] rounded-full text-blue-600 hover:bg-blue-200 transition-colors"
            >
              <MapPin size={20}/>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 mt-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#433422]">
          <div className="w-1 h-5 bg-[#A78B71] rounded-full"></div>
          Menu Andalan
        </h2>

        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-stone-400">
              <Loader2 className="animate-spin mb-2" size={24} />
              <p className="text-xs font-bold uppercase tracking-widest">Memuat Menu...</p>
            </div>
          ) : (
            products.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#F3E5D8] flex p-3 gap-4 active:scale-[0.98] transition-transform">
                <img 
                  src={item.imageUrl} 
                  className="w-24 h-24 rounded-2xl object-cover shrink-0 bg-stone-50" 
                  alt={item.name} 
                />
                <div className="flex flex-col justify-center flex-1 py-1 min-w-0">
                  <div className="mb-2">
                    <h3 className="font-bold text-slate-800 leading-tight truncate">{item.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="font-black text-[#A78B71]">
                      Rp {item.price?.toLocaleString('id-ID')}
                    </span>
                    <button 
                      onClick={() => orderViaWA(item.name)}
                      className="bg-[#433422] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm active:bg-slate-700"
                    >
                      PESAN <ChevronRight size={12}/>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {!loading && products.length === 0 && (
            <p className="text-center text-stone-400 italic text-sm py-10">Belum ada menu di katalog.</p>
          )}
        </div>

        <div className="mt-8 bg-[#FEF9F3] p-4 rounded-2xl border border-[#F3E5D8]">
          <h4 className="font-bold text-[#A78B71] text-sm flex items-center gap-2">
            <MapPin size={16}/> Info Pengiriman
          </h4>
          <p className="text-xs text-[#8D6E63] mt-1 leading-relaxed">
            Pengiriman dari <a href="https://maps.app.goo.gl/WX9pra9e3e1oM2A88" target="_blank" rel="noopener noreferrer" className="hover:bg-blue-200 transition-colors">Gempol, Jakarta Timur</a>. Melayani instan (Grab/Gojek).
          </p>
        </div>

        <footer className="mt-12 mb-20 text-center">
          <p className="text-[#A78B71] text-xs font-semibold flex items-center justify-center gap-1 tracking-widest">
            made with<Heart size={12} className="fill-red-400 text-red-400 animate-pulse" />
          </p>
        </footer>
      </main>

      <div className="fixed bottom-6 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
        <a 
          href={isShrunk ? "#" : `https://wa.me/${WHATSAPP_NUMBER}`} 
          target={isShrunk ? "_self" : "_blank"} 
          rel="noopener noreferrer"
          onClick={handleFloatingBtnClick}
          className={`
            pointer-events-auto flex items-center justify-center bg-[#f63ed7] text-white shadow-2xl font-bold 
            transition-all duration-700 ease-in-out overflow-hidden
            ${isShrunk 
              ? 'w-14 h-14 rounded-full' 
              : 'w-full max-w-md h-14 rounded-2xl px-6'
            }
          `}
        >
          {isShrunk ? (
            <div key="icon" className="flex items-center justify-center animate-in fade-in zoom-in duration-500">
              <ArrowUp size={24} />
            </div>
          ) : (
            <div key="text" className="flex items-center gap-3 whitespace-nowrap animate-in fade-in duration-500">
              <MessageCircle size={24} />
              <span>Chat Penjualnya</span>
            </div>
          )}
        </a>
      </div>
    </div>
  );
}

export default App;