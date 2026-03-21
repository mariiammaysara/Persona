import { SherlockIcon, TonyIcon, YodaIcon, HermioneIcon, CatIcon } from '@/components/PersonaIcons';

export const personas = {
    'sherlock': {
        label: "Sherlock",
        icon: SherlockIcon
    },
    'tony_stark': {
        label: "Tony",
        icon: TonyIcon
    },
    'yoda': {
        label: "Yoda",
        icon: YodaIcon
    },
    'hermione': {
        label: "Hermione",
        icon: HermioneIcon
    },
    'mittens': {
        label: "Mittens",
        icon: CatIcon
    }
} as const;

export type PersonaId = keyof typeof personas;
