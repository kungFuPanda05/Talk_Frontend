import styles from '../styles/chatbox.module.scss';

export default function Typing() {
  return (
    <div className={styles['typing-wrap']} aria-label="Stranger is typing">
      <div className={styles['typing-bubble']}>
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>
      <span>Typing</span>
    </div>
  );
}
