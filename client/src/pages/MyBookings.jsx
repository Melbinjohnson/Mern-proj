import { useEffect, useState } from "react";
import axios from "axios";
import { Ticket, MapPin, Calendar, Clock, Loader2, Download, QrCode, Armchair } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/bookings/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Bookings API error:", err);
        setLoading(false);
      });
  }, [token]);

  const handleDownload = async (booking) => {
    const element = document.getElementById(`printable-ticket-${booking._id}`);
    if (!element) return;
  
    setIsGenerating(booking._id);
  
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          const ticket = clonedDoc.getElementById(`printable-ticket-${booking._id}`);
          ticket.style.display = "flex";
          ticket.style.opacity = "1";
          ticket.style.visibility = "visible";
          
          const allElements = ticket.getElementsByTagName("*");
          for (let el of allElements) {
            el.style.color = "#000000";
            el.style.borderColor = "#000000";
          }
        }
      });
  
      const imgData = canvas.toDataURL("image/jpeg", 0.9);
      const pdf = new jsPDF("l", "mm", [210, 80]);
      pdf.addImage(imgData, "JPEG", 0, 0, 210, 80);
      pdf.save(`Ticket_${booking.showDetails.movieName.replace(/\s+/g, "_")}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      generateTextPDF(booking);
    } finally {
      setIsGenerating(null);
    }
  };
  
  const generateTextPDF = (booking) => {
    const pdf = new jsPDF("l", "mm", "a5");
    pdf.setFontSize(22);
    pdf.text("CINEPASS - OFFICIAL TICKET", 15, 20);
    pdf.setFontSize(14);
    pdf.text(`Movie: ${booking.showDetails.movieName}`, 15, 40);
    pdf.text(`Theater: ${booking.theater.name}`, 15, 50);
    pdf.text(`Date: ${booking.showDetails.date} | Time: ${booking.showDetails.time}`, 15, 60);
    pdf.text(`Seats: ${booking.seats.join(", ")}`, 15, 70);
    pdf.setFontSize(10);
    pdf.text(`Booking ID: ${booking._id.toUpperCase()}`, 15, 90);
    pdf.save(`Ticket_${booking._id.slice(-6)}.pdf`);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-zinc-950">
      <Loader2 className="animate-spin text-red-600" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6 text-stone-800">
      <div className="max-w-5xl mx-auto space-y-8">
        <header>
          <h1 className="text-4xl font-black dark:text-white uppercase tracking-tighter">My Tickets</h1>
          <p className="text-zinc-700 dark:text-gray-400">Your digital gate pass to the movies.</p>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {bookings.map((b) => (
            <div key={b._id} className="relative group">
              {/* VISIBLE UI CARD */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl flex flex-col md:flex-row overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-1 p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-3xl font-black dark:text-white uppercase">{b.showDetails.movieName}</h2>
                    <span className="text-[10px] font-mono bg-zinc-300 dark:bg-zinc-300 px-2 py-1 rounded text-zinc-700 uppercase dark:text-black">
                      #{b._id.slice(-6)}
                    </span>
                  </div>
                  
                  {/* METADATA GRID */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                    <Detail icon={<MapPin size={14}/>} label="Theater" value={b.theater.name} />
                    <Detail icon={<Calendar size={14}/>} label="Date" value={b.showDetails.date} />
                    <Detail icon={<Clock size={14}/>} label="Time" value={b.showDetails.time} />
                    
                    {/* ADDED SEATS DISPLAY HERE */}
                    <Detail 
                      icon={<Armchair size={14}/>} 
                      label="Seats" 
                      value={b.seats && b.seats.length > 0 ? b.seats.join(", ") : "N/A"} 
                    />
                  </div>
                </div>

                <div className="md:w-64 bg-zinc-50 dark:bg-zinc-800/50 p-8 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l border-dashed border-zinc-300 dark:border-zinc-700">
                  <p className="text-sm font-bold text-zinc-700 dark:text-gray-400 uppercase mb-1">Total Paid</p>
                  <p className="text-3xl font-black mb-6 dark:text-white">₹{b.totalAmount}</p>
                  <button 
                    onClick={() => handleDownload(b)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-600/20"
                  >
                    {isGenerating === b._id ? <Loader2 className="animate-spin" size={18}/> : <Download size={18} />}
                    {isGenerating === b._id ? "Processing..." : "Download PDF"}
                  </button>
                </div>
              </div>

              {/* HIDDEN PRINTABLE TEMPLATE (Stay inside DOM but invisible) */}
              <div className="absolute top-0 left-0 opacity-0 pointer-events-none z-[-50]">
                <div 
                  id={`printable-ticket-${b._id}`} 
                  style={{ 
                    width: '800px', 
                    height: '300px', 
                    display: 'flex', 
                    backgroundColor: '#ffffff',
                    border: '4px solid #000000',
                    color: '#000000',
                    fontFamily: 'Arial, sans-serif'
                  }}
                >
                  <div style={{ flex: 1, padding: '30px', borderRight: '2px dashed #000000' }}>
                    <h2 style={{ fontSize: '14px', color: '#ff0000', margin: 0 }}>OFFICIAL PASS</h2>
                    <h1 style={{ fontSize: '40px', fontWeight: 'bold', margin: '5px 0' }}>{b.showDetails.movieName}</h1>
                    <p style={{ fontSize: '18px', marginTop: '10px' }}>{b.theater.name} | {b.theater.location}</p>
                    <p style={{ fontSize: '16px' }}>{b.showDetails.date} at {b.showDetails.time}</p>
                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                      {b.seats.map(s => (
                        <span key={s} style={{ background: '#000000', color: '#ffffff', padding: '5px 10px', borderRadius: '4px' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ width: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
                     <div style={{ border: '2px solid #000000', padding: '10px', backgroundColor: '#ffffff' }}>
                        <QrCode size={100} color="#000000" />
                     </div>
                     <p style={{ marginTop: '10px', fontWeight: 'bold' }}>₹{b.totalAmount}</p>
                     <p style={{ fontSize: '10px', color: '#666666' }}>#{b._id.slice(-6).toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Detail = ({ icon, label, value }) => (
  <div className="space-y-1">
    <p className="text-[10px] font-bold dark:text-gray-400 text-zinc-600 uppercase tracking-widest flex items-center gap-1">{icon} {label}</p>
    <p className="text-sm font-bold dark:text-zinc-300 leading-tight text-gray-800">{value}</p>
  </div>
);

export default MyBookings;