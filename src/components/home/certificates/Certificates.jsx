import React from 'react';
import './Certificates.css';

// Import your actual images from assets
import campCertImg from '../../../assets/img/verticalimage.jpg'; 
import achievementCertImg from '../../../assets/img/verticalimage.jpg'; 
import participationCertImg from '../../../assets/img/testimonial-3.jpg';
import mvpCertImg from '../../../assets/img/testimonial-2.jpg';
import weddingWishesImg from '../../../assets/img/testimonial-2.jpg';
import newYearWishesImg from '../../../assets/img/testimonial-2.jpg';
import diwaliWishesImg from '../../../assets/img/squaree.jpg'; 
import festivalCardsImg from '../../../assets/img/squaree.jpg';
import xMasInvitationImg from '../../../assets/img/testimonial-2.jpg';
import birthdayPartyImg from '../../../assets/img/testimonial-2.jpg';

const categories = [
  {
    title: "Certificates / Square",
    subtitle: "(Vertical)",
    items: [
      { id: 1, name: "Camp Cert", image: campCertImg },
      { id: 2, name: "Achievement Cert", image: achievementCertImg }
    ]
  },
  {
    title: "Certificates",
    subtitle: "(Horizontal)",
    items: [
      { id: 3, name: "Participation Cert", image: participationCertImg },
      { id: 4, name: "MVP Cert", image: mvpCertImg }
    ]
  },
  {
    title: "Greetings Cards",
    subtitle: "(Rectangle)",
    items: [
      { id: 5, name: "Wedding Wishes", image: weddingWishesImg },
      { id: 6, name: "New Year Wishes", image: newYearWishesImg }
    ]
  },
  {
    title: "Greetings Cards",
    subtitle: "(Square)",
    items: [
      { id: 7, name: "Diwali Wishes", image: diwaliWishesImg },
      { id: 8, name: "Festival Cards", image: festivalCardsImg }
    ]
  },
  {
    title: "Invitation Cards",
    subtitle: "(Rectangle)",
    items: [
      { id: 9, name: "X-Mas Invitation", image: xMasInvitationImg },
      { id: 10, name: "Birthday Party", image: birthdayPartyImg }
    ]
  }
];

const Certificates = () => {
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
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4 justify-content-center">
          {categories.map((category, index) => (
            <div key={index} className="col category-column">
              {/* Category Subheadings */}
              <div className="category-header text-center mb-4">
                <h5 className="category-title mb-0">{category.title}</h5>
                <small className="category-subtitle">{category.subtitle}</small>
              </div>
              
              {/* Cards Stack */}
              <div className="d-flex flex-column gap-4">
                {category.items.map((item) => (
                  <div key={item.id} className="card cert-item-card border-0 shadow-sm p-3">
                    <div className="image-wrapper d-flex align-items-center justify-content-center mb-3">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="cert-image" 
                      />
                    </div>
                    <div className="text-center mt-auto">
                      <p className="card-item-name mb-0">{item.name}</p>
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