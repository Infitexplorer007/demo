'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck, Truck, Headphones, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import styles from './Hero.module.css';

const slides = [
  {
    id: 1,
    subhead: "---- OUR CATALOG",
    titleLines: [
      { text: "BROWSE ", color: "white" },
      { text: "ALL", color: "orange" },
      { text: " PRODUCTS", color: "white" }
    ],
    description: "High-quality industrial materials, equipment, and procurement essentials trusted across construction and infrastructure projects.",
    image: "https://images.unsplash.com/photo-1541888081622-15cb3a62f886?w=1600&q=80"
  },
  {
    id: 2,
    subhead: "---- PRECISION & PERFORMANCE",
    titleLines: [
      { text: "ENGINEERING ", color: "white" },
      { text: "EXCELLENCE", color: "orange" },
      { text: " DELIVERED", color: "white" }
    ],
    description: "Source top-tier heavy machinery and engineered components directly from certified global manufacturers.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&q=80"
  },
  {
    id: 3,
    subhead: "---- GLOBAL SUPPLY CHAIN",
    titleLines: [
      { text: "STREAMLINE ", color: "white" },
      { text: "YOUR SUPPLY", color: "orange" },
      { text: " NETWORK", color: "white" }
    ],
    description: "End-to-end logistics and procurement integration to keep your infrastructure projects on schedule.",
    image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1600&q=80"
  },
  {
    id: 4,
    subhead: "---- INNOVATION IN INDUSTRY",
    titleLines: [
      { text: "POWERING ", color: "white" },
      { text: "FUTURE", color: "orange" },
      { text: " INFRASTRUCTURE", color: "white" }
    ],
    description: "Providing sustainable and high-strength materials for the next generation of industrial development.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80"
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef(null);
  const autoPlayRef = useRef(null);
  const isAnimating = useRef(false);

  const goToSlide = (index) => {
    if (isAnimating.current || index === current) return;
    isAnimating.current = true;
    
    // Animate out current content
    const currentElements = containerRef.current.querySelectorAll('.content-animated');
    
    gsap.to(currentElements, {
      y: -20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: "power2.in",
      onComplete: () => {
        setCurrent(index);
        
        // Reset positions for next slide
        gsap.set(currentElements, { y: 20 });
        
        // Animate in new content
        setTimeout(() => {
          gsap.to('.content-animated', {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            onComplete: () => { isAnimating.current = false; }
          });
          
          // Animate background image zoom out
          gsap.fromTo(`.bg-image-${index}`, 
            { scale: 1.05 }, 
            { scale: 1, duration: 6, ease: "none" }
          );
        }, 50);
      }
    });
  };

  const nextSlide = () => {
    goToSlide((current + 1) % slides.length);
  };

  const prevSlide = () => {
    goToSlide((current - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    // Initial animation
    gsap.fromTo('.content-animated', 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
    );
    gsap.to(`.bg-image-${current}`, { scale: 1, duration: 6, ease: "none" });

    return () => clearInterval(autoPlayRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Autoplay logic
    clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(nextSlide, 6000);
    
    // Animate the progress bar for the current slide
    gsap.fromTo('.progress-bar-active', 
      { width: '0%' }, 
      { width: '100%', duration: 6, ease: "none" }
    );
    
    return () => clearInterval(autoPlayRef.current);
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll function for the button
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products-grid');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.hero} ref={containerRef}>
      {/* Background Images Layer */}
      {slides.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`${styles.slide} ${index === current ? styles.slideActive : ''}`}
        >
          <img 
            src={slide.image} 
            alt="background" 
            className={`${styles.background} bg-image-${index}`} 
          />
          <div className={styles.overlay}></div>
        </div>
      ))}
      
      {/* Content Layer */}
      <div className={styles.contentContainer}>
        <div className={styles.contentGrid}>
          <div>
            <div className={`${styles.subhead} content-animated`}>
              {slides[current].subhead}
            </div>
            
            <h1 className={`${styles.title} content-animated`}>
              {slides[current].titleLines.map((line, i) => (
                <span key={i} style={{ color: line.color === 'orange' ? '#f97316' : 'white' }}>
                  {line.text}
                </span>
              ))}
            </h1>
            
            <p className={`${styles.description} content-animated`}>
              {slides[current].description}
            </p>
            
            <div className={`${styles.actions} content-animated`}>
              <button className={styles.actionBtn} onClick={scrollToProducts}>
                Explore Products <ArrowRight size={18} className={styles.btnIcon} />
              </button>
            </div>
            
            <div className={`${styles.trustIndicators} content-animated`}>
              <div className={styles.trustItem}>
                <div className={styles.trustIcon}><ShieldCheck size={20} /></div>
                <div className={styles.trustText}>
                  <span className={styles.trustTitle}>Trusted Quality</span>
                  <span className={styles.trustSub}>Premium Products</span>
                </div>
              </div>
              <div className={styles.trustItem}>
                <div className={styles.trustIcon}><Truck size={20} /></div>
                <div className={styles.trustText}>
                  <span className={styles.trustTitle}>On-Time Delivery</span>
                  <span className={styles.trustSub}>Across India</span>
                </div>
              </div>
              <div className={styles.trustItem}>
                <div className={styles.trustIcon}><Headphones size={20} /></div>
                <div className={styles.trustText}>
                  <span className={styles.trustTitle}>Expert Support</span>
                  <span className={styles.trustSub}>Always Here</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Slider Controls */}
        <div className={styles.controls}>
          <div className={styles.pagination}>
            {slides.map((slide, index) => (
              <div 
                key={slide.id} 
                className={`${styles.pageNumber} ${index === current ? styles.active : ''}`}
                onClick={() => goToSlide(index)}
              >
                <div className={styles.pageLine}>
                  {index === current && (
                    <div className={`${styles.pageLineActive} progress-bar-active`}></div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.arrows}>
            <button className={styles.arrowBtn} onClick={prevSlide}>
              <ChevronLeft size={22} />
            </button>
            <button className={styles.arrowBtn} onClick={nextSlide}>
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
