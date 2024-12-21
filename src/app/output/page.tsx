"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import type { ReactNode } from "react";

interface FormData {
  tunnelKeizyo: string;
  fukukouMakiatsu: string;
  fukukouKyori: string;
  fukukouKeisya: string;
  fukukouKoubai: string;
  fukukouKotei: string;
  honkouMakiatsu: string;
  honkouKyori: string;
  honkouKeisya: string;
  honkouKoubai: string;
  honkouKotei: string;
  kijunMen: string;
  kijunKoubai: string;
  kijunKotei: string;
}

export default function OutputPage() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<FormData>({
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

  useEffect(() => {
    if (!searchParams) return;
    
    const data: Partial<FormData> = {};
    for (const [key, value] of searchParams.entries()) {
      if (key in formData) {
        data[key as keyof FormData] = value;
      }
    }
    setFormData((prev) => ({ ...prev, ...data }));
  }, [searchParams]);

  return (
    <div className={styles.container}>
      <h1>結果</h1>
      <div className={styles.resultGroup}>
        <h2>入力されたデータ:</h2>
        <div className={styles.dataGrid}>
          <div className={styles.dataItem}>
            <label>トンネル計上:</label>
            <span>{formData.tunnelKeizyo}</span>
          </div>
          <div className={styles.dataItem}>
            <label>副坑巻圧:</label>
            <span>{formData.fukukouMakiatsu}</span>
          </div>
          <div className={styles.dataItem}>
            <label>副坑距離:</label>
            <span>{formData.fukukouKyori}</span>
          </div>
          <div className={styles.dataItem}>
            <label>副坑傾斜:</label>
            <span>{formData.fukukouKeisya}</span>
          </div>
          <div className={styles.dataItem}>
            <label>副坑勾配:</label>
            <span>{formData.fukukouKoubai}</span>
          </div>
          <div className={styles.dataItem}>
            <label>副坑高低:</label>
            <span>{formData.fukukouKotei}</span>
          </div>
          <div className={styles.dataItem}>
            <label>本坑巻圧:</label>
            <span>{formData.honkouMakiatsu}</span>
          </div>
          <div className={styles.dataItem}>
            <label>本坑距離:</label>
            <span>{formData.honkouKyori}</span>
          </div>
          <div className={styles.dataItem}>
            <label>本坑傾斜:</label>
            <span>{formData.honkouKeisya}</span>
          </div>
          <div className={styles.dataItem}>
            <label>本坑勾配:</label>
            <span>{formData.honkouKoubai}</span>
          </div>
          <div className={styles.dataItem}>
            <label>本坑高低:</label>
            <span>{formData.honkouKotei}</span>
          </div>
          <div className={styles.dataItem}>
            <label>基準面:</label>
            <span>{formData.kijunMen}</span>
          </div>
          <div className={styles.dataItem}>
            <label>基準勾配:</label>
            <span>{formData.kijunKoubai}</span>
          </div>
          <div className={styles.dataItem}>
            <label>基準高低:</label>
            <span>{formData.kijunKotei}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
