import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import ArmModel from "./assets/ArmModel";
import DroneModel from "./assets/DroneModel";
import MekhexModel from "./assets/MekhexModel";
function App() {
  // States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [userMessage, setUserMessage] = useState("");
   const [formData, setFormData] = useState({
    from_name: "",
    from_phone: "",
    from_email: "",
    message: "",
  });
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello 👋 Welcome to InnovVortex. I can give you instant details about our products, technologies, services, or contact info. What can I help you find today?"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Structural Section Refs for Global Search Context Scrolling
  const productsSectionRef = useRef(null);
  const technologiesSectionRef = useRef(null);
  const servicesSectionRef = useRef(null);
  const contactSectionRef = useRef(null);
  const chatEndRef = useRef(null);

  // Static Datasets
  const products = [
  {
    title: "Mekhex",
    category: "Autonomous Robotics",
    image: "/mekhex.png",
    description:
      "Electromagnetic hexapod robot engineered for autonomous inspection and maintenance on ferromagnetic industrial structures.",

    features: [
      "Magnetic Adhesion",
      "Vertical/Overhead Traversal",
      "Inspection Camera Suite",
      "Automated Bolt-Torque Module"
    ],

    specs: {
  weight: "3.5kg",
  "Max Climb Angle": "360°",
  "Bolt Torque Range": "1000 Nm",
  "Operating Time": "30 Min"
}
  },

  {
  title: "Autonomous Drone",
  category: "Aerial Robotics",
  image: "/drone.png",

  description:
    "Precision delivery for supplies and tools in challenging environments. Designed for critical situations, this drone facilitates rapid and accurate delivery of essential items to hard-to-reach or dangerous locations.",

  features: [
    "1-2 kg Payload Capacity",
    "Modular Drop Mechanism",
    "Thermal + 4K Camera",
    "Autonomous Waypoint Delivery"
  ],

  specs: {
    "Payload Mass": "1.5 kg",
    "Endurance @ Payload": "25 min",
    "Range": "3 km",
    "Payload Options": "Customizable"
  }
},

  {
    title: "AI Powered Arm",
    category: "AI Robotics",
    image: "/roboarm.png",
    description:
      "AI-powered robotic arm designed for industrial automation, smart manipulation and adaptive control systems.",

    features: [
      "Gravity Mode",
      "Smart Vision Tracking",
      "Industrial Automation",
      "AI Powered Path Plan"
    ],

    specs: {
      payload: "2kgs",
      DOF: "6",
      control: "AI Based",
      reach: "650mm"
    }
  }
];

  const technologies = [
    { title: "Artificial Intelligence", desc: "Intelligent decision-making systems for complex robotic environments." },
    { title: "Machine Learning", desc: "Adaptive algorithms that enable robots to learn and evolve continuously." },
    { title: "Computer Vision", desc: "Advanced perception systems for real-time environmental understanding." },
    { title: "Autonomous Navigation", desc: "Precision navigation systems for intelligent autonomous movement." },
    { title: "Embedded Systems", desc: "High-performance hardware for real-time robotic control." },
    { title: "Industrial Automation", desc: "Robotics solutions for intelligent industrial operations." }
  ];

  const services = [
    { title: "AI & Robotics Development", desc: "We design and develop intelligent robotic systems integrated with AI-driven decision making, autonomous navigation and adaptive automation technologies." },
    { title: "Embedded Systems Engineering", desc: "Our embedded solutions combine hardware precision, real-time processing and intelligent system control to build scalable robotic platforms." },
    { title: "Autonomous Navigation Systems", desc: "We build intelligent navigation systems powered by computer vision, AI perception and real-time environmental analysis." },
    { title: "Industrial Automation Solutions", desc: "InnovVortex develops smart automation solutions that optimize industrial workflows and enable intelligent machine-to-machine communication." }
  ];

  // SECTION KEYWORD MATCH ENGINE
  const normalizedSearch = searchTerm.toLowerCase().trim();
  const matchesProductsHeading = "products".includes(normalizedSearch) || "robotics".includes(normalizedSearch);
  const matchesTechHeading = "technologies".includes(normalizedSearch) || "research".includes(normalizedSearch);
  const matchesServicesHeading = "services".includes(normalizedSearch) || "engineering".includes(normalizedSearch);
  const matchesContactHeading = ["contact", "email", "phone", "address", "location", "hours", "office"].some(keyword => 
    normalizedSearch.includes(keyword)
  );

  // GLOBAL FILTER LOGIC 
  const filteredProducts = products.filter((p) =>
    matchesProductsHeading ||
    p.title.toLowerCase().includes(normalizedSearch) ||
    p.category.toLowerCase().includes(normalizedSearch) ||
    p.description.toLowerCase().includes(normalizedSearch)
  );

  const filteredTechnologies = technologies.filter((t) =>
    matchesTechHeading ||
    t.title.toLowerCase().includes(normalizedSearch) ||
    t.desc.toLowerCase().includes(normalizedSearch)
  );

  const filteredServices = services.filter((s) =>
    matchesServicesHeading ||
    s.title.toLowerCase().includes(normalizedSearch) ||
    s.desc.toLowerCase().includes(normalizedSearch)
  );

  // VISIBILITY SCHEDULERS
  const showProductsSection = searchTerm === "" || filteredProducts.length > 0 || matchesProductsHeading;
  const showTechnologiesSection = searchTerm === "" || filteredTechnologies.length > 0 || matchesTechHeading;
  const showServicesSection = searchTerm === "" || filteredServices.length > 0 || matchesServicesHeading;
  const showContactSection = searchTerm === "" || matchesContactHeading;

  // Master Fallback State
  const noResultsFound = !showProductsSection && !showTechnologiesSection && !showServicesSection && !matchesContactHeading;

  // Auto-scrolling viewport trigger based on matches
  useEffect(() => {
    const query = searchTerm.trim().toLowerCase();
    if (query === "") return;

    if (matchesContactHeading && contactSectionRef.current) {
      contactSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if ((matchesServicesHeading || services.some(s => s.title.toLowerCase().includes(query))) && servicesSectionRef.current) {
      servicesSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if ((matchesTechHeading || technologies.some(t => t.title.toLowerCase().includes(query))) && technologiesSectionRef.current) {
      technologiesSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (productsSectionRef.current) {
      productsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [searchTerm]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const images = ["/robot1.png", "/robot2.png", "/robot3.png"];
    let index = 0;
    const slider = document.getElementById("robot-slider");

    const interval = setInterval(() => {
      index = (index + 1) % images.length;
      if (slider) {
        slider.style.opacity = 0;
        setTimeout(() => {
          slider.src = images[index];
          slider.style.opacity = 1;
        }, 500);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
  setSelectedProduct(products[0]);
}, []);


  const handleTouchStart = (e) => {
  setTouchStart(e.targetTouches[0].clientX);
};

const handleTouchMove = (e) => {
  setTouchEnd(e.targetTouches[0].clientX);
};

const handleTouchEnd = () => {
  if (touchStart - touchEnd > 50) {
    const newIndex = (currentIndex + 1) % products.length;
    setCurrentIndex(newIndex);
    setSelectedProduct(products[newIndex]);
  }

  if (touchStart - touchEnd < -50) {
    const newIndex =
      (currentIndex - 1 + products.length) % products.length;

    setCurrentIndex(newIndex);
    setSelectedProduct(products[newIndex]);
  }
};
  const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};
  
  const sendEmail = (e) => {
  e.preventDefault();

  emailjs
    .send(
      "service_f94jivv",
      "template_p247zb5",
      {
        from_name: formData.from_name,
        from_phone: formData.from_phone,
        from_email: formData.from_email,
        message: formData.message,
      },
      "75VerJ5jv4LMVpknB"
    )
    .then(() => {
      alert("Message Sent Successfully!");

      setFormData({
        from_name: "",
        from_phone: "",
        from_email: "",
        message: "",
      });
    })
    .catch((error) => {
      console.log(error);
      alert("Failed to send message.");
    });
};
  // KNOWLEDGE-BASED AI CHATBOT CONTROLLER
  const sendMessage = () => {
    if (!userMessage.trim()) return;

    const currentInput = userMessage;
    setMessages((prev) => [...prev, { sender: "user", text: currentInput }]);
    setUserMessage("");
    setIsTyping(true);

    setTimeout(() => {
      let botReply = "";
      const lowerInput = currentInput.toLowerCase().trim();
      
      // Intent Flags
      const isGreeting = ["hi", "hello", "hey", "yo", "help"].some(g => lowerInput === g || lowerInput.startsWith(g + " "));
      const isGeneralQuery = ["about", "what is this", "what do you do", "website", "innovvortex"].some(keyword => lowerInput.includes(keyword));

      // Direct Match Checks
      const matchedProduct = products.find(p => lowerInput.includes(p.title.toLowerCase()));
      const matchedTech = technologies.find(t => lowerInput.includes(t.title.toLowerCase()));
      const matchedService = services.find(s => lowerInput.includes(s.title.toLowerCase()));

      if (isGeneralQuery) {
        botReply = "InnovVortex is an advanced robotics and AI automation company! This website showcases our specialized industrial robotic systems (Mekhex, Hexdoc, and our AI Powered Arm), the core tech we use, and the engineering services we offer to optimize industrial workflows.";
      } else if (matchedProduct) {
        botReply = `Our '${matchedProduct.title}' is a platform in our ${matchedProduct.category} line. It is designed as an ${matchedProduct.description.toLowerCase()}`;
      } else if (matchedTech) {
        botReply = `Regarding ${matchedTech.title}: We incorporate this directly into our smart automation hardware pipelines. ${matchedTech.desc}`;
      } else if (matchedService) {
        botReply = `We offer customized engineering for '${matchedService.title}': ${matchedService.desc}`;
      } else if (lowerInput.includes("product") || lowerInput.includes("robot") || lowerInput.includes("hardware") || lowerInput.includes("models")) {
        const productCatalog = products.map(p => `• ${p.title} (${p.category}):\n  ${p.description}`).join("\n\n");
        botReply = "Here is our current lineup of advanced robotic platforms:\n\n" + productCatalog + "\n\nWhich one would you like more technical specifications or key features on?";
      } else if (lowerInput.includes("tech") || lowerInput.includes("capability") || lowerInput.includes("research")) {
        const techList = technologies.map(t => t.title).join(", ");
        botReply = `Our systems are powered by modern engineering pillars including: ${techList}.`;
      } else if (lowerInput.includes("service")) {
        const serviceList = services.map(s => s.title).join(", ");
        botReply = `Our commercial services include: ${serviceList}.`;
      } else if (lowerInput.includes("contact") || lowerInput.includes("phone") || lowerInput.includes("email") || lowerInput.includes("address") || lowerInput.includes("location") || lowerInput.includes("number") || lowerInput.includes("mail")) {
        botReply = "You can reach our team through multiple channels!\n\n" +
                   "✉️ Emails:\n" +
                   "• bhanumahesh938@gmail.com\n" +
                   "• manishkumarveliboina@gmail.com\n\n" +
                   "📞 Phone Numbers:\n" +
                   "• +91 90147 85659\n" +
                   "• +91 74164 42006\n\n" +
                   "📍 Office Address:\n" +
                   "Plot No-26 and 27 NP Mallapur, Venkatapur Balapur Saroornagar, K.V.Rangareddy, Telangana - 500005.";
      } else if (isGreeting) {
        botReply = "Hi there! I'm your assistant here at InnovVortex. Ask me anything about our specific Products, core Technologies, Services, or grab our Contact information directly.";
      } else {
        // Deep search check inside description blocks before falling back
        const softDescriptionMatch = products.find(p => p.description.toLowerCase().includes(lowerInput)) ||
                                      technologies.find(t => t.desc.toLowerCase().includes(lowerInput)) ||
                                      services.find(s => s.desc.toLowerCase().includes(lowerInput));
        
        if (softDescriptionMatch) {
          botReply = `That matches details in our systems: "${softDescriptionMatch.desc || softDescriptionMatch.description}"`;
        } else {
          botReply = "I couldn't quite find an exact match for that keyword. Try asking about our core products (Mekhex, Hexdoc, AI Arm), our tech stack, or our engineering services!";
        }
      }

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="bg-black text-white overflow-x-hidden min-h-screen">
      
      {/* NAVBAR WITH LEFT-ALIGNED BRAND & INTERACTIVE GLOBAL SEARCH */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-2xl">
        <div className="w-full px-10 md:px-20 py-6 flex items-center justify-between gap-6">
          
          <div className="flex items-center gap-6 md:gap-10 flex-1 max-w-xl">
            <div className="flex items-center gap-4 shrink-0">
              <img src="/logo.png" alt="logo" className="w-12 h-12 object-contain" />
              <h1 className="text-2xl font-medium tracking-wide hidden sm:block">InnovVortex</h1>
            </div>

            <div className="w-full relative">
              <input
                type="text"
                placeholder="Search products, tech, services, headings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111] border border-white/10 focus:border-white/30 rounded-full px-5 py-2.5 text-sm text-white outline-none placeholder-white/40 transition-all"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="hidden lg:flex gap-10 text-sm text-white/70 shrink-0">
            <a href="#" className="hover:text-white transition">Home</a>
            <a href="#products" className="hover:text-white transition">Products</a>
            <a href="#about" className="hover:text-white transition">
  About
</a>
            <a href="#services" className="hover:text-white transition">Services</a>
            <a href="#contact" className="hover:text-white transition">Contact</a>
          </div>

        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute top-0 left-0 w-full h-full object-cover">
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/55"></div>
        <div className="relative z-10 h-full flex items-center">
          <div className="px-10 md:px-20 max-w-7xl">
            <p className="uppercase tracking-[0.35em] text-white/60 text-sm mb-10">ADVANCED ROBOTICS</p>
            <h1 className="text-5xl md:text-[5.5rem] font-semibold leading-[0.95] tracking-tight max-w-4xl">
              Building<br />the future<br />of intelligent<br />robotics.
            </h1>
            <p className="mt-12 text-white/75 text-2xl leading-relaxed max-w-3xl">
              InnovVortex develops advanced autonomous systems, intelligent robotics and AI technologies designed for the next generation of industrial automation.
            </p>
            <div className="mt-14 flex gap-6">
              <a href="#products">
                <button className="bg-white text-black px-10 py-5 rounded-full text-lg font-medium hover:scale-105 transition duration-300">
                  Explore
                </button>
              </a>
              <a href="#about">
                <button className="border border-white px-10 py-5 rounded-full text-lg hover:bg-white hover:text-black transition duration-300">
                  Research
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS SLIDER SECTION */}
{showProductsSection && (
  <section
    id="products"
    ref={productsSectionRef}
    className="relative py-32 px-6 md:px-16 bg-black overflow-hidden"
  >
    <div className="max-w-[1650px] mx-auto">

      {/* HEADING */}
      <div className="text-center mb-14">
        

        <h2 className="text-4xl md:text-6xl font-semibold leading-tight">
          Innovation In Motion
        </h2>
      </div>

      {/* SLIDER */}
      <div className="relative flex items-center justify-center">

        {/* LEFT BUTTON */}
        <button
          onClick={() =>
            setCurrentIndex(
              (prev) => (prev - 1 + products.length) % products.length
            )
          }
          className="absolute -left-2 md:-left-8 z-20 border border-white/30 bg-black text-white w-16 h-16 rounded-full text-4xl hover:bg-white hover:text-black transition duration-300"
        >
          ←
        </button>

        {/* CARD */}
        <motion.div
          key={products[currentIndex].title}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full rounded-[3rem] border border-white/10 bg-[#050505] p-8 md:p-14"
        >

          <div className="grid md:grid-cols-2 gap-14 items-center">

            {/* LEFT SIDE */}
            <div>

              <p className="uppercase tracking-[0.3em] text-white/40 text-sm mb-6">
                {products[currentIndex].category}
              </p>

              <h3 className="text-5xl md:text-7xl font-semibold mb-8 leading-none">
                {products[currentIndex].title}
              </h3>

              <p className="text-white/70 text-xl leading-relaxed mb-10 max-w-2xl">
                {products[currentIndex].description}
              </p>

              {/* FEATURES */}
              <div className="grid grid-cols-2 gap-6 mb-12">

                {products[currentIndex].features.map((feature, index) => (
                  <div
                    key={index}
                    className="border border-white/10 rounded-2xl p-5"
                  >
                    <h4 className="text-white text-lg font-semibold mb-2">
                      {feature}
                    </h4>

                    

                  </div>
                ))}

              </div>

              {/* BUTTONS */}
              <div className="flex flex-wrap gap-6">

                <button
  onClick={() =>
    contactSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
  className="bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition duration-300"
>
  Know More
</button>


              </div>

            </div>

            {/* RIGHT SIDE */}
            <div>

              <div className="border border-white/10 rounded-[2rem] p-6 bg-black">

                {/* IMAGE */}
                <div className="flex justify-center">

  {products[currentIndex].title === "AI Powered Arm" ? (

    <div className="w-full h-[420px]">
      <ArmModel />
    </div>

  ) : products[currentIndex].title === "Autonomous Drone" ? (

    <div className="w-full h-[420px]">
      <DroneModel />
    </div>

  ) : products[currentIndex].title === "Mekhex" ? (

    <div className="w-full h-[420px]">
      <MekhexModel />
    </div>

  ) : (

    <img
      src={products[currentIndex].image}
      alt={products[currentIndex].title}
      className="w-full max-w-[700px] h-[420px] object-contain"
    />

  )}

</div>

                {/* BOTTOM INFO */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 border-t border-white/10 pt-8">

                  {Object.entries(products[currentIndex].specs).map(
                    ([key, value], index) => (

                      <div key={index}>

                        <p className="text-white/40 text-sm mb-2">
                          {key}
                        </p>

                        <h4 className="text-lg font-semibold whitespace-nowrap">
                          {value}
                        </h4>

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          </div>

        </motion.div>

        {/* RIGHT BUTTON */}
        <button
          onClick={() =>
            setCurrentIndex(
              (prev) => (prev + 1) % products.length
            )
          }
          className="absolute -right-2 md:-right-8 z-20 border border-white/30 bg-black text-white w-16 h-16 rounded-full text-4xl hover:bg-white hover:text-black transition duration-300"
        >
          →
        </button>

      </div>

      {/* DOTS */}
      <div className="flex justify-center gap-4 mt-10">

        {products.map((item, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-4 h-4 rounded-full transition duration-300 ${
              currentIndex === index
                ? "bg-white scale-125"
                : "bg-gray-600"
            }`}
          ></button>
        ))}

      </div>

    </div>
  </section>
)}

      {/* ABOUT US SECTION */}
<section
  id="about"
  ref={technologiesSectionRef}
  className="relative py-36 px-6 md:px-16 bg-[#050505] overflow-hidden"
>
  <div className="max-w-[1600px] mx-auto">

    {/* TOP CONTAINER */}
    <div className="border border-white/10 rounded-[3rem] bg-gradient-to-b from-[#111111] to-[#050505] p-8 md:p-16">

      {/* HEADING */}
      <div className="text-center mb-20">

        <p className="uppercase tracking-[0.35em] text-cyan-400 text-sm mb-6">
          About Us
        </p>

        <h2 className="text-5xl md:text-7xl font-semibold leading-tight mb-10">
          InnovVortex Robotics
        </h2>

        <p className="text-white/70 text-xl md:text-3xl leading-relaxed max-w-7xl mx-auto">
          At InnovVortex Robotics, we design next-generation robotic systems
          for defense, industry, and disaster response. Our mission is to create
          machines that thrive where human access is dangerous, difficult,
          or impossible.
        </p>

        

      </div>

      {/* ABOUT CARDS */}
<div className="grid md:grid-cols-3 overflow-hidden rounded-[2rem] border border-white/10">

  {/* CARD 1 */}
  <div className="bg-[#8f8f89] text-black p-10 md:p-14 relative min-h-[300px] flex flex-col">

    <h3 className="text-4xl md:text-[2.8rem] font-bold mb-8 leading-none whitespace-nowrap">
      Safety
    </h3>

    <p className="text-xl md:text-2xl leading-relaxed font-medium">
      Protecting personnel by deploying autonomous systems
      in hazardous and high-risk environments.
    </p>

  </div>

  {/* CARD 2 */}
  <div className="bg-[#979791] text-black p-10 md:p-14 border-l border-r border-black/10 relative min-h-[300px] flex flex-col">

    <h3 className="text-4xl md:text-[2.8rem] font-bold mb-8 leading-none whitespace-nowrap">
      Reliability
    </h3>

    <p className="text-xl md:text-2xl leading-relaxed font-medium">
      Robust and dependable robotic performance built
      for demanding industrial conditions.
    </p>

  </div>

  {/* CARD 3 */}
  <div className="bg-[#8f8f89] text-black p-10 md:p-14 relative min-h-[300px] flex flex-col">

    <h3 className="text-4xl md:text-[2.8rem] font-bold mb-8 leading-none whitespace-nowrap">
      Rapid Deployment
    </h3>

    <p className="text-xl md:text-2xl leading-relaxed font-medium">
      Agile solutions designed for quick integration
      and operational readiness.
    </p>

  </div>

</div>

    </div>

  </div>
</section>

      {/* SERVICES SECTION FRAME */}
      {/* SERVICES SECTION */}
{showServicesSection && (
  <section
    id="services"
    ref={servicesSectionRef}
    className="relative py-36 px-6 md:px-16 bg-[#050505] overflow-hidden"
  >

    <div className="max-w-[1600px] mx-auto border border-white/10 rounded-[3rem] bg-gradient-to-b from-[#111111] to-[#050505] p-8 md:p-16">

      {/* HEADING */}
      <div className="text-center mb-24">

        <p className="uppercase tracking-[0.35em] text-cyan-400 text-sm mb-6">
          Our Services
        </p>

        <h2 className="text-4xl md:text-6xl font-semibold leading-tight max-w-6xl mx-auto mb-8">
          Beyond our advanced product line, InnovVortex offers
          comprehensive services to support your robotic needs.
        </h2>

        <p className="text-white/60 text-lg md:text-2xl leading-relaxed max-w-5xl mx-auto">
          We engineer intelligent systems, industrial robotics,
          UAV platforms and automation technologies for the
          next generation of innovation.
        </p>

      </div>

      {/* SERVICES GRID */}
      <div className="grid md:grid-cols-2 gap-x-24 gap-y-24">

        {/* SERVICE 1 */}
        <div className="flex items-center gap-8">

          <div className="shrink-0 flex items-center justify-center">

            <img
              src="/drone-icon.png"
              alt="Drone"
              className="w-28 md:w-36 h-28 md:h-36 object-contain drop-shadow-[0_0_35px_rgba(255,255,255,0.12)] hover:scale-105 transition duration-300"
            />

          </div>

          <div>

            <h3 className="text-3xl md:text-[3.5rem] font-semibold leading-none mb-5">
              Custom
              <br />
              Drones
            </h3>

            <p className="text-white/60 text-lg md:text-xl leading-relaxed">
              Tailored UAV solutions for surveillance,
              inspection and autonomous mission requirements.
            </p>

          </div>

        </div>

        {/* SERVICE 2 */}
        <div className="flex items-center gap-8">

          <div className="shrink-0 flex items-center justify-center">

            <img
              src="/payload-icon.png"
              alt="Payload"
              className="w-28 md:w-36 h-28 md:h-36 object-contain drop-shadow-[0_0_35px_rgba(255,255,255,0.12)] hover:scale-105 transition duration-300"
            />

          </div>

          <div>

            <h3 className="text-3xl md:text-5xl font-semibold leading-none mb-5">
              Payload Dropping
              <br />
              Mechanisms
            </h3>

            <p className="text-white/60 text-lg md:text-xl leading-relaxed">
              Bespoke delivery and deployment systems integrated
              with intelligent robotic platforms.
            </p>

          </div>

        </div>

        {/* SERVICE 3 */}
        <div className="flex items-center gap-8">

          <div className="shrink-0 flex items-center justify-center">

            <img
              src="/iot-icon.png"
              alt="IoT"
              className="w-28 md:w-36 h-28 md:h-36 object-contain drop-shadow-[0_0_35px_rgba(255,255,255,0.12)] hover:scale-105 transition duration-300"
            />

          </div>

          <div>

            <h3 className="text-3xl md:text-5xl font-semibold leading-none mb-5">
              IoT Devices &
              <br />
              Smart Automation
            </h3>

            <p className="text-white/60 text-lg md:text-xl leading-relaxed">
              Intelligent sensor networks and automated
              industrial control systems for modern industries.
            </p>

          </div>

        </div>

        {/* SERVICE 4 */}
        <div className="flex items-center gap-8">

          <div className="shrink-0 flex items-center justify-center">

            <img
              src="/robot-icon.png"
              alt="Robot"
              className="w-28 md:w-36 h-28 md:h-36 object-contain drop-shadow-[0_0_35px_rgba(255,255,255,0.12)] hover:scale-105 transition duration-300"
            />

          </div>

          <div>

            <h3 className="text-3xl md:text-5xl font-semibold leading-none mb-5">
              Field
              <br />
              Robots
            </h3>

            <p className="text-white/60 text-lg md:text-xl leading-relaxed">
              Rugged robotic solutions for industrial,
              research and defense applications.
            </p>

          </div>

        </div>

        {/* SERVICE 5 */}
        <div className="flex items-center gap-8">

          <div className="shrink-0 flex items-center justify-center">

            <img
              src="/cad-icon.png"
              alt="CAD"
              className="w-28 md:w-36 h-28 md:h-36 object-contain drop-shadow-[0_0_35px_rgba(255,255,255,0.12)] hover:scale-105 transition duration-300"
            />

          </div>

          <div>

            <h3 className="text-3xl md:text-5xl font-semibold leading-none mb-5">
              3D Printing &
              <br />
              CAD Designing
            </h3>

            <p className="text-white/60 text-lg md:text-xl leading-relaxed">
              Rapid prototyping and precision engineering
              services for robotics development.
            </p>

          </div>

        </div>

        {/* SERVICE 6 */}
        <div className="flex items-center gap-8">

          <div className="shrink-0 flex items-center justify-center">

            <img
              src="/lab-icon.png"
              alt="Lab"
              className="w-28 md:w-36 h-28 md:h-36 object-contain drop-shadow-[0_0_35px_rgba(255,255,255,0.12)] hover:scale-105 transition duration-300"
            />

          </div>

          <div>

            <h3 className="text-3xl md:text-5xl font-semibold leading-none mb-5">
              Lab Setups &
              <br />
              Training
            </h3>

            <p className="text-white/60 text-lg md:text-xl leading-relaxed">
              Advanced robotics laboratories and
              next-generation technical training programs.
            </p>

          </div>

        </div>

      </div>

      {/* DIVIDER */}
      <div className="w-full h-[1px] bg-white/10 my-24"></div>

      {/* WORKFLOW */}
      <div className="w-full overflow-hidden">

        <div className="flex items-center justify-center gap-4 md:gap-8 whitespace-nowrap">

          {/* CONSULT */}
          <div className="flex items-center gap-4 shrink-0">

            <h3 className="text-cyan-400 text-2xl md:text-4xl font-bold">
              Consult
            </h3>

            <div className="w-20 md:w-28 h-10 md:h-14 bg-[#8f8f89] clip-arrow"></div>

          </div>

          {/* DESIGN */}
          <div className="flex items-center gap-4 shrink-0">

            <h3 className="text-cyan-400 text-2xl md:text-4xl font-bold">
              Design
            </h3>

            <div className="w-20 md:w-28 h-10 md:h-14 bg-[#8f8f89] clip-arrow"></div>

          </div>

          {/* BUILD */}
          <div className="flex items-center gap-4 shrink-0">

            <h3 className="text-cyan-400 text-2xl md:text-4xl font-bold">
              Build
            </h3>

            <div className="w-20 md:w-28 h-10 md:h-14 bg-[#8f8f89] clip-arrow"></div>

          </div>

          {/* DEPLOY */}
          <div className="flex items-center gap-4 shrink-0">

            <h3 className="text-cyan-400 text-2xl md:text-4xl font-bold">
              Deploy
            </h3>

            <div className="w-20 md:w-28 h-10 md:h-14 bg-[#8f8f89] clip-arrow"></div>

          </div>

          {/* SUPPORT */}
          <div className="flex items-center gap-4 shrink-0">

            <h3 className="text-cyan-400 text-2xl md:text-4xl font-bold">
              Support
            </h3>

          </div>

        </div>

      </div>

    </div>

  </section>
)}

      {/* CONTACT SECTION FIELD */}
      {showContactSection && (
        <section id="contact" ref={contactSectionRef} className="relative py-40 px-10 md:px-20 bg-[#050505]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <p className="uppercase tracking-[0.35em] text-white/40 text-sm mb-10">CONTACT</p>
              <h2 className="text-6xl md:text-[7rem] font-semibold leading-[0.95] tracking-tight mb-12">Let’s build the future together.</h2>
              <p className="text-white/60 text-2xl md:text-3xl leading-relaxed max-w-6xl mx-auto">
                Connect with InnovVortex to explore advanced robotics, intelligent automation and next-generation AI solutions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-16">
              <div className="border border-white rounded-[2rem] p-10 bg-black">
                <form onSubmit={sendEmail} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-white text-2xl">Name</label>
                    <input
                      type="text"
                      name="from_name"
                      value={formData.from_name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full bg-[#0b0b0b] border border-white rounded-xl px-6 py-5 text-white outline-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-white text-2xl">Phone Number</label>
                    <input
                      type="text"
                      name="from_phone"
                      value={formData.from_phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-[#0b0b0b] border border-white rounded-xl px-6 py-5 text-white outline-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-white text-2xl">Email</label>
                    <input
                      type="email"
                      name="from_email"
                      value={formData.from_email}
                      onChange={handleChange}
                      placeholder="Your email"
                      className="w-full bg-[#0b0b0b] border border-white rounded-xl px-6 py-5 text-white outline-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-white text-2xl">Message</label>
                    <textarea
                      rows="6"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your message"
                      className="w-full bg-[#0b0b0b] border border-white rounded-xl px-6 py-5 text-white outline-none resize-none"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-white text-black text-xl font-semibold py-5 rounded-xl hover:scale-[1.02] transition duration-300"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              <div className="space-y-10">
                <div className="border border-white rounded-[2rem] p-10 bg-black">
                  <h3 className="text-4xl font-semibold mb-12">Contact Information</h3>
                  <div className="space-y-10">
                    <div className="flex gap-12 items-start">
                      <div className="w-14 h-14 rounded-full border border-white flex items-center justify-center text-2xl">📍</div>
                      <div>
                        <h4 className="text-2xl font-medium mb-3">Address</h4>
                        <p className="text-white/70 text-xl leading-relaxed">
                          Plot No-26 And 27 Np Mallapur, Venkatapur Balapur Saroornagar K.V.Rangareddy - 500005, Telangana
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-5 items-start">
                      <div className="w-14 h-14 rounded-full border border-white flex items-center justify-center text-2xl">📞</div>
                      <div>
                        <h4 className="text-2xl font-medium mb-3">Phone</h4>
                        <p className="text-white/70 text-xl leading-relaxed">+91 90147 85659<br />+91 74164 42006</p>
                      </div>
                    </div>
                    <div className="flex gap-5 items-start">
                      <div className="w-14 h-14 rounded-full border border-white flex items-center justify-center text-2xl">✉️</div>
                      <div>
                        <h4 className="text-2xl font-medium mb-3">Email</h4>
                        <p className="text-white/70 text-xl leading-relaxed">bhanumahesh938@gmail.com<br />manishkumarveliboina@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex gap-5 items-start">
                      <div className="w-14 h-14 rounded-full border border-white flex items-center justify-center text-2xl">⏰</div>
                      <div>
                        <h4 className="text-2xl font-medium mb-3">Business Hours</h4>
                        <p className="text-white/70 text-xl leading-relaxed">Monday - Friday<br />10:00 AM - 7:00 PM IST</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-white rounded-[2rem] p-10 bg-black">
                  <h3 className="text-4xl font-semibold mb-8">Professional Network</h3>
                  <a href="https://www.linkedin.com/company/innovvortex/" target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-black transition duration-300 cursor-pointer text-2xl font-semibold">
                    in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* NO RESULTS FALLBACK SCREEN */}
      {noResultsFound && (
        <section className="py-40 text-center bg-black min-h-[50vh] flex flex-col justify-center items-center">
          <h2 className="text-4xl font-semibold mb-4">No Matching Sections Found</h2>
          <p className="text-white/50 text-xl max-w-md">We couldn't index any sections or modules matching "{searchTerm}". Try another keywords query.</p>
          <button onClick={() => setSearchTerm("")} className="mt-8 bg-white text-black px-6 py-3 rounded-full font-medium text-sm hover:scale-105 transition">
            Clear Search Filter
          </button>
        </section>
      )}



      {/* FOOTER */} 
      <footer className="border-t border-white py-8 px-10 md:px-20">
  <div className="flex flex-col md:flex-row items-center justify-between gap-6">

    <p className="text-white/60 text-lg">
      © 2026 InnovVortex India Pvt. Ltd. All rights reserved.
    </p>

    <div className="flex gap-10 text-white/60 text-lg">
      <p className="hover:text-white transition cursor-pointer">
        Privacy Policy
      </p>

      <p className="hover:text-white transition cursor-pointer">
        Terms of Service
      </p>
    </div>

  </div>
</footer>

      {/* CHATBOT TRIGGER BUTTON */}
      <button onClick={() => setChatOpen(!chatOpen)} className="fixed bottom-8 right-8 z-[200] bg-white text-black w-16 h-16 rounded-full text-3xl shadow-2xl flex items-center justify-center">
        💬
      </button>

      {/* CHATBOT POPUP WINDOW */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-28 right-8 w-[360px] h-[520px] bg-[#050505] border border-white rounded-[2rem] z-[200] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">InnovVortex AI</h2>
                <p className="text-xs text-white/40">Automated Knowledge Agent</p>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-2xl text-white/60 hover:text-white">×</button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${msg.sender === "user" ? "bg-white text-black ml-auto" : "bg-[#111] text-white border border-white/5"}`}>
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div className="bg-[#111] text-white/50 border border-white/5 max-w-[50px] p-3 rounded-2xl text-sm flex gap-1 justify-center items-center">
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-white/10 flex gap-3">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about Mekhex, Hexdoc, services..."
                className="flex-1 bg-[#111] text-white text-sm rounded-xl px-4 py-3 outline-none border border-white/5 focus:border-white/20"
              />
              <button onClick={sendMessage} className="bg-white text-black text-sm px-5 rounded-xl font-semibold active:scale-95 transition">
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;