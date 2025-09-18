import { useState } from "react";
import "./passwordVerif.css";

const PasswordVerif = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.trim()) {
      setIsSubmitted(true);
      // Тут можна додати логіку для обробки пароля
      console.log("Введений пароль:", password);
    }
  };

  const handleReset = () => {
    setPassword("");
    setIsSubmitted(false);
  };

  return (
    <div className="password-container">
      <div className="password-card">
        <div className="card-header">
          <h1 className="title">Введіть пароль</h1>
          <p className="subtitle">
            Будь ласка, введіть отриманий пароль для продовження
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="password-form">
            <div className="input-group">
              <label htmlFor="password" className="input-label">
                Пароль
              </label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="password-input"
                  placeholder="Введіть ваш пароль"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password"
                  aria-label={
                    showPassword ? "Сховати пароль" : "Показати пароль"
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" className="submit-button">
              Підтвердити
            </button>
          </form>
        ) : (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Пароль прийнято!</h2>
            <p>Ваш пароль було успішно підтверджено.</p>
            <button onClick={handleReset} className="reset-button">
              Ввести інший пароль
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordVerif;
