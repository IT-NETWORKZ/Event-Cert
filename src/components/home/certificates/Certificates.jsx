import React, { useState } from 'react';
import './Certificates.css';
import { getCertificateImageUrl } from '../../../api/homeService'; // adjust path if your services folder is elsewhere

// Images are fetched from the live folder (/home/rimg -> 1.png, 2.png ...) through homeService
const categories = [
  {
    title: "Wedding & Anniversary",
    subtitle: "(Invitation Cards)",
    items: [
      { id: 1, name: "Wedding Anniversary", image: getCertificateImageUrl(1) },
      { id: 3, name: "Wedding Reception", image: getCertificateImageUrl(3) }
    ]
  },
  {
    title: "Pre-Wedding Ceremonies",
    subtitle: "(Invitation Cards)",
    items: [
      { id: 6, name: "Sangeet Ceremony", image: getCertificateImageUrl(6) },
      { id: 8, name: "Haldi Ceremony", image: getCertificateImageUrl(8) }
    ]
  },
  {
    title: "Traditional Ceremonies",
    subtitle: "(Invitation Cards)",
    items: [
      { id: 10, name: "Mehendi Ceremony", image: getCertificateImageUrl(10) },
      { id: 9, name: "Naming Ceremony", image: getCertificateImageUrl(9) }
    ]
  },
  {
    title: "Party Invitations",
    subtitle: "(Invitation Cards)",
    items: [
      { id: 5, name: "Birthday Party", image: getCertificateImageUrl(5) },
      { id: 2, name: "Christmas Party", image: getCertificateImageUrl(2) }
    ]
  },
  {
    title: "Special Occasions",
    subtitle: "(Invitation Cards)",
    items: [
      { id: 7, name: "Women's Day", image: getCertificateImageUrl(7) },
      { id: 4, name: "Housewarming", image: getCertificateImageUrl(4) }
    ]
  }
];

const Certificates = () => {
  const [failed, setFailed] = useState({}); // ids whose image is missing on the server
  const [loaded, setLoaded] = useState({}); // ids whose image finished loading

  return (
    <section className="certificates-section py-4">
      <div className="container-fluid px-4">

        {/* Heading matched exactly to About Layout */}
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h2 className="section-main-title">
              Cards
              <span className="highlight">
                &
              </span>
              Certificates
            </h2>
            <div className="title-line"></div>
          </div>
        </div>

        {/* 5-Column Grid Layout */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-5 g-4 justify-content-center">
          {categories.map((category, index) => (
            <div key={index} className="col category-column">
              {/* Category Subheadings */}
              <div className="category-header">
                <h5 className="category-title mb-0">{category.title}</h5>
                <small className="category-subtitle">{category.subtitle}</small>
              </div>

              {/* Cards Stack - every card has the same size */}
              <div className="cert-stack">
                {category.items.map((item) => (
                  <div key={item.id} className="cert-card">
                    <div className="cert-media">
                      {failed[item.id] ? (
                        <span className="cert-placeholder">Image not available</span>
                      ) : (
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className={`cert-image ${loaded[item.id] ? 'is-loaded' : ''}`}
                          onLoad={() => setLoaded((p) => ({ ...p, [item.id]: true }))}
                          onError={() => setFailed((p) => ({ ...p, [item.id]: true }))}
                        />
                      )}
                    </div>

                    <div className="cert-footer">
                      <span className="card-item-name">{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default Certificates;