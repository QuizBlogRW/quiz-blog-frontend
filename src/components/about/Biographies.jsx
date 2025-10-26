import { useEffect } from 'react';
import { Button } from 'reactstrap';
import bruce from '@/images/Bruce.jpg';
import parmenide from '@/images/parmenide.jpg';
import thierry from '@/images/thierry.jpg';
import annick from '@/images/annick.jpg';
import denyse from '@/images/denyse.jpg';
import instagram from '@/images/instagram.svg';
import linkedin from '@/images/linkedin.svg';
import facebook from '@/images/facebook.svg';
import twitter from '@/images/twitter.svg';
import whatsapp from '@/images/whatsapp.svg';
import github from '@/images/github.svg';
import web from '@/images/web.svg';

const people = [
  {
    name: 'Patrice Bruce NDATIMANA',
    title: 'Founder & Idea Innovator, Content Creator, and General Manager',
    img: bruce,
    phone: '0780579067',
    links: [
      { href: 'https://www.linkedin.com/in/ndatimana-patrice-bruce-20b363195', label: 'LinkedIn' },
      { href: 'https://www.instagram.com/dr.active4', label: 'Instagram' },
      { href: 'https://www.facebook.com/ndatimana.bruce', label: 'Facebook' },
    ],
  },
  {
    name: 'Thierry TUYIZERE',
    title: 'Co-founder, Content Creator, and Social Media Manager',
    img: thierry,
    phone: '0784553202',
    links: [
      { href: 'https://rw.linkedin.com/in/tuyiterry', label: 'LinkedIn' },
      { href: 'http://www.twitter.com/tuyi_terry/', label: 'Twitter' },
      { href: 'http://www.instagram.com/tuyi_terry/', label: 'Instagram' },
      { href: 'https://www.facebook.com/profile.php?id=100018717315946', label: 'Facebook' },
    ],
  },
  {
    name: 'Niyomwungeri Parmenide ISHIMWE',
    title: 'Co-founder, Application Developer, and IT Manager',
    img: parmenide,
    phone: '0788551997',
    links: [
      { href: 'https://www.linkedin.com/in/niyomwungeri-parmenide-ishimwe-1a5394123/', label: 'LinkedIn' },
      { href: 'https://github.com/Nide17', label: 'GitHub' },
      { href: 'https://www.parmenide.me/', label: 'Website' },
    ],
  },
  {
    name: 'Denyse MUKUNDUHIRWE',
    title: 'Co-founder, Content Creator, and Public Relations Manager',
    img: denyse,
    phone: '0787743631',
    links: [
      { href: 'https://www.linkedin.com/in/denyse-mukunduhirwe-925762208/', label: 'LinkedIn' },
      { href: 'https://www.instagram.com/dobrev_denys/', label: 'Instagram' },
      { href: 'https://twitter.com/Denyse2M', label: 'Twitter' },
    ],
  },
  {
    name: 'Sonie Annick AKALIZA',
    title: 'Co-founder, Content Creator, and Planning & Production Manager',
    img: annick,
    phone: '0787663943',
    links: [
      { href: 'https://www.linkedin.com/in/sonie-annick-akaliza-720a41254/', label: 'LinkedIn' },
      { href: 'https://www.instagram.com/sonie_annick/', label: 'Instagram' },
    ],
  },
];

const SocialIcon = ({ label }) => {
  switch (label) {
    case 'LinkedIn':
      return <img src={linkedin} alt="LinkedIn" width="18" height="18" />;
    case 'Instagram':
      return <img src={instagram} alt="Instagram" width="18" height="18" />;
    case 'Facebook':
      return <img src={facebook} alt="Facebook" width="18" height="18" />;
    case 'Twitter':
      return <img src={twitter} alt="Twitter" width="18" height="18" />;
    case 'GitHub':
      return <img src={github} alt="GitHub" width="18" height="18" />;
    case 'Website':
      return <img src={web} alt="Website" width="18" height="18" />;
    default:
      return null;
  }
};

const Biographies = () => {
  useEffect(() => {
    const handleIntersection = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    };

    const options = { root: null, rootMargin: '0px', threshold: 0.2 };
    const observer = new IntersectionObserver(handleIntersection, options);
    const elements = Array.from(document.querySelectorAll('.memberImg img') || []);
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="p-lg-5">
      <h2 className="fw-bolder text-center my-5">
  <u style={{ color: 'var(--accent)', backgroundColor: 'var(--brand)', padding: '0.8rem 4rem', clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)' }}>
          Meet the team
        </u>
      </h2>

      {people.map((p, idx) => (
        <section
          key={p.name}
          className={`row mx-2 mx-sm-4 my-4 my-sm-5 d-flex flex-column flex-sm-row ${idx % 2 === 1 ? 'flex-sm-row-reverse' : ''}`}
        >
          <div className="col-12 col-sm-4 px-0 px-sm-3 d-flex flex-column align-items-center justify-content-center">
            <div className="memberImg">
            <img className="w-100 mt-2 mt-lg-0" src={p.img} alt={p.name} />
            </div>
          </div>

          <div className="memberText col-12 col-sm-8 px-0 px-sm-3">
            <h4 className="py-3 fw-bolder w-100" style={{ color: 'var(--brand)' }}>{p.name}</h4>
            <h6 className="fw-bolder">{p.title}</h6>
            <div className="mt-lg-2">
              <p className="text-justify">
                {p.title} — a dedicated team member helping Quiz-Blog deliver quality educational content.
              </p>
            </div>

            <div className="social w-100 d-flex justify-content-around mx-0 px-md-1 py-md-1">
              <strong className="d-flex align-items-center ms-2 px-md-1 py-md-1">
                <img src={whatsapp} alt={p.phone} width="18" height="18" />&nbsp;&nbsp;<span style={{ verticalAlign: 'sub' }}>{p.phone}</span>
              </strong>

              {p.links.map((l) => (
                <Button key={l.href} size="sm" color="link">
                  <a href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} on ${l.label}`}>
                    <SocialIcon label={l.label} />
                  </a>
                </Button>
              ))}
            </div>
          </div>
          {/* Horizontal spacer */}
            <div className="w-100 my-4" style={{ borderTop: '1px solid var(--accent)' }}></div>
        </section>
      ))}
    </div>
  );
};

export default Biographies;