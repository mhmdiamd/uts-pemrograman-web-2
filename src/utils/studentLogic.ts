export const calculateStatus = (mat: number, ing: number, umum: number) => {
  const rataRata = (mat + ing + umum) / 3;
  let keterangan = 'Tidak Lulus';
  if (rataRata >= 70) keterangan = 'Lulus';
  else if (rataRata >= 60) keterangan = 'Cadangan';
  return { rataRata, keterangan };
};

export const generateKodePendaftaran = (tempatTesKey: string, gelombangNum: string, bulanTesIndex: number) => {
  const randomId = Math.floor(100 + Math.random() * 900);
  return `${tempatTesKey}${gelombangNum}-${randomId}-${bulanTesIndex}`;
};
