import { useEffect, useState } from 'react';

const Lightbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    const handleOpen = (e) => {
      const target = e.target.closest('.disc-img img, .c-img img');
      if (target) {
        setImgSrc(target.src);
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
      }
    };

    const handleClose = (e) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('click', handleOpen);
    document.addEventListener('keydown', handleClose);

    return () => {
      document.removeEventListener('click', handleOpen);
      document.removeEventListener('keydown', handleClose);
    };
  }, []);

  function close() {
    setIsOpen(false);
    document.body.style.overflow = '';
    setTimeout(() => { setImgSrc(''); }, 250);
  };

  return (
    <div className={`lb-overlay ${isOpen ? 'open' : ''}`} id="lb" role="dialog" aria-modal="true" onClick={(e) => {
      if (e.target.classList.contains('lb-img-wrap') || e.target.classList.contains('lb-overlay')) {
        close();
      }
    }}>
      <div className="lb-box" id="lbBox">
        <button className="lb-close" id="lbClose" aria-label="Close (Esc)" onClick={close}>✕</button>
        <div className="lb-img-wrap">
          <img id="lbImg" src={imgSrc} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
