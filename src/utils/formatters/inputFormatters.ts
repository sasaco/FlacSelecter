import { InputData } from '../dataParser';

/**
 * Formats the first part of the input string description
 * @param data Input data object
 * @returns Formatted string describing tunnel type, thickness, and invert
 */
export function formatInputString1(data: InputData): string {
  let result: string;
  switch (data.tunnelKeizyo) {
    case 1:
      result = "単線";
      break;
    case 2:
      result = "複線";
      break;
    case 3:
      result = "新幹線";
      break;
    default:
      result = "";
  }
  result += "・巻厚 ";
  result += data.fukukouMakiatsu.toString();
  result += "cm・";
  result += (data.invert === 0) ? "インバートなし" : "インバートあり";
  return result;
}

/**
 * Formats the second part of the input string description
 * @param data Input data object
 * @returns Formatted string describing cavity, deformation mode, ground strength, and displacement speed
 */
export function formatInputString2(data: InputData): string {
  let result: string = (data.haimenKudo === 0) ? "背面空洞なし" : "背面空洞あり";
  result += "・";
  switch (data.henkeiMode) {
    case 1:
      result += "側壁全体押出し";
      break;
    case 2:
      result += "側壁上部前傾";
      break;
    case 3:
      result += "脚部押出し";
      break;
    case 4:
      result += "盤ぶくれ";
      break;
  }
  result += "・地山強度 ";
  result += data.jiyamaKyodo.toString();
  result += "MPa";
  result += "・内空変位速度 ";
  result += data.naikuHeniSokudo.toString();
  result += "mm / 年";
  return result;
}

/**
 * Formats the third part of the input string description
 * @param data Input data object
 * @returns Formatted string describing reinforcement details
 */
export function formatInputString3(data: InputData): string {
  let result: string = "";

  if (data.uragomeChunyuko === 0) {
    result += "裏込注入なし";
  } else {
    result += "裏込注入あり";
  }
  result += "・";
  if (data.lockBoltKou === 0) {
    result += "ロックボルトなし";
  } else {
    result += "ロックボルト ";
    result += data.lockBoltKou.toString();
    result += "本-";
    result += data.lockBoltLength.toString();
    result += "m";
  }    
  result += "・";
  if (data.uchimakiHokyo === 0) {
    result += "内巻なし";
  } else {
    result += "内巻あり";
  }
  if (data.downwardLockBoltKou !== 0) {
    result += "・";
    result += "下向きロックボルト ";
    result += data.downwardLockBoltKou.toString();
    result += "本-";
    result += data.downwardLockBoltLength.toString();
    result += "m";
  }    
  return result;
}
