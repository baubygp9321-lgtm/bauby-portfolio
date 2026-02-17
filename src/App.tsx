import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaMoon, FaSun } from "react-icons/fa";
import Typewriter from "typewriter-effect";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import QySoul from "./assets/qysoul.png";
function App() {
  
  const particlesInit = async (main: any) => {
  await loadFull(main);
};

const [dark, setDark] = useState(true);

useEffect(() => {
  if (dark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, [dark]);

return (
  <div>

    

<div className={`min-h-screen bg-gradient-to-br 
                 from-[#0a0a0f] via-[#1a1a2e] to-[#000000] 
                 text-white transition duration-500`}>

      {/* 🌌 Particle Background */}
      <Particles
  init={particlesInit}
  className="fixed inset-0 -z-10"
  options={{
    particles: {
      number: { value: 80 },
      size: { value: 2 },
      color: { value: "#00ffff" },
      move: { enable: true, speed: 1 },
      links: {
        enable: true,
        color: "#8b5cf6",
        opacity: 0.2,
      },
    },
  }}
/>


      {/* 🌗 Toggle */}
      <button
        onClick={() => setDark(!dark)}
        className="fixed top-6 right-6 z-50 p-3 rounded-full 
                   bg-white/10 backdrop-blur-xl 
                   border border-white/20 
                   hover:scale-110 transition duration-300"
      >
        {dark ? <FaSun className="text-yellow-400" /> : <FaMoon />}
      </button>

      {/* 🌌 Modern Glow Blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-500 rounded-full blur-[150px] opacity-20"></div>
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[150px] opacity-20"></div>



{/* 🌐 NAVBAR - DARK THEME */}
<nav className="fixed top-0 left-0 w-full z-200 bg-slate-900/90 backdrop-blur-md shadow-lg">
  <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
    
    {/* Logo / Name */}
    <a href="#hero" className="text-2xl font-bold text-cyan-400">
      Bauby Gupta
    </a>

    {/* Navigation Links */}
    <ul className="hidden md:flex gap-8 text-gray-200 font-medium">
      <li>
        <a
          href="#about"
          className="hover:text-cyan-400 transition-colors duration-300"
        >
          About
        </a>
      </li>
      <li>
        <a
          href="#skills"
          className="hover:text-cyan-400 transition-colors duration-300"
        >
          Skills
        </a>
      </li>
      <li>
        <a
          href="#projects"
          className="hover:text-cyan-400 transition-colors duration-300"
        >
          Projects
        </a>
      </li>
      <li>
        <a
          href="#research"
          className="hover:text-cyan-400 transition-colors duration-300"
        >
          Research
        </a>
      </li>
      <li>
        <a
          href="#contact"
          className="hover:text-cyan-400 transition-colors duration-300"
        >
         Contact
        </a>
      </li>
    </ul>

    {/* Mobile Hamburger */}
    <div className="md:hidden">
      <button id="mobile-menu-button" className="text-gray-200">
        ☰
      </button>
    </div>

  </div>
</nav>




      {/* HERO */}
{/* 🌐 NAVBAR */}
<nav className="fixed top-0 left-0 w-full z-50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md shadow-md">
  <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
    
    {/* Logo / Name */}
    <a href="#hero" className="text-2xl font-bold text-cyan-500">
      Bauby Gupta
    </a>

    {/* Navigation Links */}
    <ul className="hidden md:flex gap-8 text-gray-700 dark:text-gray-200 font-medium">
      <li>
        <a
          href="#about"
          className="hover:text-cyan-400 transition-colors duration-300"
        >
          About
        </a>
      </li>
      <li>
        <a
          href="#skills"
          className="hover:text-cyan-400 transition-colors duration-300"
        >
          Skills
        </a>
      </li>
      <li>
        <a
          href="#projects"
          className="hover:text-cyan-400 transition-colors duration-300"
        >
          Projects
        </a>
      </li>
      <li>
        <a
          href="#research"
          className="hover:text-cyan-400 transition-colors duration-300"
        >
          Research
        </a>
      </li>
      <li>
        <a
          href="#contact"
          className="hover:text-cyan-400 transition-colors duration-300"
        >
          Contact
        </a>
      </li>
    </ul>

    
  </div>
</nav>

        
{/* HERO PREMIUM */}
<section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">

  <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

    {/* LEFT SIDE */}
    <div className="text-center md:text-left">

      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-6xl font-extrabold leading-tight"
      >
        Hi, I'm{" "}
        <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Bauby Gupta
        </span>
      </motion.h1>

      <div className="text-2xl text-cyan-400 mt-6">
        <Typewriter
          options={{
            strings: [
              "AI Researcher",
              "Full Stack Devloper",
              "Quatam Computing",
              "Software Engineer",
              "Scientifi Discovery"
            ],
            autoStart: true,
            loop: true,
          }}
        />
      </div>

      <p className="mt-6 text-white-400 max-w-xl">
        Building intelligent systems, scalable architectures,
        and next-generation technology to empower the future.
      </p>

      <div className="mt-8 flex gap-4 justify-center md:justify-start">
        <motion.a
          whileHover={{ scale: 1.05 }}
          href="#projects"
          className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-black rounded-full font-semibold shadow-lg"
        >
          View Projects
        </motion.a>

        <motion.a
          whileHover={{ scale: 1.05 }}
          href="#contact"
          className="px-8 py-3 border border-cyan-400 rounded-full text-cyan-400"
        >
          Contact Me
        </motion.a>
      </div>
    </div>

    {/* RIGHT SIDE IMAGE */}
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      className="relative flex justify-center"
    >
      <div className="absolute w-130 h-130 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>

      <img
        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
        alt="Bauby"
        className="relative w-90 h-90 object-cover rounded-full border-4 border-cyan-400 shadow-2xl"
      />
    </motion.div>

  </div>

</section>

      {/* 🚀 ABOUT */}
<section
  id="about"
  className="relative py-28 px-6 overflow-hidden"
>
  {/* Futuristic Background Glow */}
  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-cyan-500/10 to-transparent -z-10"></div>

  <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

    {/* LEFT SIDE - TEXT */}
    <div>
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
      >
        About Me
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg leading-8 text-white"
      >
        I am <span className="font-semibold text-cyan-500">Bauby Gupta</span>, 
        a self-driven Full Stack & Deep Tech Engineer and the 
        <span className="font-semibold text-purple-500"> Founder & CEO of Qysoul</span> — 
        a research, innovation, and invention lab focused on 
        Artificial Intelligence, Quantum Computing, and next-generation science.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-lg leading-8 text-white"
      >
        I made the bold decision to step away from traditional academics 
        and drop my B.Tech to pursue real-world innovation and deep technical mastery.
        My journey is built on execution, research, and building scalable systems 
        that can shape the future of humanity.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 text-lg leading-8 text-white"
      >
        My expertise spans MERN Stack, Spring Boot, Java backend architecture,
        enterprise-level Full Stack development, AI systems engineering,
        DevOps automation, and emerging Quantum computing research.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 text-lg leading-8 text-white"
      >
        I don’t just build software — I engineer intelligent ecosystems.
        My mission is to create technology that empowers, protects, and advances humanity.
      </motion.p>
    </div>

   {/* RIGHT SIDE - SOFT ROUNDED IMAGE CARD */}
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  whileInView={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8 }}
  className="relative flex justify-center items-center"
>

  {/* Soft Glow */}
  <div className="absolute w-130 h-130
                  bg-gradient-to-r 
                  from-cyan-500/40 via-purple-500/40 to-cyan-500/40 
                  rounded-3xl blur-2xl opacity-50">
  </div>

  {/* Main Card */}
  <div className="relative w-100 h-100
                  rounded-3xl 
                  backdrop-blur-xl 
                  bg-white/5 
                  border border-white/20 
                  shadow-2xl 
                  overflow-hidden 
                  group">

    <img
      src={QySoul}
      alt="Bauby Gupta"
      className="w-full h-full object-cover 
                 transition-transform duration-500 
                 group-hover:scale-105"
    />
  </div>

</motion.div>



  </div>
</section>


       {/* 🚀 SKILLS */}
<section className="relative py-28 px-6 overflow-hidden" id="skills">

  {/* Futuristic Background Glow */}
  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent -z-10"></div>
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/20 blur-[120px] rounded-full -z-10"></div>

  <div className="max-w-6xl mx-auto text-center">
    <h2 className="text-4xl  md:text-5xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
      Technical Expertise
    </h2>
    <p className="text-slate-500 dark:text-slate-400 mb-16">
      Engineering intelligent systems with scalable modern architecture.
    </p>

    <div className="grid md:grid-cols-3 gap-10">

      {[
        {
          title: "MERN Stack",
          desc: "MongoDB, Express, React, Node.js",
        },
        
        {
          title: "Full Stack Development",
          desc: "End-to-end scalable applications",
        },
        {
          title: "App Development",
          desc: "Android java Spring boot & Cross-platform apps",
        },
        {
          title: "Software Engineering",
          desc: "Robust architecture & clean code",
        },
        {
          title: "Artificial Intelligence",
          desc: "ML systems & intelligent automation",
        },
        {
          title: "Quantum Computing",
          desc: "Next-gen computational research",
        },
      ].map((skill, i) => (
        <motion.div
          key={i}
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="relative group p-8 rounded-3xl backdrop-blur-xl 
                     bg-white/5 dark:bg-white/5 
                     border border-white/10
                     shadow-lg hover:shadow-cyan-500/20
                     transition duration-500"
        >
          {/* Hover Glow Border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r 
                          from-cyan-500/0 via-cyan-500/20 to-purple-500/0 
                          opacity-0 group-hover:opacity-100 blur-xl transition duration-500 -z-10"></div>

          <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {skill.title}
          </h3>
          <p className="text-slate-500 text-white text-sm">
            {skill.desc}
          </p>
        </motion.div>
      ))}

    </div>
  </div>
</section>


{/* 📚 CURRENTLY EXPLORING */}
<section className="relative py-28 px-6 overflow-hidden" id="Explore">

  {/* Background Glow */}
  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent -z-10"></div>

  <div className="max-w-6xl mx-auto text-center">
    <h2 className="text-4xl md:text-5xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent font-bold mb-4">
      Currently Exploring
    </h2>

    <p className="text-slate-500 dark:text-slate-400 mb-16">
      Continuously evolving through deep research, system design, and frontier technologies.
    </p>

    <div className="grid md:grid-cols-3 gap-10">

      {[
        {
          title: "Quantum Computing",
          desc: "Quantum algorithms, qubits, computational physics, and next-generation cryptography.",
        },
        {
          title: "System Software",
          desc: "Operating systems, memory management, compilers, and low-level architecture.",
        },
        {
          title: "AI Research",
          desc: "Advanced machine learning models, deep learning systems, and intelligent automation.",
        },
        {
          title: "Science & Mathematics",
          desc: "complex mathematics theorems and cosmic science",
        },
        {
          title: "biological computation",
          desc: "love to explore the biological computation",
        },
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          whileHover={{ y: -8 }}
          className="relative group p-8 rounded-3xl backdrop-blur-xl
                     bg-white/5 dark:bg-white/5
                     border border-white/10
                     shadow-lg hover:shadow-purple-500/20
                     transition duration-500"
        >
          {/* Hover Glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r
                          from-cyan-500/0 via-purple-500/20 to-cyan-500/0
                          opacity-0 group-hover:opacity-100 blur-xl
                          transition duration-500 -z-10"></div>

          <h3 className="text-xl font-semibold mb-4 text-cyan-400">
            {item.title}
          </h3>

          <p className="text-slate-500 text-white text-sm leading-6">
            {item.desc}
          </p>
        </motion.div>
      ))}

    </div>
  </div>
</section>



        {/* 🚀 PROJECTS */}
<section id="projects" className="relative py-28 px-6 overflow-hidden">

  {/* Background Glow */}
  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-cyan-500/10 to-transparent -z-10"></div>

  <div className="max-w-6xl mx-auto text-center">

    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
      Projects & Vision
    </h2>

    <p className="text-slate-500 dark:text-slate-400 mb-16">
      Building intelligent systems today. Researching tomorrow’s technology.
    </p>

    <div className="grid md:grid-cols-3 gap-10">

      {[
        {
          title: "Women's Safety AI System",
          status: "Currently Building",
          desc: "An intelligent AI-powered safety ecosystem designed to protect women using real-time monitoring, emergency alerts, smart analytics, and scalable backend infrastructure.",
        },
        {
          title: "AI Research Projects",
          status: "In Research Phase",
          desc: "Developing advanced machine learning systems, automation frameworks, and experimental AI architectures focused on real-world impact and scalability.",
        },
        {
          title: "Quantum Computing Initiatives",
          status: "Future Development",
          desc: "Exploring quantum algorithms, deep computational models, and next-generation problem solving to build breakthrough scientific systems.",
        },
         {
          title: "Quantum Computing Initiatives",
          status: "Future Development",
          desc: "Exploring quantum algorithms, deep computational models, and next-generation problem solving to build breakthrough scientific systems.",
        },
         {
          title: "Quantum Computing Initiatives",
          status: "Future Development",
          desc: "Exploring quantum algorithms, deep computational models, and next-generation problem solving to build breakthrough scientific systems.",
        },
      ].map((project, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2 }}
          whileHover={{ y: -10 }}
          className="relative group p-8 rounded-3xl backdrop-blur-xl
                     bg-white/5 dark:bg-white/5
                     border border-white/10
                     shadow-xl hover:shadow-cyan-500/20
                     transition duration-500 text-left"
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r
                          from-cyan-500/0 via-purple-500/20 to-cyan-500/0
                          opacity-0 group-hover:opacity-100 blur-xl
                          transition duration-500 -z-10"></div>

          {/* Status Badge */}
          <span className="inline-block mb-4 px-3 py-1 text-xs font-medium
                           bg-cyan-500/20 text-cyan-400
                           rounded-full">
            {project.status}
          </span>

          <h3 className="text-xl font-bold mb-4">
            {project.title}
          </h3>

          <p className="text-slate-500 text-white text-sm leading-6">
            {project.desc}
          </p>
        </motion.div>
      ))}

    </div>
  </div>
</section>


{/* 🧠 RESEARCH & INSIGHTS */}
<section className="relative py-28 px-6 overflow-hidden" id="research">

  {/* Futuristic Background */}
  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent -z-10"></div>

  <div className="max-w-6xl mx-auto text-center">

    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
      Research & Insights
    </h2>

    <p className="text-slate-500 dark:text-slate-400 mb-16">
      Exploring deep systems, AI innovation, and modern computing architecture.
    </p>

    <div className="grid md:grid-cols-3 gap-10">

      {[
        {
          title: "How AI Can Prevent Crime",
          desc: "Exploring predictive analytics, real-time monitoring, behavioral modeling, and ethical AI systems to enhance public safety.",
        },
        {
          title: "System Design Fundamentals",
          desc: "Understanding scalability, distributed systems, load balancing, and backend architecture for high-performance applications.",
        },
        {
          title: "DevOps Learning Journey",
          desc: "CI/CD pipelines, Docker, Kubernetes, automation, and building reliable cloud-native infrastructures.",
        },
        {
          title: "Linux Essentials",
          desc: "Kernel basics, process management, memory systems, shell scripting, and system-level engineering.",
        },
        {
          title: "Networking Fundamentals",
          desc: "Protocols, TCP/IP, routing, distributed communication, and secure infrastructure design.",
        },
      ].map((blog, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          whileHover={{ y: -8 }}
          className="relative group p-8 rounded-3xl backdrop-blur-xl
                     bg-white/5 dark:bg-white/5
                     border border-white/10
                     shadow-lg hover:shadow-purple-500/20
                     transition duration-500 text-left"
        >
          {/* Hover Glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r
                          from-cyan-500/0 via-purple-500/20 to-cyan-500/0
                          opacity-0 group-hover:opacity-100 blur-xl
                          transition duration-500 -z-10"></div>

          <h3 className="text-xl font-semibold mb-4 text-purple-400">
            {blog.title}
          </h3>

          <p className="text-slate-500 text-white text-sm leading-6 mb-6">
            {blog.desc}
          </p>

          <button className="text-cyan-400 text-sm font-medium hover:underline">
            Read Research →
          </button>
        </motion.div>
      ))}

    </div>
  </div>
</section>


      {/* 🚀 CONTACT */}
<section className="relative py-28 px-6 overflow-hidden" id="contact">

  {/* Background Glow */}
  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent -z-10"></div>

  <div className="max-w-5xl mx-auto text-center">

    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
      Let’s Build The Future Together
    </h2>

    <p className="text-slate-500 text-white mb-16 text-lg leading-8">
      Open to AI research collaborations, deep tech innovation,
      startup partnerships, and building intelligent systems that matter.
    </p>

    {/* Contact Card */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative group p-10 rounded-3xl backdrop-blur-xl
                 bg-white/5 dark:bg-white/5
                 border border-white/10
                 shadow-2xl"
    >

      {/* Glow Border Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r
                      from-cyan-500/0 via-purple-500/30 to-cyan-500/0
                      opacity-0 group-hover:opacity-100 blur-xl
                      transition duration-500 -z-10"></div>

      <div className="grid md:grid-cols-3 gap-8 text-left md:text-center">

        {/* Email */}
        <div>
          <p className="text-sm text-slate-400 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">Email</p>
          <a
            href="mailto:baubygp9321@gmail.com"
            className="text-cyan-400 font-medium hover:underline"
          >
            baubygp9321@gmail.com
          </a>
        </div>

        {/* Phone */}
        <div>
          <p className="text-sm text-slate-400  bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">Phone</p>
          <a
            href="tel:7206846894"
            className="text-cyan-400 font-medium hover:underline"
          >
            +91 7206846894
          </a>
        </div>

        {/* Location */}
        <div>
          <p className="text-sm text-slate-400 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">Location</p>
          <p className="text-cyan-400 font-medium">
            Panipat, Haryana, India
          </p>
        </div>

      </div>
    </motion.div>

    {/* Footer Note */}
    <p className="mt-16 text-sm text-slate-500 dark:text-slate-400">
      © {new Date().getFullYear()} Bauby Gupta — Founder & CEO, Qysoul.
      Building the future through AI, Quantum & Deep Tech.
    </p>

  </div>
</section>

      </div>
    </div>
  );
}

export default App;
