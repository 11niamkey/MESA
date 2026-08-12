
import React from 'react';
import { ShieldCheck, Info, FileText, HelpCircle, ChefHat, ArrowLeft, Heart, CheckCircle2 } from 'lucide-react';
import { ViewState } from '../types';

interface InfoPageProps {
  view: ViewState;
  onBack: () => void;
  onOpenOnboarding?: () => void;
}

export const InfoPage: React.FC<InfoPageProps> = ({ view, onBack, onOpenOnboarding }) => {
  const getContent = () => {
    switch (view) {
      case ViewState.ABOUT:
        return {
          title: "Chi Siamo",
          icon: <Info className="w-12 h-12 text-orange-600" />,
          content: (
            <div className="space-y-6">
              <p className="text-xl text-gray-700 leading-relaxed font-medium">
                MESA nasce da un'idea semplice: il cibo migliore è quello cucinato con amore in una vera cucina di casa.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Siamo una comunità di appassionati che credono nell'autenticità. In un mondo dominato dalle catene di fast food, noi offriamo un'alternativa: la possibilità di gustare piatti preparati da cuochi locali che usano ingredienti freschi e ricette tramandate da generazioni.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
                  <h4 className="font-black text-orange-900 mb-2">La nostra Missione</h4>
                  <p className="text-sm text-orange-800">Democratizzare il settore del food delivery permettendo a chiunque abbia talento in cucina di condividere la propria passione e generare un reddito.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <h4 className="font-black text-gray-900 mb-2">Sostenibilità</h4>
                  <p className="text-sm text-gray-700">Riduciamo gli sprechi alimentari e sosteniamo l'economia locale, favorendo chilometro zero e rapporti diretti tra produttore (chef) e consumatore.</p>
                </div>
              </div>
            </div>
          )
        };
      case ViewState.SAFETY:
        return {
          title: "Sicurezza & HACCP",
          icon: <ShieldCheck className="w-12 h-12 text-green-600" />,
          content: (
            <div className="space-y-6">
              <p className="text-xl text-gray-700 leading-relaxed font-medium">
                La tua salute è la nostra priorità assoluta.
              </p>
              <div className="bg-white border-2 border-green-100 rounded-3xl p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900">Certificazione HACCP</h4>
                    <p className="text-gray-600 text-sm">Ogni cuoco su MESA deve caricare un certificato HACCP valido prima di poter vendere il suo primo piatto.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900">Ispezioni delle Cucine</h4>
                    <p className="text-gray-600 text-sm">Effettuiamo controlli casuali e basati sui feedback per garantire che gli standard di pulizia MESA siano rispettati.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900">Tracciabilità Ingredienti</h4>
                    <p className="text-gray-600 text-sm">Incoraggiamo i nostri chef a utilizzare materie prime di alta qualità e a segnalare chiaramente tutti gli allergeni.</p>
                  </div>
                </div>
              </div>
            </div>
          )
        };
      case ViewState.BECOME_CHEF:
        return {
          title: "Diventa Chef MESA",
          icon: <ChefHat className="w-12 h-12 text-orange-600" />,
          content: (
            <div className="space-y-6">
              <p className="text-xl text-gray-700 leading-relaxed font-medium">
                Trasforma la tua cucina in una fonte di reddito.
              </p>
              <p className="text-gray-600">
                Sei il re del risotto o la regina delle lasagne? MESA ti offre gli strumenti per gestire il tuo piccolo business domestico senza stress.
              </p>
              <div className="bg-black text-white p-8 rounded-[2.5rem] mt-8">
                <h4 className="text-2xl font-black mb-6">I Vantaggi:</h4>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-black font-bold">1</span>
                    <span>Libertà totale di orari e menu.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-black font-bold">2</span>
                    <span>Commissioni trasparenti e pagamenti rapidi.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-black font-bold">3</span>
                    <span>Supporto AI per creare menu irresistibili.</span>
                  </li>
                </ul>
                <button 
                  onClick={onOpenOnboarding}
                  className="w-full mt-8 py-4 bg-orange-600 hover:bg-orange-500 text-black font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-orange-600/20 active:scale-95"
                >
                  Candidati ora (Compila Modulo & Documenti)
                </button>
              </div>
            </div>
          )
        };
      case ViewState.HELP:
        return {
          title: "Centro Assistenza",
          icon: <HelpCircle className="w-12 h-12 text-blue-600" />,
          content: (
            <div className="space-y-8">
               <div className="space-y-4">
                 <h4 className="font-black text-lg text-gray-900">Domande Frequenti</h4>
                 <div className="space-y-3">
                   {[
                     { q: "Come funziona il ritiro?", a: "Dopo la conferma, riceverai l'indirizzo dello chef. Ti basterà presentarti all'orario concordato." },
                     { q: "Cosa succede se c'è un ritardo?", a: "Puoi contattare lo chef direttamente tramite la chat nell'app o chiamare il nostro supporto." },
                     { q: "Posso cancellare un ordine?", a: "Sì, fino a 12 ore prima dell'orario previsto per la preparazione." }
                   ].map((faq, i) => (
                     <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                       <p className="font-bold text-gray-900 mb-1">{faq.q}</p>
                       <p className="text-sm text-gray-600">{faq.a}</p>
                     </div>
                   ))}
                 </div>
               </div>
               <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                  <p className="text-blue-800 font-bold mb-2">Hai ancora dubbi?</p>
                  <button className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl text-sm">Contattaci</button>
               </div>
            </div>
          )
        };
      default:
        return {
          title: "Note Legali",
          icon: <FileText className="w-12 h-12 text-gray-600" />,
          content: (
            <div className="space-y-6">
              <h4 className="font-bold text-gray-900">Termini e Condizioni d'Uso</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Utilizzando la piattaforma MESA, l'utente accetta di rispettare i presenti termini. MESA agisce come intermediario tra il cuoco casalingo e il cliente finale. Ogni transazione è soggetta alla verifica della qualità e al rispetto delle norme igienico-sanitarie.
              </p>
              <h4 className="font-bold text-gray-900 mt-8">Privacy Policy</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                I tuoi dati personali sono trattati nel rispetto del GDPR. Non condividiamo le tue informazioni con terze parti per scopi pubblicitari senza il tuo consenso esplicito. La tua posizione geografica viene utilizzata esclusivamente per mostrarti gli chef più vicini a te.
              </p>
            </div>
          )
        };
    }
  };

  const { title, icon, content } = getContent();

  return (
    <div className="animate-fade-in pb-12">
      <button 
        onClick={onBack}
        className="flex items-center text-gray-500 hover:text-orange-600 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
        Torna alla Home
      </button>

      <div className="bg-white rounded-[3rem] shadow-sm border border-orange-100 p-8 md:p-12 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
          <div className="p-5 bg-gray-50 rounded-3xl">
            {icon}
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">{title}</h1>
            <div className="h-1 w-24 bg-orange-600 mt-2 rounded-full"></div>
          </div>
        </div>

        <div className="max-w-3xl">
          {content}
        </div>
      </div>
    </div>
  );
};
