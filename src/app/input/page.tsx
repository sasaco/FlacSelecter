"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import type { ChangeEvent } from "react";

export default function InputPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    tunnelKeizyo: "",
    fukukouMakiatsu: "",
    fukukouKyori: "",
    fukukouKeisya: "",
    fukukouKoubai: "",
    fukukouKotei: "",
    honkouMakiatsu: "",
    honkouKyori: "",
    honkouKeisya: "",
    honkouKoubai: "",
    honkouKotei: "",
    kijunMen: "",
    kijunKoubai: "",
    kijunKotei: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const goToOutput = () => {
    const queryParams = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      queryParams.append(key, value);
    });
    router.push(`/output?${queryParams.toString()}`);
  };

  return (
    <div className={styles.container}>
      <h1>条件設定</h1>
      <div className={styles.formGroup}>
        <label>トンネル計上</label>
        <input
          type="text"
          name="tunnelKeizyo"
          value={formData.tunnelKeizyo}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label>副坑巻圧</label>
        <input
          type="text"
          name="fukukouMakiatsu"
          value={formData.fukukouMakiatsu}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label>副坑距離</label>
        <input
          type="text"
          name="fukukouKyori"
          value={formData.fukukouKyori}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label>副坑傾斜</label>
        <input
          type="text"
          name="fukukouKeisya"
          value={formData.fukukouKeisya}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label>副坑勾配</label>
        <input
          type="text"
          name="fukukouKoubai"
          value={formData.fukukouKoubai}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label>副坑高低</label>
        <input
          type="text"
          name="fukukouKotei"
          value={formData.fukukouKotei}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label>本坑巻圧</label>
        <input
          type="text"
          name="honkouMakiatsu"
          value={formData.honkouMakiatsu}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label>本坑距離</label>
        <input
          type="text"
          name="honkouKyori"
          value={formData.honkouKyori}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label>本坑傾斜</label>
        <input
          type="text"
          name="honkouKeisya"
          value={formData.honkouKeisya}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label>本坑勾配</label>
        <input
          type="text"
          name="honkouKoubai"
          value={formData.honkouKoubai}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label>本坑高低</label>
        <input
          type="text"
          name="honkouKotei"
          value={formData.honkouKotei}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label>基準面</label>
        <input
          type="text"
          name="kijunMen"
          value={formData.kijunMen}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label>基準勾配</label>
        <input
          type="text"
          name="kijunKoubai"
          value={formData.kijunKoubai}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label>基準高低</label>
        <input
          type="text"
          name="kijunKotei"
          value={formData.kijunKotei}
          onChange={handleInputChange}
        />
      </div>
      <button onClick={goToOutput} className={styles.submitButton}>
        結果を表示
      </button>
    </div>
  );
}
