import {
  Activity,
  Apple,
  Armchair,
  Baby,
  Bone,
  BoneIcon,
  Brain,
  BrainCircuit,
  Droplets,
  Dumbbell,
  Ear,
  Eye,
  Factory,
  Gavel,
  HeartPulse,
  Home,
  Microscope,
  Pill,
  Radiation,
  Shield,
  Skull,
  Slice,
  Stethoscope,
  Syringe,
  TestTube2,
  WheatOff,
  Wind,
} from 'lucide-react';

const DefaultIcon = Stethoscope;

export const medicalSpecialties = [
  { label: 'Alergologia', icon: WheatOff },
  {
    label: 'Anestesiologia',
    icon: Syringe,
  },
  { label: 'Angiologia', icon: HeartPulse },
  {
    label: 'Cancerologia',
    icon: DefaultIcon,
  },
  {
    label: 'Cardiologia',
    icon: HeartPulse,
  },
  {
    label: 'Cirurgia Cardiovascular',
    icon: Slice,
  },
  {
    label: 'Cirurgia de Cabeça e Pescoço',
    icon: Slice,
  },
  {
    label: 'Cirurgia do Aparelho Digestivo',
    icon: Slice,
  },
  {
    label: 'Cirurgia Geral',
    icon: Slice,
  },
  {
    label: 'Cirurgia Pediátrica',
    icon: Baby,
  },
  {
    label: 'Cirurgia Plástica',
    icon: Slice,
  },
  {
    label: 'Cirurgia Torácica',
    icon: Slice,
  },
  {
    label: 'Cirurgia Vascular',
    icon: Slice,
  },
  {
    label: 'Clínica Médica',
    icon: Stethoscope,
  },
  {
    label: 'Dermatologia',
    icon: Armchair,
  },
  {
    label: 'Endocrinologia e Metabologia',
    icon: Activity,
  },
  { label: 'Endoscopia', icon: Microscope },
  {
    label: 'Gastroenterologia',
    icon: Stethoscope,
  },
  { label: 'Geriatria', icon: Home },
  {
    label: 'Ginecologia e Obstetrícia',
    icon: Baby,
  },
  {
    label: 'Hematologia e Hemoterapia',
    icon: Droplets,
  },
  {
    label: 'Hepatologia',
    icon: DefaultIcon,
  },
  {
    label: 'Homeopatia',
    icon: DefaultIcon,
  },
  { label: 'Infectologia', icon: Shield },
  {
    label: 'Mastologia',
    icon: DefaultIcon,
  },
  {
    label: 'Medicina de Emergência',
    icon: Shield,
  },
  {
    label: 'Medicina do Esporte',
    icon: Dumbbell,
  },
  {
    label: 'Medicina do Trabalho',
    icon: Factory,
  },
  {
    label: 'Medicina da Família e Comunidade',
    icon: Home,
  },
  {
    label: 'Medicina Física e Reabilitação',
    icon: Armchair,
  },
  {
    label: 'Medicina Intensiva',
    icon: Activity,
  },
  {
    label: 'Medicina Legal e Perícia Médica',
    icon: Gavel,
  },
  {
    label: 'Nefrologia',
    icon: DefaultIcon,
  },
  {
    label: 'Neurocirurgia',
    icon: Brain,
  },
  { label: 'Neurologia', icon: Brain },
  { label: 'Nutrologia', icon: Apple },
  { label: 'Oftalmologia', icon: Eye },
  {
    label: 'Oncologia Clínica',
    icon: Pill,
  },
  {
    label: 'Ortopedia e Traumatologia',
    icon: Bone,
  },
  {
    label: 'Otorrinolaringologia',
    icon: Ear,
  },
  { label: 'Patologia', icon: Microscope },
  {
    label: 'Patologia Clínica/Medicina Laboratorial',
    icon: TestTube2,
  },
  { label: 'Pediatria', icon: Baby },
  { label: 'Pneumologia', icon: Wind },
  {
    label: 'Psiquiatria',
    icon: BrainCircuit,
  },
  {
    label: 'Radiologia e Diagnóstico por Imagem',
    icon: Skull,
  },
  {
    label: 'Radioterapia',
    icon: Radiation,
  },
  {
    label: 'Reumatologia',
    icon: BoneIcon,
  },
  { label: 'Urologia', icon: DefaultIcon },
];
