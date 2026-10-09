import type { PhotoName } from "@/lib/images";

export const navigation = [
  { href: "#empresa", label: "Quem somos" },
  { href: "#servicos", label: "Serviços" },
  { href: "#materiais", label: "Materiais" },
  { href: "#projetos", label: "Projetos" },
] as const;

export const services: {
  photo: PhotoName;
  alt: string;
  category: string;
  title: string;
  description: string;
  tags: [string, string];
  cta: string;
  /** Name used in the pre-filled WhatsApp message. */
  service: string;
}[] = [
  {
    photo: "torch",
    alt: "Corte a maçarico de aço carbono — imagem ilustrativa",
    category: "Oxicorte",
    title: "Corte a maçarico",
    description:
      "Corte térmico para peças em aço carbono, conforme as dimensões e o desenho do seu projeto.",
    tags: ["Aço A36", "Aço 1020"],
    cta: "Orçar corte a maçarico",
    service: "Corte a maçarico",
  },
  {
    photo: "laser",
    alt: "Equipamento de corte a laser em chapa — imagem ilustrativa",
    category: "Corte a laser",
    title: "Detalhes que fazem a diferença",
    description:
      "Recortes e geometrias sob medida em aço carbono e inox, para dar forma à sua ideia.",
    tags: ["A36 e 1020", "Inox 304"],
    cta: "Orçar corte a laser",
    service: "Corte a laser",
  },
  {
    photo: "bending",
    alt: "Ferramentas de uma prensa dobradeira — imagem ilustrativa",
    category: "Dobra de chapas",
    title: "Além do corte, a forma",
    description:
      "Dobra de chapas para criar ângulos e perfis de acordo com as especificações da sua peça.",
    tags: ["Ângulos e perfis", "Sob consulta"],
    cta: "Orçar dobra de chapas",
    service: "Dobra de chapas",
  },
];

export const materials = [
  {
    family: "Aço carbono",
    grade: "A36",
    description: "Para componentes e aplicações estruturais.",
  },
  {
    family: "Aço carbono",
    grade: "1020",
    description: "Versatilidade para peças e componentes.",
  },
  {
    family: "Aço inoxidável",
    grade: "304",
    description: "Resistência à corrosão em diversas aplicações.",
  },
] as const;

export type GallerySlide = {
  photo: PhotoName;
  alt: string;
  label: string;
  /** Optional crop to highlight a detail of the same photo (1–3). */
  zoom?: number;
  /** CSS object-position used together with zoom. */
  position?: string;
};

export type Gallery = {
  id: string;
  title: string;
  caption: string;
  slides: GallerySlide[];
};

// Add more slides per service when real photos are available.
export const galleries: Gallery[] = [
  {
    id: "laser",
    title: "Corte a laser",
    caption: "Recortes sob medida",
    slides: [
      {
        photo: "laser",
        alt: "Corte a laser em chapa metálica",
        label: "Visão geral",
      },
      {
        photo: "laser",
        alt: "Detalhe do corte a laser",
        label: "Detalhe do corte",
        zoom: 1.6,
        position: "48% 66%",
      },
    ],
  },
  {
    id: "oxicorte",
    title: "Oxicorte",
    caption: "Aço carbono",
    slides: [
      {
        photo: "torch",
        alt: "Processo de corte a maçarico",
        label: "Visão geral",
      },
      {
        photo: "torch",
        alt: "Detalhe do corte a maçarico",
        label: "Detalhe do corte",
        zoom: 1.6,
        position: "50% 66%",
      },
    ],
  },
  {
    id: "dobra",
    title: "Dobra de chapas",
    caption: "Ângulos e perfis",
    slides: [
      {
        photo: "bending",
        alt: "Ferramentas de uma prensa dobradeira",
        label: "Visão geral",
      },
      {
        photo: "bending",
        alt: "Detalhe das ferramentas de dobra",
        label: "Detalhe das ferramentas",
        zoom: 1.5,
        position: "54% 56%",
      },
    ],
  },
];

export const faq = [
  {
    question: "O que preciso enviar para pedir um orçamento?",
    answer:
      "Envie o desenho técnico ou as medidas da peça, o material desejado, a espessura da chapa, a quantidade e se há necessidade de dobra. Se ainda não tiver todos os detalhes, entre em contato para avaliarmos o projeto.",
  },
  {
    question: "Quais materiais a JF Oxicorte trabalha?",
    answer:
      "Trabalhamos com aço carbono A36 e 1020 e aço inox 304. O processo e a viabilidade de cada peça são avaliados conforme o material, a espessura e o desenho.",
  },
  {
    question: "Qual a diferença entre oxicorte e corte a laser?",
    answer:
      "O oxicorte utiliza uma chama e um jato de oxigênio para cortar aço carbono. O laser utiliza um feixe concentrado e permite recortes em aço carbono e inox. A escolha depende do material, da espessura e da geometria da peça.",
  },
  {
    question: "Vocês também fazem dobra de chapas?",
    answer:
      "Sim. Envie as medidas, os ângulos, o material e a espessura da chapa para avaliarmos a dobra junto com o seu projeto.",
  },
] as const;
