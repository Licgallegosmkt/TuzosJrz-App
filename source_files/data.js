// TuzosJrz — mock data

const CATEGORIES = ['Sub-8', 'Sub-10', 'Sub-12', 'Sub-14', 'Sub-16'];

const POSITIONS = ['POR', 'DFC', 'LTD', 'LTI', 'MCD', 'MC', 'MCO', 'ED', 'EI', 'DC'];

const FIRST = ['Diego','Iker','Santiago','Emiliano','Mateo','Leonel','Bruno','Alan','Rodrigo','Sebastián','Ángel','Julián','Andrés','Pablo','Hugo','Óscar','Luis','Carlos','Fernando','Jorge','Miguel','Adrián','Cristian','Kevin','Tadeo'];
const LAST = ['Hernández','Martínez','García','López','Sánchez','Ramírez','Torres','Cruz','Flores','Rivera','Vargas','Mendoza','Castillo','Ortiz','Reyes','Guerrero','Medina','Aguilar','Rojas','Domínguez'];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rint = (a, b) => Math.floor(a + Math.random() * (b - a + 1));

// Deterministic-ish seed so the app is stable between renders
let seed = 42;
function srand() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
const pick = (arr) => arr[Math.floor(srand() * arr.length)];
const pint = (a, b) => Math.floor(a + srand() * (b - a + 1));

function buildPlayers() {
  const list = [];
  let id = 1;
  CATEGORIES.forEach((cat, ci) => {
    const n = 14 + ci; // más chicos por categoría en las mayores
    for (let i = 0; i < n; i++) {
      const first = pick(FIRST);
      const last = pick(LAST);
      const pos = pick(POSITIONS);
      const baseAge = 8 + ci * 2;
      const birthYear = 2026 - baseAge - pint(0, 1);
      const paidStatus = pick(['al-dia', 'al-dia', 'al-dia', 'pendiente', 'atrasado']);
      const medStatus = pick(['apto', 'apto', 'apto', 'apto', 'recuperacion', 'lesionado']);
      list.push({
        id: id++,
        first, last,
        name: `${first} ${last}`,
        number: pint(1, 30),
        position: pos,
        category: cat,
        birthYear,
        birthMonth: pint(0, 11), // 0-11
        birthDay: pint(1, 28),
        age: 2026 - birthYear,
        phone: `+52 771 ${pint(100,999)} ${pint(1000,9999)}`,
        email: `${first.toLowerCase()}.${last.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}@correo.mx`,
        tutor: baseAge < 16 ? { name: `${pick(FIRST)} ${last}`, phone: `+52 771 ${pint(100,999)} ${pint(1000,9999)}`, relation: pick(['Padre','Madre','Tutor']) } : null,
        paymentStatus: paidStatus,
        monthlyFee: 850,
        balance: paidStatus === 'atrasado' ? -1700 : paidStatus === 'pendiente' ? -850 : 0,
        medical: {
          status: medStatus,
          height: pint(130, 178),
          weight: pint(28, 72),
          bloodType: pick(['O+','A+','B+','O-','A-','AB+']),
          allergies: pick(['Ninguna','Ninguna','Ninguna','Polen','Penicilina','Lácteos']),
          medication: pick(['Ninguna','Ninguna','Ninguna','Salbutamol','Antihistamínico']),
          lastCheckup: `${pint(1,28)} Ago 2026`,
          emergencyContact: { name: `${pick(FIRST)} ${last}`, phone: `+52 771 ${pint(100,999)} ${pint(1000,9999)}` },
          injuries: medStatus !== 'apto' ? [{ date: '12 Sep 2026', type: pick(['Esguince tobillo','Contractura isquiotibial','Golpe rodilla']), notes: 'En seguimiento con fisio.' }] : [],
          notes: medStatus === 'apto' ? '' : 'Trabajo diferenciado hasta nueva evaluación.',
        },
        attendance: {
          rate: pint(72, 98),
          last: pick(['P','P','P','P','A','J']),
        },
      });
    }
  });
  return list;
}

const PLAYERS = buildPlayers();

const UPCOMING = [
  { id: 1, kind: 'training', title: 'Entrenamiento', category: 'Sub-12', date: 'Hoy', time: '17:00', place: 'Cancha 2 · CAR Pachuca' },
  { id: 2, kind: 'match', title: 'vs Tigres Jr.', category: 'Sub-14', date: 'Sáb 26', time: '10:30', place: 'Estadio Hidalgo' },
  { id: 3, kind: 'training', title: 'Entrenamiento', category: 'Sub-10', date: 'Mañana', time: '16:00', place: 'Cancha 1 · CAR Pachuca' },
  { id: 4, kind: 'match', title: 'vs Cruz Azul Jr.', category: 'Sub-16', date: 'Dom 27', time: '12:00', place: 'Cancha CAR' },
];

const RECENT_ACTIVITY = [
  { id: 1, icon: '💳', text: 'Pago recibido — Diego Hernández', meta: 'Cuota Sep · $850', when: 'hace 12 min' },
  { id: 2, icon: '📋', text: 'Asistencia registrada — Sub-14', meta: '18 de 20 presentes', when: 'hace 2 h' },
  { id: 3, icon: '🩹', text: 'Alta médica — Mateo Rivera', meta: 'Apto para entrenar', when: 'hace 5 h' },
  { id: 4, icon: '📝', text: 'Nueva jugada guardada', meta: 'Salida presión alta · Sub-16', when: 'ayer' },
];

// Formations
const FORMATIONS_11 = {
  '4-3-3': [
    { x: 8,  y: 50 },
    { x: 22, y: 15 }, { x: 22, y: 37 }, { x: 22, y: 63 }, { x: 22, y: 85 },
    { x: 45, y: 28 }, { x: 45, y: 50 }, { x: 45, y: 72 },
    { x: 72, y: 20 }, { x: 78, y: 50 }, { x: 72, y: 80 },
  ],
  '4-4-2': [
    { x: 8, y: 50 },
    { x: 22, y: 15 }, { x: 22, y: 37 }, { x: 22, y: 63 }, { x: 22, y: 85 },
    { x: 45, y: 18 }, { x: 45, y: 40 }, { x: 45, y: 60 }, { x: 45, y: 82 },
    { x: 72, y: 35 }, { x: 72, y: 65 },
  ],
  '3-5-2': [
    { x: 8, y: 50 },
    { x: 22, y: 25 }, { x: 22, y: 50 }, { x: 22, y: 75 },
    { x: 40, y: 12 }, { x: 45, y: 33 }, { x: 45, y: 50 }, { x: 45, y: 67 }, { x: 40, y: 88 },
    { x: 72, y: 38 }, { x: 72, y: 62 },
  ],
  '4-2-3-1': [
    { x: 8, y: 50 },
    { x: 22, y: 15 }, { x: 22, y: 37 }, { x: 22, y: 63 }, { x: 22, y: 85 },
    { x: 38, y: 38 }, { x: 38, y: 62 },
    { x: 55, y: 20 }, { x: 55, y: 50 }, { x: 55, y: 80 },
    { x: 78, y: 50 },
  ],
  '4-1-4-1': [
    { x: 8, y: 50 },
    { x: 22, y: 15 }, { x: 22, y: 37 }, { x: 22, y: 63 }, { x: 22, y: 85 },
    { x: 34, y: 50 },
    { x: 50, y: 15 }, { x: 50, y: 38 }, { x: 50, y: 62 }, { x: 50, y: 85 },
    { x: 78, y: 50 },
  ],
  '3-4-3': [
    { x: 8, y: 50 },
    { x: 22, y: 25 }, { x: 22, y: 50 }, { x: 22, y: 75 },
    { x: 42, y: 18 }, { x: 42, y: 40 }, { x: 42, y: 60 }, { x: 42, y: 82 },
    { x: 72, y: 20 }, { x: 78, y: 50 }, { x: 72, y: 80 },
  ],
  '4-3-1-2': [
    { x: 8, y: 50 },
    { x: 22, y: 15 }, { x: 22, y: 37 }, { x: 22, y: 63 }, { x: 22, y: 85 },
    { x: 40, y: 25 }, { x: 40, y: 50 }, { x: 40, y: 75 },
    { x: 58, y: 50 },
    { x: 74, y: 35 }, { x: 74, y: 65 },
  ],
  '4-4-1-1': [
    { x: 8, y: 50 },
    { x: 22, y: 15 }, { x: 22, y: 37 }, { x: 22, y: 63 }, { x: 22, y: 85 },
    { x: 42, y: 18 }, { x: 42, y: 40 }, { x: 42, y: 60 }, { x: 42, y: 82 },
    { x: 60, y: 50 },
    { x: 78, y: 50 },
  ],
};

const FORMATIONS_8 = {
  '3-2-2': [
    { x: 10, y: 50 },
    { x: 28, y: 22 }, { x: 28, y: 50 }, { x: 28, y: 78 },
    { x: 50, y: 33 }, { x: 50, y: 67 },
    { x: 72, y: 33 }, { x: 72, y: 67 },
  ],
  '3-3-1': [
    { x: 10, y: 50 },
    { x: 28, y: 22 }, { x: 28, y: 50 }, { x: 28, y: 78 },
    { x: 50, y: 22 }, { x: 50, y: 50 }, { x: 50, y: 78 },
    { x: 76, y: 50 },
  ],
  '2-3-2': [
    { x: 10, y: 50 },
    { x: 28, y: 33 }, { x: 28, y: 67 },
    { x: 50, y: 22 }, { x: 50, y: 50 }, { x: 50, y: 78 },
    { x: 72, y: 33 }, { x: 72, y: 67 },
  ],
  '3-1-3': [
    { x: 10, y: 50 },
    { x: 28, y: 22 }, { x: 28, y: 50 }, { x: 28, y: 78 },
    { x: 48, y: 50 },
    { x: 70, y: 22 }, { x: 74, y: 50 }, { x: 70, y: 78 },
  ],
  '2-4-1': [
    { x: 10, y: 50 },
    { x: 28, y: 33 }, { x: 28, y: 67 },
    { x: 50, y: 18 }, { x: 50, y: 40 }, { x: 50, y: 60 }, { x: 50, y: 82 },
    { x: 76, y: 50 },
  ],
  '3-2-1-1': [
    { x: 10, y: 50 },
    { x: 28, y: 22 }, { x: 28, y: 50 }, { x: 28, y: 78 },
    { x: 46, y: 33 }, { x: 46, y: 67 },
    { x: 62, y: 50 },
    { x: 78, y: 50 },
  ],
  '4-2-1': [
    { x: 10, y: 50 },
    { x: 28, y: 18 }, { x: 28, y: 40 }, { x: 28, y: 60 }, { x: 28, y: 82 },
    { x: 52, y: 33 }, { x: 52, y: 67 },
    { x: 76, y: 50 },
  ],
};

// Payments summary
function paymentsSummary() {
  const total = PLAYERS.length;
  const alDia = PLAYERS.filter(p => p.paymentStatus === 'al-dia').length;
  const pendiente = PLAYERS.filter(p => p.paymentStatus === 'pendiente').length;
  const atrasado = PLAYERS.filter(p => p.paymentStatus === 'atrasado').length;
  const cobrado = alDia * 850;
  const porCobrar = pendiente * 850 + atrasado * 1700;
  return { total, alDia, pendiente, atrasado, cobrado, porCobrar };
}

// Birthdays this month
function birthdaysThisMonth(monthIdx) {
  const m = monthIdx != null ? monthIdx : new Date().getMonth();
  return PLAYERS
    .filter(p => p.birthMonth === m)
    .sort((a, b) => a.birthDay - b.birthDay);
}

// Birthdays this week (helper used in dashboard highlight)
function birthdaysNext30(refDate) {
  const now = refDate || new Date(2026, 8, 21);
  return PLAYERS
    .map(p => {
      const bd = new Date(now.getFullYear(), p.birthMonth, p.birthDay);
      if (bd < now) bd.setFullYear(now.getFullYear() + 1);
      const days = Math.floor((bd - now) / (1000 * 60 * 60 * 24));
      return { ...p, daysUntil: days, birthDate: bd };
    })
    .filter(p => p.daysUntil <= 30)
    .sort((a, b) => a.daysUntil - b.daysUntil);
}

window.TZ_DATA = { CATEGORIES, POSITIONS, PLAYERS, UPCOMING, RECENT_ACTIVITY, FORMATIONS_11, FORMATIONS_8, paymentsSummary, birthdaysThisMonth, birthdaysNext30 };
