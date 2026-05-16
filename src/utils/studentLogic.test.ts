import { describe, it, expect } from 'vitest';
import { calculateStatus, generateKodePendaftaran } from './studentLogic';

describe('calculateStatus', () => {
  it('should return "Lulus" when average is 70 or above', () => {
    const result = calculateStatus(70, 70, 70);
    expect(result.keterangan).toBe('Lulus');
    expect(result.rataRata).toBe(70);
  });

  it('should return "Lulus" with exactly 70.0', () => {
    expect(calculateStatus(70, 70, 70).keterangan).toBe('Lulus');
  });

  it('should return "Lulus" with high scores', () => {
    expect(calculateStatus(100, 100, 100).keterangan).toBe('Lulus');
  });

  it('should return "Cadangan" when average is between 60 and 69', () => {
    const result = calculateStatus(60, 60, 60);
    expect(result.keterangan).toBe('Cadangan');
    expect(result.rataRata).toBe(60);
  });

  it('should return "Cadangan" with exactly 60.0', () => {
    expect(calculateStatus(60, 60, 60).keterangan).toBe('Cadangan');
  });

  it('should return "Cadangan" with 69.9', () => {
    // 69.9 * 3 = 209.7
    expect(calculateStatus(69.9, 69.9, 69.9).keterangan).toBe('Cadangan');
  });

  it('should return "Tidak Lulus" when average is below 60', () => {
    const result = calculateStatus(59.9, 59.9, 59.9);
    expect(result.keterangan).toBe('Tidak Lulus');
  });

  it('should return "Tidak Lulus" with 0 scores', () => {
    expect(calculateStatus(0, 0, 0).keterangan).toBe('Tidak Lulus');
  });

  it('should handle mixed scores correctly (Pass)', () => {
    expect(calculateStatus(100, 50, 60).rataRata).toBe(70);
    expect(calculateStatus(100, 50, 60).keterangan).toBe('Lulus');
  });

  it('should handle mixed scores correctly (Waitlist)', () => {
    expect(calculateStatus(60, 60, 70).rataRata).toBeGreaterThan(60);
    expect(calculateStatus(60, 60, 70).keterangan).toBe('Cadangan');
  });
});

describe('generateKodePendaftaran', () => {
  it('should generate code with correct format', () => {
    const code = generateKodePendaftaran('A', '1', 5);
    expect(code).toMatch(/^A1-\d{3}-5$/);
  });

  it('should generate code with Viktor location', () => {
    const code = generateKodePendaftaran('V', '2', 12);
    expect(code).toMatch(/^V2-\d{3}-12$/);
  });

  it('should generate unique codes even with same parameters', () => {
    const code1 = generateKodePendaftaran('A', '1', 1);
    const code2 = generateKodePendaftaran('A', '1', 1);
    // There's a small chance they are same, but random 100-900 makes it unlikely
    // We just check they follow the pattern
    expect(code1).not.toBe(code2);
  });
});
