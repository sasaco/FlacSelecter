"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import type { ReactNode } from "react";

interface FormData {
  tunnelKeizyo: number;
  fukukouMakiatsu: number;
  invert: number;
  haimenKudo: number;
  henkeiMode: number;
  lockBoltKou: number;
  lockBoltLength: number;
  fukukouKyori: number;
  fukukouKeisya: number;
  fukukouKoubai: number;
  fukukouKotei: number;
  honkouMakiatsu: number;
  honkouKyori: number;
  honkouKeisya: number;
  honkouKoubai: number;
  honkouKotei: number;
  kijunMen: number;
  kijunKoubai: number;
  kijunKotei: number;
}

export default function OutputPage() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<FormData>({
    tunnelKeizyo: 1,
    fukukouMakiatsu: 30,
    invert: 0,
    haimenKudo: 0,
    henkeiMode: 1,
    lockBoltKou: 0,
    lockBoltLength: 0,
    fukukouKyori: 0,
    fukukouKeisya: 0,
    fukukouKoubai: 0,
    fukukouKotei: 0,
    honkouMakiatsu: 0,
    honkouKyori: 0,
    honkouKeisya: 0,
    honkouKoubai: 0,
    honkouKotei: 0,
    kijunMen: 0,
    kijunKoubai: 0,
    kijunKotei: 0,
  });

  const getTunnelKeizyoText = (value: number): string => {
    switch (value) {
      case 1: return '単線';
      case 2: return '複線';
      case 3: return '新幹線（在来工法）';
      default: return '';
    }
  };

  const getInvertText = (value: number): string => {
    return value === 0 ? 'なし' : 'あり';
  };

  const getHaimenKudoText = (value: number): string => {
    return value === 0 ? 'なし' : 'あり';
  };

  const getHenkeiModeText = (value: number): string => {
    switch (value) {
      case 1: return '側壁全体押出し';
      case 2: return '側壁上部前傾';
      case 3: return '脚部押出し';
      case 4: return '盤ぶくれ';
      default: return '';
    }
  };

  const getLockBoltKouText = (value: number): string => {
    switch (value) {
      case 0: return 'なし';
      case 4: return '4本';
      case 8: return '8本';
      case 12: return '12本';
      default: return '';
    }
  };

  const getLockBoltLengthText = (value: number): string => {
    switch (value) {
      case 3: return '3m';
      case 4: return '4m';
      case 6: return '6m';
      case 8: return '8m';
      default: return '';
    }
  };

  useEffect(() => {
    if (!searchParams) return;
    
    const data: Partial<FormData> = {};
    for (const [key, value] of searchParams.entries()) {
      if (key in formData) {
        data[key as keyof FormData] = Number(value);
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
            <span>{getTunnelKeizyoText(formData.tunnelKeizyo)}</span>
          </div>
          <div className={styles.dataItem}>
            <label>副坑巻圧:</label>
            <span>{formData.fukukouMakiatsu} cm</span>
          </div>
          <div className={styles.dataItem}>
            <label>インバート:</label>
            <span>{getInvertText(formData.invert)}</span>
          </div>
          <div className={styles.dataItem}>
            <label>背面空洞:</label>
            <span>{getHaimenKudoText(formData.haimenKudo)}</span>
          </div>
          <div className={styles.dataItem}>
            <label>変形モード:</label>
            <span>{getHenkeiModeText(formData.henkeiMode)}</span>
          </div>
          <div className={styles.dataItem}>
            <label>ロックボルト工:</label>
            <span>{getLockBoltKouText(formData.lockBoltKou)}</span>
          </div>
          <div className={styles.dataItem}>
            <label>ロックボルト長:</label>
            <span>{getLockBoltLengthText(formData.lockBoltLength)}</span>
          </div>
          <div className={styles.dataItem}>
            <label>副坑距離:</label>
            <span>{formData.fukukouKyori} m</span>
          </div>
          <div className={styles.dataItem}>
            <label>副坑傾斜:</label>
            <span>{formData.fukukouKeisya} 度</span>
          </div>
          <div className={styles.dataItem}>
            <label>副坑勾配:</label>
            <span>{formData.fukukouKoubai} %</span>
          </div>
          <div className={styles.dataItem}>
            <label>副坑高低:</label>
            <span>{formData.fukukouKotei} m</span>
          </div>
          <div className={styles.dataItem}>
            <label>本坑巻圧:</label>
            <span>{formData.honkouMakiatsu} cm</span>
          </div>
          <div className={styles.dataItem}>
            <label>本坑距離:</label>
            <span>{formData.honkouKyori} m</span>
          </div>
          <div className={styles.dataItem}>
            <label>本坑傾斜:</label>
            <span>{formData.honkouKeisya} 度</span>
          </div>
          <div className={styles.dataItem}>
            <label>本坑勾配:</label>
            <span>{formData.honkouKoubai} %</span>
          </div>
          <div className={styles.dataItem}>
            <label>本坑高低:</label>
            <span>{formData.honkouKotei} m</span>
          </div>
          <div className={styles.dataItem}>
            <label>基準面:</label>
            <span>{formData.kijunMen} m</span>
          </div>
          <div className={styles.dataItem}>
            <label>基準勾配:</label>
            <span>{formData.kijunKoubai} %</span>
          </div>
          <div className={styles.dataItem}>
            <label>基準高低:</label>
            <span>{formData.kijunKotei} m</span>
          </div>
        </div>
      </div>
    </div>
  );
}
