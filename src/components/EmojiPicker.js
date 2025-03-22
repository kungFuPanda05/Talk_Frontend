import { useState, useEffect, useRef } from 'react';

export default function EmojiPickerDemo({isModalOpen=false, setIsModalOpen, message, setMessage}) {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [message, setMessage] = useState('');
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('emoji-picker-element').then(() => {
        const picker = document.createElement('emoji-picker');
        picker.style.position = 'absolute';
        picker.style.bottom = '90px';
        picker.style.right = '20px';
        picker.style.zIndex = 1000;
        picker.addEventListener('emoji-click', (event) => {
          setMessage(prev => prev + event.detail.unicode);
        });
        pickerRef.current = picker;
      });
    }
  }, []);

  const toggleEmojiPicker = () => {
    if (!isModalOpen) {
      if (pickerRef.current) {
        document.body.removeChild(pickerRef.current);
      }
      setIsModalOpen(false);
    } else {
      if (pickerRef.current) {
        document.body.appendChild(pickerRef.current);
      }
      setIsModalOpen(true);
    }
  };
  useEffect(() => {
    toggleEmojiPicker();
  }, [isModalOpen])

  return (
    <></>
  );
}
