import logo from "../assets/images/logo.png";
import { useState } from "react";

export default function Header() {
  const [displayDescription, setDisplayDescription] = useState(false);

  const toggleModal = () => {
    setDisplayDescription(!displayDescription);
  };

  const PMACceleratorModal = () => (
    <div className="modal-overlay">
  
      <div className="modal-content">
        
        <button 
          onClick={toggleModal}
          className="modal-close-btn"
          aria-label="Close"
        >
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>X</span>
        </button>

        <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0b1957', marginBottom: '16px', borderBottom: '1px solid #ccc', paddingBottom: '8px' }}>
          Product Manager Accelerator (PMA)
        </h3>
        
        <div className="modal-text-content">
          <p>
            The Product Manager Accelerator Program is designed to support PM professionals through every stage of their careers. From students looking for entry-level jobs to Directors looking to take on a leadership role, our program has helped over hundreds of students fulfill their career aspirations.
          </p>
          <p>
            Our Product Manager Accelerator community are ambitious and committed. Through our program they have learnt, honed and developed new PM and leadership skills, giving them a strong foundation for their future endeavors.
          </p>
          <p style={{ fontWeight: '600', marginTop: '24px' }}>
            Here are the examples of services we offer:
          </p>

          <ul className="modal-list">
            <li>
              <span style={{ fontWeight: 'bold', color: '#b26414' }}>🚀 PMA Pro:</span> End-to-end product manager job hunting program that helps you master FAANG-level Product Management skills, conduct unlimited mock interviews, and gain job referrals through our largest alumni network. 25% of our offers came from tier 1 companies and get paid as high as $800K/year.
            </li>
            <li>
              <span style={{ fontWeight: 'bold', color: '#b26414' }}>🚀 AI PM Bootcamp:</span> Gain hands-on AI Product Management skills by building a real-life AI product with a team of AI Engineers, data scientists, and designers. We will also help you launch your product with real user engagement using our 100,000+ PM community and social media channels.
            </li>
            <li>
              <span style={{ fontWeight: 'bold', color: '#b26414' }}>🚀 PMA Power Skills:</span> Designed for existing product managers to sharpen their product management skills, leadership skills, and executive presentation skills.
            </li>
            <li>
              <span style={{ fontWeight: 'bold', color: '#b26414' }}>🚀 PMA Leader:</span> We help you accelerate your product management career, get promoted to Director and product executive levels, and win in the board room.
            </li>
            <li>
              <span style={{ fontWeight: 'bold', color: '#b26414' }}>🚀 1:1 Resume Review:</span> We help you rewrite your killer product manager resume to stand out from the crowd, with an interview guarantee. Get started by using our FREE killer PM resume template used by over 14,000 product managers: <a href="https://www.drnancyli.com/pmresume" target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>https://www.drnancyli.com/pmresume</a>
            </li>
            <li>
              <span style={{ fontWeight: 'bold', color: '#b26414' }}>🚀 Free Training:</span> We also published over 500+ free training and courses. Please go to my <a href="https://www.youtube.com/c/drnancyli" target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>YouTube channel</a> and Instagram <span style={{ fontFamily: 'monospace' }}>@drnancyli</span> to start learning for free today.
            </li>
          </ul>
          
          <p style={{ fontSize: '12px', fontStyle: 'italic', marginTop: '24px' }}>
            Check out our website (link under my profile) to learn more about our services.
          </p>
        </div>
      </div>
    </div>
  );


  return (
    <>
      <header className="bg-[#0b1957] flex justify-evenly items-center text-white">
        <h2 style={{ color: "white", fontSize: '20px', fontWeight: '600' }}>
          Dana Dabdoub's Weather App
        </h2>
        <img src={logo} alt="weather logo" className="w-1/8" /> 
        <button 
          type="button" 
          className="header-btn"
          onClick={toggleModal}
        >
          Info
        </button>
      </header>
      {displayDescription && <PMACceleratorModal />}
    </>
  );
}