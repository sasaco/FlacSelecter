import Papa from 'papaparse';

// CSV data structure
interface CSVRow {
  index: number;           // First column: case number
  caseString: string;      // Second column: case string (e.g., case1-30-0-0-1-2-0-0-0-0-0)
  values: number[];        // Numerical values including displacement
  effectiveness: number[]; // Five effectiveness values for different speed ranges:
                         // [0]: < 1mm/day
                         // [1]: 1-2mm/day
                         // [2]: 2-3mm/day
                         // [3]: 3-10mm/day
                         // [4]: >= 10mm/day
}

// Function to convert raw CSV row to structured data
function parseCSVRow(row: string[]): CSVRow {
  return {
    index: parseInt(row[0].replace('case', ''), 10),
    caseString: row[1],
    values: [parseFloat(row[2])], // First value is displacement
    effectiveness: [
      parseFloat(row[3]), // < 1mm/day
      parseFloat(row[4]), // 1-2mm/day
      parseFloat(row[5]), // 2-3mm/day
      parseFloat(row[6]), // 3-10mm/day
      parseFloat(row[7])  // >= 10mm/day
    ]
  };
}

// Types for our data structures
export interface InputData {
  tunnelKeizyo: number;
  fukukouMakiatsu: number;
  invert: number;
  haimenKudo: number;
  henkeiMode: number;
  jiyamaKyodo: number;
  naikuHeniSokudo: number;
  uragomeChunyuko: number;
  lockBoltKou: number;
  lockBoltLength: number;
  downwardLockBoltKou: number;
  downwardLockBoltLength: number;
  uchimakiHokyo: number;
  MonitoringData: string;
}

interface TunnelCase {
  caseString: string;
  values: number[];
  effectiveness: number[];
}

interface CalculationResult {
  displacement: number;
  effectiveness: number;
}

// Helper function to create case string
function createCaseString(numbers: number[]): string {
  return 'case' + numbers.join('-');
}

// Core calculation functions ported from Angular service
function getTargetData(data: InputData, flg: boolean = true): number[] {
  let makiatsu: number = data.fukukouMakiatsu;
  let kyodo: number = data.jiyamaKyodo;
  
  if (flg === true) {
    // Adjust thickness and ground strength for intermediate values
    if (data.tunnelKeizyo < 3) { // Single/Double track
      makiatsu = (makiatsu < 45) ? 30 : 60;
      kyodo = (kyodo < 5) ? 2 : 8;
    } else { // Shinkansen
      makiatsu = (makiatsu < 60) ? 50 : 70;
      kyodo = (kyodo < 5) ? 2 : 8;
    }
  }

  const targetData: number[] = [
    data.tunnelKeizyo,
    makiatsu,
    data.invert,
    data.haimenKudo,
    data.henkeiMode,
    kyodo,
    data.uragomeChunyuko,
    data.lockBoltKou,
    data.uchimakiHokyo,
    data.downwardLockBoltKou
  ];

  // Use appropriate rock bolt length
  let lockBoltLength: number = data.lockBoltLength;
  if (lockBoltLength <= 0) {
    lockBoltLength = data.downwardLockBoltLength;
  }
  targetData.push(lockBoltLength);

  return targetData;
}


export function getCaseStrings(data: InputData, flg: boolean = true): string[] {
  const result: string[] = [];
  
  // Base case
  let numbers = getTargetData(data, flg);
  result.push(createCaseString(numbers));

  // Non-reinforced case
  numbers = getTargetData(data, flg);
  for (let i = 6; i < numbers.length; i++) {
    numbers[i] = 0;
  }
  result.push(createCaseString(numbers));

  // Reinforced case
  numbers = getTargetData(data, flg);
  if (numbers[0] < 3) {
    numbers[1] = (numbers[1] < 45) ? 30 : 60; // Single/Double track
  } else {
    numbers[1] = (numbers[1] < 60) ? 50 : 70; // Shinkansen
  }
  numbers[5] = (numbers[5] < 5) ? 2 : 8;
  result.push(createCaseString(numbers));

  // Lower bound, Lower bound
  numbers = getTargetData(data, flg);
  numbers[1] = (numbers[0] < 3) ? 30 : 50;
  numbers[5] = 2;
  result.push(createCaseString(numbers));

  // Upper bound, Lower bound
  numbers = getTargetData(data, flg);
  numbers[1] = (numbers[0] < 3) ? 60 : 70;
  numbers[5] = 2;
  result.push(createCaseString(numbers));

  // Lower bound, Upper bound
  numbers = getTargetData(data, flg);
  numbers[1] = (numbers[0] < 3) ? 30 : 50;
  numbers[5] = 8;
  result.push(createCaseString(numbers));

  // Upper bound, Upper bound
  numbers = getTargetData(data, flg);
  numbers[1] = (numbers[0] < 3) ? 60 : 70;
  numbers[5] = 8;
  result.push(createCaseString(numbers));

  return result;
}

export async function loadCaseData(): Promise<TunnelCase[]> {
  try {
    const response = await fetch('/data/data.csv');
    if (!response.ok) {
      throw new Error('Failed to load CSV data');
    }
    
    const text = await response.text();
    const result = Papa.parse(text, { 
      header: false,
      skipEmptyLines: true
    });
    
    return result.data
      .slice(1) // Skip header row
      .map(row => {
        const parsedRow = parseCSVRow(row as string[]);
        return {
          caseString: parsedRow.caseString,
          values: parsedRow.values,
          effectiveness: parsedRow.effectiveness
        };
      });
  } catch (error) {
    console.error('Error loading case data:', error);
    throw error;
  }
}

function getEffection(data: TunnelCase[], caseString: string, naikuHeniSokudo: number): number {
  const matchingCase = data.find(c => c.caseString === caseString);
  if (!matchingCase) return -1;

  // Get effectiveness based on displacement speed
  if (naikuHeniSokudo < 1) {
    return matchingCase.effectiveness[0];
  } else if (naikuHeniSokudo < 2) {
    return matchingCase.effectiveness[1];
  } else if (naikuHeniSokudo < 3) {
    return matchingCase.effectiveness[2];
  } else if (naikuHeniSokudo < 10) {
    return matchingCase.effectiveness[3];
  } else {
    return matchingCase.effectiveness[4];
  }
}

export function calculateEffectiveness(
  data: TunnelCase[],
  inputData: InputData
): CalculationResult | null {
  const caseStrings = getCaseStrings(inputData, false);
  
  // Find exact match
  const exactMatch = data.find(c => c.caseString === caseStrings[0]);
  if (exactMatch) {
    return {
      displacement: exactMatch.values[0],
      effectiveness: getEffection(data, caseStrings[0], inputData.naikuHeniSokudo)
    };
  }

  // Interpolate between boundary cases
  const boundaryData: number[][] = [[-1, -1], [-1, -1]];
  let foundCases = 0;

  // Collect boundary cases for interpolation
  for (let i = 3; i <= 6; i++) {
    const matchingCase = data.find(c => c.caseString === caseStrings[i]);
    if (matchingCase) {
      const row = Math.floor((i - 3) / 2);
      const col = (i - 3) % 2;
      boundaryData[row][col] = getEffection(data, caseStrings[i], inputData.naikuHeniSokudo);
      foundCases++;
    }
  }

  if (foundCases < 4) return null;

  // Interpolate using thickness and ground strength
  const temp1: number = (boundaryData[1][0] - boundaryData[0][0]) * inputData.fukukouMakiatsu / 30 + 2 * boundaryData[0][0] - boundaryData[1][0];
  const temp2: number = (boundaryData[1][1] - boundaryData[0][1]) * inputData.fukukouMakiatsu / 30 + 2 * boundaryData[0][1] - boundaryData[1][1];

  // Final interpolation based on ground strength
  const temp3: number = (temp2 - temp1) * inputData.jiyamaKyodo / 6 + 4 * temp1 / 3 - temp2 / 3;

  // Round to one decimal place
  const effectiveness = Math.round(temp3 * 10) / 10;

  return {
    displacement: 0, // TODO: Calculate displacement once CSV parsing is implemented
    effectiveness
  };
}
