import React, { useState } from 'react';
import { Ticket, Users, Mic, Calendar, Clock, Star, Play, MapPin, Sparkles, Utensils, Award } from 'lucide-react';

interface Workshop {
  id: string;
  title: string;
  chefName: string;
  chefAvatar: string;
  price: number;
  date: string;
  duration: string;
  type: 'Online' | 'In Presenza';
  category: string;
  image: string;
  rating: number;
  spots: number;
}

const MOCK_WORKSHOPS: Workshop[] = [
  {
    id: 'w1',
    title: 'Secreti della Pasta Fresca',
    chefName: 'Nonna Maria',
    chefAvatar: '/images/nonna_maria.png',
    price: 35,
    date: '15 Maggio',
    duration: '2h 30min',
    type: 'In Presenza',
    category: 'Pasta',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    spots: 4
  },
  {
    id: 'w2',
    title: 'Sushi Masterclass: Oltre il Riso',
    chefName: 'Kenji Yamamoto',
    chefAvatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80',
    price: 45,
    date: '20 Maggio',
    duration: '3h',
    type: 'Online',
    category: 'Etnico',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    spots: 12
  },
  {
    id: 'w3',
    title: 'L\'Arte del Pane Africano (Injera)',
    chefName: 'Amara Bekele',
    chefAvatar: 'https://images.unsplash.com/photo-1531123414780-f74242c2b052?auto=format&fit=crop&w=400&q=80',
    price: 25,
    date: '12 Giugno',
    duration: '2h',
    type: 'In Presenza',
    category: 'Pane',
    image: 'https://images.unsplash.com/photo-1542354256-4b68e7d7f26c?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    spots: 6
  }
];

export const ExperiencesSection: React.FC = () => {
  const [filter, setFilter] = useState('Tutti');
  const categories = ['Tutti', 'Pasta', 'Etnico', 'Dolci', 'Pane'];

  const filteredWorkshops = filter === 'Tutti' 
    ? MOCK_WORKSHOPS 
    : MOCK_WORKSHOPS.filter(w => w.category === filter);

  return (
    <div className="animate-fade-in pb-20">
      {/* Hero Section */}
      <div className="relative h-[50vh] rounded-[3rem] overflow-hidden mb-12 shadow-2xl bg-black">
        <img 
          src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&w=1600&q=80" 
          alt="Cooking Class" 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 md:p-16 text-white max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-600 text-black text-[10px] font-black uppercase tracking-widest mb-4">
            <Mic className="w-3 h-3" />
            MESA Academy
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter italic">Cucina con lo Chef.</h1>
          <p className="text-lg text-gray-300 font-medium leading-relaxed">
            Non limitarti a mangiare. Entra nella cucina dei nostri esperti e impara i segreti tramandati da generazioni. Laboratori dal vivo e digitali.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-4 mb-10 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 ${
              filter === cat 
                ? 'bg-black text-white border-black shadow-lg scale-105' 
                : 'bg-white text-gray-500 border-gray-100 hover:border-orange-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Workshop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredWorkshops.map((workshop) => (
          <div key={workshop.id} className="group bg-white/70 backdrop-blur-xl rounded-[3rem] border border-white/60 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 relative">
            <div className="h-64 relative overflow-hidden">
              <img src={workshop.image} alt={workshop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg border border-white/20 ${workshop.type === 'Online' ? 'bg-blue-600 text-white' : 'bg-orange-600 text-black'}`}>
                  {workshop.type === 'Online' ? <Play className="w-3 h-3 inline mr-1" /> : <MapPin className="w-3 h-3 inline mr-1" />}
                  {workshop.type}
                </span>
              </div>
              <div className="absolute bottom-6 left-6 flex items-center gap-3">
                 <img src={workshop.chefAvatar} className="w-10 h-10 rounded-full border-2 border-white shadow-xl" alt={workshop.chefName} />
                 <span className="text-white font-black text-xs shadow-black drop-shadow-md">Chef {workshop.chefName}</span>
              </div>
            </div>

            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-orange-600 transition-colors">{workshop.title}</h3>
                <div className="bg-orange-50 px-3 py-1.5 rounded-xl text-orange-700 font-black text-lg">€{workshop.price}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  {workshop.date}
                </div>
                <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                  <Clock className="w-4 h-4 text-orange-500" />
                  {workshop.duration}
                </div>
                <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  {workshop.rating} / 5
                </div>
                <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                  <Users className="w-4 h-4 text-orange-500" />
                  {workshop.spots} posti rimasti
                </div>
              </div>

              <button className="w-full py-5 bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-black uppercase tracking-widest rounded-[1.5rem] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 shadow-orange-950/20 border-b-4 border-orange-850 hover:border-orange-950">
                <Ticket className="w-4 h-4" />
                Prenota Posto
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Educational Footer Banner */}
      <div className="mt-20 bg-orange-50 rounded-[3rem] p-10 border border-orange-100 flex flex-col md:flex-row items-center gap-10">
        <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-xl flex-shrink-0">
          <Award className="w-12 h-12 text-orange-600" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl font-black italic tracking-tight mb-2">Sei un Cuoco? Insegna il tuo mestiere.</h3>
          <p className="text-sm text-gray-600 font-medium">
            Entra nel programma Partner e trasforma la tua cucina in un'aula. Supportiamo la gestione delle iscrizioni e la promozione globale della tua Masterclass.
          </p>
        </div>
        <button className="px-10 py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-xl">
          Candidati Ora
        </button>
      </div>
    </div>
  );
};
