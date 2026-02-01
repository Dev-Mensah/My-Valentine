import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Mail, X, Copy, Check } from 'lucide-react';

const ValentineApp = () => {
  const [currentView, setCurrentView] = useState('create'); // 'create', 'proposal', 'success'
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [proposalId, setProposalId] = useState('');
  const [crushName, setCrushName] = useState('');
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [yesButtonSize, setYesButtonSize] = useState(1);
  const [noAttempts, setNoAttempts] = useState(0);
  const [showLongForm, setShowLongForm] = useState(false);
  const [essayText, setEssayText] = useState('');
  const [celebration, setCelebration] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const noButtonRef = useRef(null);

  // Generate unique ID
  const generateUniqueId = (name, email) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    const hash = btoa(`${name}-${email}-${timestamp}`).substring(0, 10);
    return `${name.toLowerCase().replace(/\s+/g, '-')}-${hash}-${random}`;
  };

  // Handle form submission
  const handleCreateProposal = async (e) => {
    e.preventDefault();
    const uniqueId = generateUniqueId(formData.name);
    setProposalId(uniqueId);
    
    // Store proposal data in localStorage (in production, use a database)
    // const proposalData = {
    //   crushName: formData.name,
    //   crushEmail: formData.email,
    //   proposalId: uniqueId,
    //   timestamp: new Date().toISOString()
    // };
    // localStorage.setItem(`proposal_${uniqueId}`, JSON.stringify(proposalData));
    
    // Show modal with the link
    setShowModal(true);
  };

  // Random romantic texts
  const romanticTexts = [
    { line1: "Roses are red, Violets are blue,", line2: "Life's a lot brighter whenever I'm with you." },
    { line1: "Hey there, beautiful soul,", line2: "You make my heart feel whole." },
    { line1: "If I could rearrange the alphabet,", line2: "I'd put U and I together." },
    { line1: "You're the reason I smile,", line2: "Let's make this Valentine's worthwhile." },
    { line1: "Stars shine bright, but not like you,", line2: "My Valentine wish? To be with you." },
    { line1: "Coffee is warm, chocolate is sweet,", line2: "But nothing compares to making your heart beat." },
    { line1: "They say love is blind,", line2: "But with you, it's the best thing I could find." },
    { line1: "Sugar is sweet, and so are you,", line2: "Will you be mine? Please say you do." }
  ];

  const [randomText] = useState(() => romanticTexts[Math.floor(Math.random() * romanticTexts.length)]);

  // Parse URL to check if we're on a proposal page or response page
  useEffect(() => {
    const path = window.location.pathname.substring(1);
    
    // Check if this is a response page
    if (path.startsWith('response/')) {
      const proposalPath = path.substring(9); // Remove 'response/' prefix
      const nameFromPath = proposalPath.split('-')[0].replace(/-/g, ' ');
      setCrushName(nameFromPath.charAt(0).toUpperCase() + nameFromPath.slice(1));
      setCurrentView('success');
      
      // Set random celebration
      const celebrations = ['fireworks', 'hearts', 'confetti'];
      setCelebration(celebrations[Math.floor(Math.random() * celebrations.length)]);
    }
    // Regular proposal page
    else if (path && path !== '') {
      const nameFromPath = path.split('-')[0].replace(/-/g, ' ');
      setCrushName(nameFromPath.charAt(0).toUpperCase() + nameFromPath.slice(1));
      setCurrentView('proposal');
    }
  }, []);

  // Move "No" button away from cursor
  const handleNoHover = (e) => {
    if (noButtonRef.current) {
      const button = noButtonRef.current;
      const rect = button.getBoundingClientRect();
      const container = button.parentElement.getBoundingClientRect();
      
      const maxX = container.width - rect.width - 20;
      const maxY = container.height - rect.height - 20;
      
      const newX = Math.random() * maxX;
      const newY = Math.random() * maxY;
      
      setNoButtonPosition({ x: newX, y: newY });
      setYesButtonSize(prev => Math.min(prev + 0.1, 2));
      setNoAttempts(prev => prev + 1);
    }
  };

  const handleNoClick = () => {
    setShowLongForm(true);
  };

  const handleYesClick = () => {
    const celebrations = ['fireworks', 'hearts', 'confetti'];
    setCelebration(celebrations[Math.floor(Math.random() * celebrations.length)]);
    setCurrentView('success');
    // Show share modal after a short delay to let celebration start
    setTimeout(() => setShowShareModal(true), 1500);
  };

  const copyToClipboard = () => {
    const link = `${window.location.origin}/${proposalId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Share functions
  const getResponseLink = () => {
    const currentPath = window.location.pathname.substring(1);
    return `${window.location.origin}/response/${currentPath}`;
  };
  
  const shareMessage = `🎉 I said YES to being your Valentine! 💕 Check out my response here:`;
  
  const shareViaEmail = () => {
    const link = getResponseLink();
    const subject = encodeURIComponent("I Said YES! 💕");
    const body = encodeURIComponent(`${shareMessage}\n\n${link}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const shareViaWhatsApp = () => {
    const link = getResponseLink();
    const text = encodeURIComponent(`${shareMessage}\n${link}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareViaTwitter = () => {
    const link = getResponseLink();
    const text = encodeURIComponent(`${shareMessage} ${link}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const shareViaFacebook = () => {
    const link = getResponseLink();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&quote=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  const shareViaTelegram = () => {
    const link = getResponseLink();
    const text = encodeURIComponent(`${shareMessage}\n${link}`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${text}`, '_blank');
  };

  const shareViaMessenger = () => {
    const link = getResponseLink();
    window.open(`fb-messenger://share/?link=${encodeURIComponent(link)}`, '_blank');
  };

  const copyShareMessage = () => {
    const link = getResponseLink();
    const fullMessage = `${shareMessage}\n\n${link}`;
    navigator.clipboard.writeText(fullMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = essayText.trim().split(/\s+/).filter(word => word.length > 0).length;
  const requiredWords = 10000000;

  // Share Response Modal Component
  const ShareModal = () => {
    const responseLink = getResponseLink();
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-scale-in">
          <button
            onClick={() => setShowShareModal(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
              <Heart className="text-white" size={40} fill="white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Share Your Response! 💕</h2>
            <p className="text-gray-600">Let them know you said YES!</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6 border-2 border-green-200">
            <p className="text-sm text-gray-600 mb-2 font-semibold">Your response link:</p>
            <div className="bg-white rounded-lg p-3 border-2 border-green-300 mb-3">
              <p className="text-xs text-gray-600 break-all">{responseLink}</p>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              <span className="font-semibold">Message:</span> {shareMessage}
            </p>
            <button
              onClick={copyShareMessage}
              className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all font-semibold text-sm border-2 border-gray-200"
            >
              {copied ? (
                <>
                  <Check size={16} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy Link & Message
                </>
              )}
            </button>
          </div>
          
          <div className="space-y-2 mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Share via:</p>
            
            {/* WhatsApp */}
            <button
              onClick={shareViaWhatsApp}
              className="w-full flex items-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white px-4 py-3 rounded-xl transition-all font-semibold"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </button>
            
            {/* Email */}
            <button
              onClick={shareViaEmail}
              className="w-full flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-xl transition-all font-semibold"
            >
              <Mail size={24} />
              Email
            </button>
            
            {/* Messenger */}
            <button
              onClick={shareViaMessenger}
              className="w-full flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-4 py-3 rounded-xl transition-all font-semibold"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"/>
              </svg>
              Messenger
            </button>
            
            {/* Telegram */}
            <button
              onClick={shareViaTelegram}
              className="w-full flex items-center gap-3 bg-[#0088cc] hover:bg-[#0077b3] text-white px-4 py-3 rounded-xl transition-all font-semibold"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Telegram
            </button>
            
            {/* Twitter */}
            <button
              onClick={shareViaTwitter}
              className="w-full flex items-center gap-3 bg-black hover:bg-gray-800 text-white px-4 py-3 rounded-xl transition-all font-semibold"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              X (Twitter)
            </button>
            
            {/* Facebook */}
            <button
              onClick={shareViaFacebook}
              className="w-full flex items-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] text-white px-4 py-3 rounded-xl transition-all font-semibold"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
            
            {/* Instagram Note */}
            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white px-4 py-3 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="font-semibold">Instagram</span>
              </div>
              <p className="text-sm opacity-90">
                Copy the link & message above and share on Instagram story or DM! 💕
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowShareModal(false)}
            className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-all mt-4"
          >
            Maybe Later
          </button>
        </div>
      </div>
    );
  };

  // Link Modal Component
  const LinkModal = () => {
    const link = `${window.location.origin}/${proposalId}`;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-scale-in">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center">
              <Heart className="text-white" size={32} fill="white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Link Created! 🎉</h2>
            <p className="text-gray-600">Share this special link with {formData.name}</p>
          </div>
          
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2 font-semibold">Your Valentine Proposal Link:</p>
            <div className="flex items-center gap-2 bg-white rounded-lg p-3 border-2 border-pink-200">
              <input
                type="text"
                value={link}
                readOnly
                className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
              />
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-red-600 transition-all font-semibold text-sm"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
            <div className="flex items-start gap-2">
              <Sparkles className="text-yellow-500 mt-0.5" size={20} />
              <div>
                <p className="text-sm text-yellow-900 font-semibold mb-1">Pro Tip! ✨</p>
                <p className="text-sm text-yellow-800">
                  Share this link with <span className="font-semibold">{formData.name}</span> via WhatsApp, email, or text message!
                </p>
                <p className="text-xs text-yellow-700 mt-2">
                  💡 They'll be able to share their response directly with you!
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                copyToClipboard();
              }}
              className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold py-3 rounded-xl hover:from-green-500 hover:to-emerald-600 transition-all shadow-lg"
            >
              Copy Link & Share
            </button>
            
            <button
              onClick={() => {
                setShowModal(false);
                setFormData({ name: '', email: '' });
              }}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-all"
            >
              Create Another Proposal
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Fireworks animation
  const Fireworks = () => (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full animate-ping"
          style={{
            backgroundColor: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#ff6ba9'][Math.floor(Math.random() * 4)],
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );

  // Hearts animation
  const Hearts = () => (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <Heart
          key={i}
          className="absolute animate-float"
          size={20 + Math.random() * 40}
          fill="#ff6b9d"
          color="#ff6b9d"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10%',
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );

  // Confetti animation
  const Confetti = () => (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 animate-fall"
          style={{
            backgroundColor: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#ff6ba9', '#95e1d3'][Math.floor(Math.random() * 5)],
            left: `${Math.random() * 100}%`,
            top: '-10%',
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-red-200 flex items-center justify-center p-4">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes fall {
          to { transform: translateY(100vh) rotate(720deg); }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-float { animation: float linear infinite; }
        .animate-fall { animation: fall linear infinite; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
      `}</style>

      {/* Link Modal */}
      {showModal && <LinkModal />}

      {/* Share Response Modal */}
      {showShareModal && <ShareModal />}

      {/* Create Proposal Form */}
      {currentView === 'create' && (
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full transform hover:scale-105 transition-transform">
          <div className="text-center mb-6">
            <Heart className="mx-auto mb-4 text-red-500" size={60} fill="#ef4444" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Be My Valentine? 💕</h1>
            <p className="text-gray-600">Create a special proposal link for your crush!</p>
          </div>
          
          <form onSubmit={handleCreateProposal} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Their Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-pink-300 rounded-xl focus:outline-none focus:border-pink-500 transition-colors"
                placeholder="e.g: Adwoa Serwaa"
              />
            </div>
          
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold py-3 rounded-xl hover:from-pink-600 hover:to-red-600 transform hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Mail size={20} />
              Create Proposal Link
            </button>
          </form>
        </div>
      )}

      {/* Proposal View */}
      {currentView === 'proposal' && !showLongForm && (
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <Sparkles className="absolute top-4 left-4 text-yellow-400" />
            <Sparkles className="absolute top-4 right-4 text-pink-400" />
            <Sparkles className="absolute bottom-4 left-4 text-red-400" />
            <Sparkles className="absolute bottom-4 right-4 text-purple-400" />
          </div>
          
          <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-600">
            Hey {crushName}! 💖
            
          </h1>
          
          <p className="text-2xl mb-2 font-semibold bg-clip-text bg-gradient-to-r from-pink-500 to-red-600 text-transparent">
            <span className="block mb-4">{randomText.line1}</span>
            <span className="block mb-4">{randomText.line2}</span>
          </p>
          
          <p className="text-3xl mb-8 text-gray-700 font-semibold">
            Will you be my Valentine?
          </p>
          
          <div className="flex gap-6 justify-center items-center relative" style={{ minHeight: '200px' }}>
            <button
              onClick={handleYesClick}
              className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold py-4 px-12 rounded-full hover:from-green-500 hover:to-emerald-600 transform hover:scale-110 transition-all shadow-lg text-xl"
              style={{ transform: `scale(${yesButtonSize})` }}
            >
              YES! 💚
            </button>
            
            <button
              ref={noButtonRef}
              onMouseEnter={handleNoHover}
              onTouchStart={handleNoHover}
              onClick={handleNoClick}
              className="bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold py-4 px-12 rounded-full shadow-lg text-xl transition-all duration-200 absolute"
              style={{
                left: `${noButtonPosition.x}px`,
                top: `${noButtonPosition.y}px`,
              }}
            >
              No
            </button>
          </div>
          
          {noAttempts > 0 && (
            <p className="mt-6 text-pink-600 font-semibold animate-pulse">
              {noAttempts < 3 && "Come on, don't be shy! 😊"}
              {noAttempts >= 3 && noAttempts < 6 && "You know you want to say yes! 💕"}
              {noAttempts >= 6 && noAttempts < 10 && "The Yes button is getting bigger for a reason! 😉"}
              {noAttempts >= 10 && "Just click Yes already! We both know that's what you want! 💖"}
            </p>
          )}
        </div>
      )}

      {/* Long Form (if they click No) */}
      {showLongForm && (
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-4xl w-full">
          <h1 className="text-4xl font-bold mb-6 text-red-600 text-center">
            REJECTION ESSAY REQUIREMENT 📝
          </h1>
          
          <p className="text-xl mb-4 text-gray-700 text-center font-semibold">
            If you really want to say no, please write an essay explaining why.
          </p>
          
          <p className="text-3xl mb-6 text-center font-bold text-purple-600">
            Minimum word count: {requiredWords.toLocaleString()} words
          </p>
          
          <div className="mb-4">
            <textarea
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              className="w-full h-64 px-4 py-3 border-2 border-red-300 rounded-xl focus:outline-none focus:border-red-500 resize-none"
              placeholder="Begin your 10,000,000 word essay here... (This might take a while 😏)"
            />
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <p className="text-lg font-semibold text-gray-700">
              Current word count: {wordCount.toLocaleString()} / {requiredWords.toLocaleString()}
              {wordCount > 0 && ` (${((wordCount / requiredWords) * 100).toFixed(8)}% complete)`}
            </p>
            <button
              disabled
              className="bg-gray-300 text-gray-500 font-bold py-3 px-8 rounded-full cursor-not-allowed"
            >
              Submit Essay (Locked 🔒)
            </button>
          </div>
          
          <div className="text-center border-t-2 border-gray-200 pt-6">
            <p className="text-gray-600 mb-4">Or you could just...</p>
            <button
              onClick={handleYesClick}
              className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold py-4 px-12 rounded-full hover:from-green-500 hover:to-emerald-600 transform hover:scale-110 transition-all shadow-lg text-xl"
            >
              Say YES Instead! 💚
            </button>
          </div>
        </div>
      )}

      {/* Success View */}
      {currentView === 'success' && (
        <>
          {celebration === 'fireworks' && <Fireworks />}
          {celebration === 'hearts' && <Hearts />}
          {celebration === 'confetti' && <Confetti />}
          
          <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center relative z-10">
            <h1 className="text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-600 animate-pulse">
              YAAAAY! 🎉
            </h1>
            
            <p className="text-3xl mb-8 text-gray-700 font-semibold">
              {window.location.pathname.startsWith('/response/') 
                ? `${crushName} said YES to being your Valentine! 💕`
                : `${crushName} said YES! 💕`
              }
            </p>
            
            <div className="text-6xl mb-8">
              {celebration === 'fireworks' && '🎆'}
              {celebration === 'hearts' && '💖'}
              {celebration === 'confetti' && '🎊'}
            </div>
            
            <p className="text-xl text-gray-600">
              This is the start of something beautiful! 💑
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ValentineApp;
